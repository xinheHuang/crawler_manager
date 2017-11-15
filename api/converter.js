/**
 * Created by Xinhe on 2017-11-10.
 */

class Converter {
    static ServerConverter(server) {
        if (!server) return undefined
        const { server_id, ip, port, type, name, status, updateTime } = server
        return {
            serverId: server_id,
            ip,
            port,
            name,
            type,
            status,
            updateTime
        }
    }

    static ScriptConverter(script) {
        if (!script) return undefined
        const { script_id, fileName, name } = script
        return {
            scriptId: script_id,
            fileName,
            name
        }
    }

    static TaskConverter(task) {
        if (!task) return undefined
        const { task_id, createTime, updateTime, status, name, interval } = task
        return {
            taskId: task_id,
            status,
            createTime,
            updateTime,
            name,
            interval
        }
    }

    static SubTaskConverter(subTask) {
        if (!subTask) return undefined
        const { task_id, subtask_id, status, createTime, updateTime, SERVER, SCRIPT, name, order } = subTask
        return {
            subtaskId: subtask_id,
            taskId: task_id,
            status,
            createTime,
            updateTime,
            name,
            order,
            arguments: subTask.arguments,
            server: Converter.ServerConverter(SERVER),
            script: Converter.ScriptConverter(SCRIPT)
        }
    }
}

module.exports = Converter