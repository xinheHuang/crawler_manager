/**
 * Created by Xinhe on 2017-09-20.
 */
const TaskService = require('../service/task')
const ServerService = require('../service/server')
const ScriptService = require('../service/script')
module.exports = Object.values(
    {
        startTask: {
            method: 'post',
            url: '/task/start',
            async handler(ctx) {
                const { serverId, scriptId, args } = ctx.request.body
                const taskId = await TaskService.startTask(serverId, scriptId, args)
                ctx.body = {
                    taskId
                }
            }
        },
        stopTask: {
            method: 'post',
            url: '/task/stop',
            async handler(ctx) {
                const { taskId } = ctx.request.body
                await TaskService.stopTask(taskId)
                ctx.body = 'success'
            }
        },
        getTasks: {
            method: 'get',
            url: '/tasks',
            async handler(ctx) {
                ctx.body = await TaskService.getTasks()
            }
        },
        getSubTasks: {
            method: 'get',
            url: '/task/:taskId/subtasks',
            async handler(ctx) {
                const { taskId } = ctx.params
                ctx.body = await TaskService.getSubTasks(taskId)
            }
        },
        createTask: {
            method: 'post',
            url: '/tasks',
            async handler(ctx) {
                const { name } = ctx.request.body
                ctx.body = await TaskService.createTask(name)
            }
        },
        modifyTask: {
            method: 'put',
            url: '/task/:taskId',
            async handler(ctx) {
                const { taskId } = ctx.params
                const { name, interval } = ctx.request.body
                await TaskService.updateTask(taskId, name, interval)
                ctx.body = 'success'
            }
        },

        createSubTask: {
            method: 'post',
            url: '/task/:taskId/subtasks',
            async handler(ctx) {
                const { taskId } = ctx.params
                const { name, serverId, scriptId, args, order } = ctx.request.body
                await TaskService.createSubTask(taskId, name, order, serverId, scriptId, args)
                ctx.body = 'success'
            }
        },

        modifySubTask: {
            method: 'put',
            url: '/subtask/:subTaskId',
            async handler(ctx) {
                const { subTaskId } = ctx.params
                const { name, serverId, scriptId, args, order } = ctx.request.body
                await TaskService.updateSubTask(subTaskId,name, order, serverId, scriptId, args)
                ctx.body = 'success'
            }
        },



        getServerList: {
            method: 'get',
            url: '/servers',
            async handler(ctx) {
                ctx.body = await ServerService.getServers()
            }
        },

        getScriptList: {
            method: 'get',
            url: '/scripts',
            async handler(ctx) {
                ctx.body = await ScriptService.getScripts()
            }
        }
    }
)
