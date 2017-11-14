/**
 * Created by Xinhe on 2017-09-20.
 */
const { TASK } = require('../../../db')
const ApiError = require('../../../error/ApiError')
const ApiErrorNames = require('../../../error/ApiErrorNames')
const Converter = require('../../converter')

class TaskService {

    static async startTask(serverId, scriptId, args = '') {
        const now = new Date()
        await TASK.create({
            server_id: serverId,
            script_id: scriptId,
            arguments:args,
            createTime: now.getTime(),
            updateTime: now.getTime(),
            status: TASK.status.INIT
        })

        //todo 派发任务
    }

    static async stopTask(taskId) {
        const now = new Date()
        await TASK.update(taskId,{
            updateTime: now.getTime(),
            status: TASK.status.STOP
        })

        //todo 派发任务
    }


    static async getTasks() {
        return (await TASK.findAll()).map(Converter.TaskConverter)
    }

    static async getTaskById(taskId) {
        return Converter.TaskConverter(await TASK.findById(taskId))
    }
}

module.exports = TaskService
