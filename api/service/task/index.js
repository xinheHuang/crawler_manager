/**
 * Created by Xinhe on 2017-09-20.
 */
const { TASK, SERVER, SCRIPT, SUBTASK } = require('../../../db')
const ApiError = require('../../../error/ApiError')
const ApiErrorNames = require('../../../error/ApiErrorNames')
const Converter = require('../../converter')

class TaskService {

    static async startTask(serverId, scriptId, args = '') {
        const now = new Date()
        const task = await TASK.create({
            server_id: serverId,
            script_id: scriptId,
            arguments: args,
            createTime: now.getTime(),
            updateTime: now.getTime(),
            status: TASK.status.INIT
        })
            .then(({ task_id }) => TASK.findById(task_id, {
                includes: [
                    { model: SCRIPT },
                    { model: SERVER }
                ]
            }))

        console.log(task)
        //todo 派发任务
        return task.task_id

    }

    static async stopTask(taskId) {
        const now = new Date()
        await TASK.update(taskId, {
            updateTime: now.getTime(),
            status: TASK.status.STOP
        })

        //todo 派发任务
    }

    static async finishTask(taskId) {
        const now = new Date()
        await TASK.update(taskId, {
            updateTime: now.getTime(),
            status: TASK.status.FINISH
        })
    }

    static async getTasks() {
        return (await TASK.findAll()).map(Converter.TaskConverter)
    }

    static async getTaskById(taskId) {
        return Converter.TaskConverter(await TASK.findById(taskId,{
          include:{
            model:SUBTASK
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

    static async createSubTask(taskId, name='', order=0, serverId=0, scriptId=0, args = '') {
        const now = new Date()
        return await (SUBTASK.create({
            server_id: serverId,
            script_id: scriptId,
            task_id: taskId,
            name,
            order,
            arguments: args,
            createTime: now.getTime(),
            updateTime: now.getTime(),
            status: TASK.status.INIT
        })).subtask_id
    }


    static async updateSubTask(subTaskId, name='', order=0, serverId=0, scriptId=0, args= '') {
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

module.exports = TaskService
