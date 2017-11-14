/**
 * Created by Xinhe on 2017-09-20.
 */
const TaskService = require('../service/task')

module.exports = Object.values(
    {
        startTask: {
            method: 'post',
            url: '/task/start',
            async handler(ctx) {
                const {serverId, scriptId, args} = ctx.request.body
                const taskId=await TaskService.startTask(serverId, scriptId, args)
                ctx.body = {
                    taskId
                }
            }
        },
        stopTask: {
            method: 'post',
            url: '/task/stop',
            async handler(ctx) {
                const {taskId} = ctx.request.body
                await TaskService.stopTask(taskId)
                ctx.body = 'success'
            }
        },
        getCurrentRunningTasks:{
            method: 'get',
            url: '/tasks/running',
            async handler(ctx) {
                ctx.body = await TaskService.getRunningTasks()
            }
        }
    }
)
