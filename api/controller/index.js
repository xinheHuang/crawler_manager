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
            url: '/task/:taskId/start',
            async handler(ctx) {
                const { taskId } = ctx.params
                await TaskService.startTask(taskId)
                ctx.body = 'success'
            }
        },
        stopTask: {
            method: 'post',
            url: '/task/:taskId/stop',
            async handler(ctx) {
                const { taskId } = ctx.params
                await TaskService.stopTask(taskId)
                ctx.body = 'success'
            }
        },

        startSubTask: {
            method: 'post',
            url: '/subtask/:subtaskId/start',
            async handler(ctx) {
                const { subtaskId } = ctx.params
                await TaskService.startSubTaskById(subtaskId)
                ctx.body = 'success'
            }
        },
        stopSubTask: {
            method: 'post',
            url: '/subtask/:subtaskId/stop',
            async handler(ctx) {
                const { subtaskId } = ctx.params
                await TaskService.stopSubTaskById(subtaskId)
                ctx.body = 'success'
            }
        },

        resumeTask:{
            method: 'post',
            url: '/task/:taskId/resume',
            async handler(ctx) {
                const { taskId } = ctx.params
                await TaskService.resumeTask(taskId)
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

        getTask: {
            method: 'get',
            url: '/task/:taskId',
            async handler(ctx) {
                const { taskId } = ctx.params
                ctx.body = await TaskService.getTaskById(taskId)
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
                ctx.body = await TaskService.createSubTask(taskId, name, order, serverId, scriptId, args)

            }
        },

        modifySubTask: {
            method: 'put',
            url: '/subtask/:subTaskId',
            async handler(ctx) {
                const { subTaskId } = ctx.params
                const { name, serverId, scriptId, args, order } = ctx.request.body
                await TaskService.updateSubTask(subTaskId, name, order, serverId, scriptId, args)
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
        },

        removeTask:{
            method: 'delete',
            url: '/task/:taskId',
            async handler(ctx) {
                const { taskId } = ctx.params
                await TaskService.removeTaskById(taskId)
                ctx.body = 'success'
            }
        },

        removeSubTask:{
            method: 'delete',
            url: '/subtask/:subTaskId',
            async handler(ctx) {
                const { subTaskId } = ctx.params
                await TaskService.removeSubTaskById(subTaskId)
                ctx.body = 'success'
            }
        }
    }
)
