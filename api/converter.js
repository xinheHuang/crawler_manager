/**
 * Created by Xinhe on 2017-11-10.
 */

class Converter {
    static ServerConverter(server) {
        if (!server) return undefined
        const { server_id, ip, port, type, name, status } = server
        return {
            serverId: server_id,
            ip,
            port,
            name,
            type,
            status,
        }
    }

    static ScriptConverter(script) {
        if (!script) return undefined
        const { script_id, fileName, name, type } = script
        return {
            scriptId: script_id,
            fileName,
            name,
            type
        }
    }

    static TaskConverter(task) {
        if (!task) return undefined
        const { task_id, createTime, updateTime, status, name, interval,SUBTASKs } = task
        return {
            taskId: task_id,
            status,
            createTime,
            updateTime,
            name,
            interval,
            subTasks:SUBTASKs && SUBTASKs.map(Converter.SubTaskConverter)
        }
    }

    static SubTaskConverter(subTask) {
        if (!subTask) return undefined
        const { task_id, subtask_id, status, createTime, updateTime, server_id,script_id,SERVER, SCRIPT, name, order } = subTask
        return {
            subtaskId: subtask_id,
            taskId: task_id,
            status,
            createTime,
            updateTime,
            name,
            order,
            args: subTask.arguments,
            serverId: server_id,
            scriptId: script_id,
            server: Converter.ServerConverter(SERVER),
            script: Converter.ScriptConverter(SCRIPT)
        }
    }
}

module.exports = Converter