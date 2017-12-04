/**
 * Created by Xinhe on 2017-09-20.
 */
const { TASK, SERVER, SCRIPT, SUBTASK } = require('../../../db')
const ApiError = require('../../../error/ApiError')
const ApiErrorNames = require('../../../error/ApiErrorNames')
const BusinessError = require('../../../error/BusinessError')
const Converter = require('../../converter')
const axios = require('axios')
const mqConfig = require('../../../conf/mqConfig')
//amqp
const { queue, username, password, host, port } = mqConfig
const open = require('amqplib')
    .connect(`amqp://${username}:${password}@${host}:${port}`)

const MessageType = {
    LOG: 'LOG',
    DONE: 'DONE',
    ERROR: 'ERROR',
    START: 'START',
}

//wss
// const ws=require('../../../bin/www')


open.then(conn => conn.createChannel())
    .then(ch => {
        let ok = ch.assertQueue(queue)
        ok = ok
            .then(() => {
                ch.prefetch(1)
            })
            .then(() => {
                ch.consume(
                    queue,
                    async msg => {
                        try {
                            if (msg !== null) {
                                // console.log('receive message ', msg.content.toString())
                                const ws = global.wss
                                const { taskId, subtaskId, type, message, scriptName, } = JSON.parse(msg.content.toString())
                                switch (type) {
                                case MessageType.LOG:
                                    ws.broadcast(JSON.stringify({
                                        type: MessageType.LOG,
                                        subtaskId,
                                        taskId,
                                        message
                                    }, null, ' '))
                                    break
                                case MessageType.DONE:
                                    // console.log('done message ', message)
                                    if (message == 0) { //success
                                        await TaskService.updateSubTaskStatus(subtaskId, SUBTASK.status.STOP)
                                        const taskSeq = TaskService.tasks[taskId]
                                        let finished = false
                                        if (!(!taskSeq || taskSeq.length == 0)) {
                                            const taskSchedule = taskSeq[0]
                                            let index
                                            for (let i = 0; i < taskSchedule.length; i++) {
                                                const subtask = taskSchedule[i]
                                                if (subtask.subtaskId == subtaskId) {
                                                    index = i
                                                    break
                                                }
                                            }

                                            taskSchedule.splice(index, 1)
                                            if (taskSchedule.length === 0) {  //完成当前并行子任务
                                                // console.log('finished sequence')
                                                taskSeq.shift()
                                                if (taskSeq.length === 0) { //完成所有子任务
                                                    await TaskService.stopTask(taskId, TASK.status.STOP, true)
                                                    finished = true
                                                } else {
                                                    const task = await TaskService.getTaskById(taskId)
                                                    if (task.status == 'start') {
                                                        await TaskService.sendSubTasks(taskSeq[0])
                                                    } else {
                                                        await TaskService.stopTask(taskId, TASK.status.ERROR, true)
                                                    }
                                                }
                                            }
                                        }

                                        ws.broadcast(JSON.stringify({
                                            type: MessageType.DONE,
                                            taskId,
                                            subtaskId,
                                            message: '完成当前脚本'
                                        }, null, ' '))

                                        if (finished) {
                                            ws.broadcast(JSON.stringify({
                                                type: MessageType.DONE,
                                                taskId,
                                                message: '完成当前任务'
                                            }, null, ' '))
                                        }
                                    }
                                    else {
                                        await Promise.all([TaskService.updateSubTaskStatus(subtaskId, SUBTASK.status.ERROR),
                                            TaskService.updateTaskStatus(taskId, TASK.status.ERROR)])
                                        console.log('error message 脚本错误退出', message)
                                        ws.broadcast(JSON.stringify({
                                            type: MessageType.ERROR,
                                            taskId,
                                            subtaskId,
                                            message: `脚本错误退出 : ${message}`
                                        }, null, ' '))
                                    }
                                    break
                                case MessageType.ERROR:
                                    await Promise.all([TaskService.updateSubTaskStatus(subtaskId, SUBTASK.status.ERROR),
                                        TaskService.updateTaskStatus(taskId, TASK.status.ERROR)])
                                    ws.broadcast(JSON.stringify({
                                        type: MessageType.ERROR,
                                        taskId,
                                        subtaskId,
                                        message: `脚本错误 : ${JSON.stringify(message)}`
                                    }, null, ' '))
                                    console.log('error message 脚本错误', message)
                                    break
                                }
                            }
                        } catch (e) {
                            console.log(e)
                        } finally {
                            ch.ack(msg)
                        }
                    }, {
                        noAck: false
                    })
            })
    })
    .catch((err) => {
        //todo add log
        console.log(err)
    })


