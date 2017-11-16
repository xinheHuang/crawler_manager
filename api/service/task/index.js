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
    ERROR: 'ERROR'
}

//wss
// const ws=require('../../../bin/www')


open.then(conn => conn.createChannel())
    .then(ch => ch.assertQueue(queue)
        .then(ok => ch.consume(queue, msg => {
            if (msg !== null) {
                console.log(msg.content.toString())
                ch.ack(msg)
                const ws=global.wss;
                const { taskId, subtaskId, type, message,scriptName, } = JSON.parse(msg.content.toString())
                switch (type) {
                case MessageType.LOG:
                    //todo
                    ws.broadcast(JSON.stringify({
                        taskId,
                        message:message.replace(new RegExp('\\', 'g'),''),
                    }))
                    console.log('log message ', message)
                    break
                case MessageType.DONE:
                    console.log('done message ', message)
                    if (message == 0) { //success
                        const taskSeq = TaskService.tasks[taskId]
                        const taskSchedule = taskSeq[0]
                        let index
                        for (let i = 0; i < taskSchedule.length; i++) {
                            const subtask = taskSchedule[i]
                            if (subtask.subtaskId == subtaskId) {
                                index = i
                                break
                            }
                        }

                        const doneSubTask=taskSchedule[i];
                        SUBTASK.update({
                            status:SUBTASK.status.STOP,
                            updateTime:new Date().getTime()
                        },{
                            where:{
                               subtask_id:doneSubTask.subtaskId
                            }
                        })

                        taskSchedule.splice(index, 1)
                        if (taskSchedule.length === 0) {  //完成当前并行子任务
                            taskSeq.shift()
                            if (taskSeq.length === 0) { //完成所有子任务
                                //todo
                            } else {
                                TaskService.sendSubTasks(taskId, taskSeq[0])
                            }
                        }

                    }
                    break
                case MessageType.ERROR:
                    //todo
                    console.log('error message ', message)
                    break
                }
            }
        })))
    .catch((err) => {
        //todo add log
        console.warn(err)
    })


class TaskService {

    static async startTask(taskId) {
        const task = Converter.TaskConverter(await TASK.findById(taskId, {
            include: {
                model: SUBTASK,
                include: [{ model: SCRIPT }, { model: SERVER }]
            }
        }))

        const { subTasks, status } = task
        if (status === TASK.status.START) {
            throw new BusinessError('任务运行中!')
        }
        if (!subTasks || subTasks.length === 0) {
            throw new BusinessError('没有子任务!')
        }

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

        await TaskService.sendSubTasks(taskId, taskSchedule[0])

        const now = new Date()

        await TASK.update({
            status: TASK.status.START,
            updateTime: now.getTime()
        }, {
            where: {
                task_id: taskId,
            }
        })
    }

    static async sendSubTasks(taskId, subTasks) {
        await Promise.all(subTasks.map(({ subtaskId, server, script, args }) => {
            const { ip, port } = server
            const { fileName, type } = script
            const url = `http://${ip}:${port}/api/task/start`
            console.log('send', url)
            return axios.post(url, {
                taskId,
                subtaskId,
                type,
                fileName,
                args,
            })
                .then(() => SUBTASK.update({
                    status: SUBTASK.status.START,
                    updateTime: new Date().getTime()
                }, {
                    where: {
                        subtask_id: subtaskId,
                    }
                }))
        }))
    }

    static async stopTask(taskId) {
        const now = new Date()
        const currentSubTasks=TaskService.tasks[taskId][0];

        await Promise.all(currentSubTasks.map(({ subtaskId, server, script, args }) => {
            const { ip, port } = server
            const url = `http://${ip}:${port}/api/task/stop`
            console.log('send stop', url)
            return axios.post(url, {
                subtaskId,
            })
        }))

        await TASK.update( {
            updateTime: now.getTime(),
            status: TASK.status.STOP
        },{
            where:{
                task_id:taskId
            }
        })

        //todo 派发任务
    }

    static async getTasks() {
        return (await TASK.findAll()).map(Converter.TaskConverter)
    }

    static async getTaskById(taskId) {
        return Converter.TaskConverter(await TASK.findById(taskId, {
            include: {
                model: SUBTASK
            }
        }))
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
        return await SUBTASK.update({
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
    }
}

TaskService.tasks = {}
module.exports = TaskService