class TaskService {

    static async startTask(taskId, auto = false) {
        const task = Converter.TaskConverter(await TASK.findById(taskId, {
            include: {
                model: SUBTASK,
                include: [{ model: SCRIPT }, { model: SERVER }]
            }
        }))

        const { subTasks, status } = task
        let couldRun = true
        if (status === TASK.status.START) {
            if (!auto)
                throw new BusinessError('任务运行中!')
            couldRun = false
        }
        if (!subTasks || subTasks.length === 0) {
            if (!auto)
                throw new BusinessError('没有子任务!')
            couldRun = false
        }
        if (couldRun) {
            subTasks.sort((a, b) => a.order - b.order)
            const taskSchedule = []
            let currentOrder = subTasks[0].order
            let arr = []
            taskSchedule.push(arr)
            arr.push(subTasks[0])
            for (let i = 1; i < subTasks.length; i++) {
                const subTask = subTasks[i]
                if (subTask.order !== currentOrder) {
                    arr = []
                    taskSchedule.push(arr)
                    currentOrder = subTask.order
                }
                arr.push(subTask)
            }


            TaskService.tasks[taskId] = taskSchedule

            await TaskService.sendSubTasks(taskSchedule[0])

            await TaskService.updateTaskStatus(taskId, TASK.status.START)
            const ws = global.wss
            ws.broadcast(JSON.stringify({
                type: MessageType.START,
                taskId,
                message: `任务启动`
            }, null, ' '))
        }
        // console.log('interval', task.interval)
        if (TaskService.taskTimeout[taskId]) {
            clearTimeout(TaskService.taskTimeout[taskId])
        }
        if (task.interval) {
            const timeout = setTimeout(async () => {
                // console.log('time up')
                await TaskService.startTask(taskId, true)
            }, task.interval * 1000)
            TaskService.taskTimeout[taskId] = timeout
        }
    }

    static async resumeTask(taskId) {
        //todo 以后任务信息写在redis 中？
        if (!TaskService.tasks[taskId]) {
            throw new BusinessError('任务信息丢失!请手动启动任务')
        }
        const taskSchedule = TaskService.tasks[taskId]
        // console.log('resume task schedule: ', taskSchedule)
        await TaskService.sendSubTasks(taskSchedule[0])
        await TaskService.updateTaskStatus(taskId, TASK.status.START)
        const ws = global.wss
        ws.broadcast(JSON.stringify({
            type: MessageType.START,
            taskId,
            message: `任务继续`
        }, null, ' '))
        const task = Converter.TaskConverter(await TASK.findById(taskId))
        if (TaskService.taskTimeout[taskId]) {
            clearTimeout(TaskService.taskTimeout[taskId])
        }
        if (task.interval) {
            const timeout = setTimeout(async () => {
                // console.log('time up')
                await TaskService.startTask(taskId, true)
            }, task.interval * 1000)
            TaskService.taskTimeout[taskId] = timeout
        }
    }

    static async sendSubTasks(subTasks) {
        await Promise.all(subTasks.map((subtask) => TaskService.startSubTask(subtask)))
    }

    static async startSubTaskById(subtaskId) {
        const subtask = await TaskService.getSubTaskById(subtaskId)
        await TaskService.startSubTask(subtask)
    }


    static async startSubTask(subtask) {
        const { subtaskId, server, script, args, taskId } = subtask
        const { ip, port } = server
        const { fileName, type } = script
        const url = `http://${ip}:${port}/api/task/start`
        console.log('send', url, fileName)
        return axios
            .post(url, {
                taskId,
                subtaskId,
                type,
                fileName,
                args,
            })
            .then(() => TaskService.updateSubTaskStatus(subtaskId, SUBTASK.status.START))
            .then(() => {
                const ws = global.wss
                ws.broadcast(JSON.stringify({
                    type: MessageType.START,
                    taskId,
                    subtaskId,
                    message: `子任务启动`
                }, null, ' '))
            })
    }

    static updateSubTaskStatus(subtaskId, status) {
        return SUBTASK.update({
            status,
            updateTime: new Date().getTime()
        }, {
            where: {
                subtask_id: subtaskId
            }
        })
    }

    static async stopTask(taskId, status = TASK.status.STOP, auto = false) {
        if (!auto && TaskService.taskTimeout[taskId]) {
            clearTimeout(TaskService.taskTimeout[taskId])
            TaskService.taskTimeout[taskId] = 0
        }
        const ws = global.wss
        if (!auto) {
            ws.broadcast(JSON.stringify({
                type: MessageType.ERROR,
                taskId,
                message: `任务手动停止中`
            }, null, ' '))
        }
        if (TaskService.tasks[taskId]) {
            if (TaskService.tasks[taskId].length > 0) {
                const currentSubTasks = TaskService.tasks[taskId][0]
                await Promise.all(currentSubTasks.map((subtask) => TaskService.stopSubTask(subtask,auto)))
            }
            // TaskService.tasks[taskId] = null
        }
        await TaskService.updateTaskStatus(taskId, status)
    }

    static async stopSubTaskById(subtaskId) {
        const subtask = await TaskService.getSubTaskById(subtaskId)
        await TaskService.stopSubTask(subtask)
    }

    static async stopSubTask(subtask, auto = false) {
        const { subtaskId, server, taskId } = subtask
        const { ip, port } = server
        const url = `http://${ip}:${port}/api/task/stop`
        console.log('send stop', url)
        return axios
            .post(url, { subtaskId, })
            .then(() => {
                if (!auto) {
                    const ws = global.wss
                    ws.broadcast(JSON.stringify({
                        type: MessageType.START,
                        taskId,
                        subtaskId,
                        message: `子任务手动停止`
                    }, null, ' '))
                }
            })
    }

    static updateTaskStatus(taskId, status) {
        return TASK.update({
            updateTime: new Date().getTime(),
            status
        }, {
            where: {
                task_id: taskId
            }
        })
    }

    static async getTasks() {
        return (await TASK.findAll({
            include: {
                model: SUBTASK
            }
        })).map(Converter.TaskConverter)
    }

    static async getTaskById(taskId) {
        return Converter.TaskConverter(await TASK.findById(taskId, {
            include: {
                model: SUBTASK
            }
        }))
    }

    static async removeTaskById(taskId) {
        await SUBTASK.destroy({
            where: {
                task_id: taskId
            }
        })
        await TASK.destroy({
            where: {
                task_id: taskId
            }
        })
    }

    static async removeSubTaskById(subTaskId) {
        await SUBTASK.destroy({
            where: {
                subtask_id: subTaskId
            }
        })
    }

    static async getRunningTasks() {
        return (await TASK.findAll({
            where: {
                status: {
                    $ne: TASK.status.FINISH
                }
            }
        })).map(Converter.SubTaskConverter)
    }

    static async getSubTasks(taskId) {
        return (await TASK.findById(taskId)
            .then((task) => task.getSUBTASKs())).map(Converter.SubTaskConverter)
    }

    static async createTask(name, interval = 0) {
        const now = new Date()
        return (await TASK.create({
            createTime: now.getTime(),
            updateTime: now.getTime(),
            status: TASK.status.INIT,
            name,
            interval,
        })).task_id
    }

    static async updateTask(taskId, name, interval) {
        return await TASK.update({
            interval,
            name
        }, {
            where: {
                task_id: taskId,
            }
        })
    }

    static async createSubTask(taskId, name = '', order = 0, serverId = 0, scriptId = 0, args = '') {
        const now = new Date()
        return (await (SUBTASK.create({
            server_id: serverId,
            script_id: scriptId,
            task_id: taskId,
            name,
            order,
            arguments: args,
            createTime: now.getTime(),
            updateTime: now.getTime(),
            status: TASK.status.INIT
        }))).subtask_id
    }


    static async updateSubTask(subTaskId, name = '', order = 0, serverId = 0, scriptId = 0, args = '') {
        await SUBTASK.update({
            server_id: serverId,
            script_id: scriptId,
            name,
            order,
            arguments: args,
        }, {
            where: {
                subtask_id: subTaskId,
            }
        })
        const newSubTask = await TaskService.getSubTaskById(subTaskId)
        TaskService.tasks = Object.keys(TaskService.tasks)
            .reduce((prev, key) => {
                const taskSeq = TaskService.tasks[key]
                return !taskSeq ? prev : {
                    ...prev,
                    [key]: taskSeq.map((subtasks) => subtasks.map((subtask) => subtask.subtaskId == subTaskId ? newSubTask : subtask))
                }
            }, {})
    }

    static async getSubTaskById(subtaskId) {
        return await Converter.SubTaskConverter(await SUBTASK.findById(subtaskId, {
            include: [{ model: SCRIPT }, { model: SERVER }]
        }))
    }
}

TaskService.tasks = {}
TaskService.taskTimeout = {}
module.exports = TaskService
