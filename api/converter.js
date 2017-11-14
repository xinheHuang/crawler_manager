/**
 * Created by Xinhe on 2017-11-10.
 */

class Converter {
<<<<<<< HEAD
    static UserConverter({ user_id, broker, email, name, position, username, mobile }) {
        return {
            userId: user_id,
            username,
            broker,
            email,
            name,
            position,
            mobile
        }
    }

    static GraphConverter(graph) {
        return {
            graphId: graph.graph_id,
            entity: graph.entity,
            time: graph.time,
            type: graph.type,
            userId: graph.user_id,
            name: graph.name,
            nodes: graph.GRAPH_NODEs ? graph.GRAPH_NODEs.map(({ node_id, title, GRAPH_NODE_RELATION }) => ({
                nodeId:node_id,
                title,
                parentNodeId: GRAPH_NODE_RELATION.parent_node_id,
                direction: GRAPH_NODE_RELATION.direction,
                graphNodeId: GRAPH_NODE_RELATION.id
            })) : undefined
        }
    }

    static NodeCommentConverter({ USER, commend_id: comment_id, content, node_id, time }){
        return {
            commentId: comment_id,
            nodeId: node_id,
            time,
            content,
            user: Converter.UserConverter(USER)
=======
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
        const { task_id, status, createTime, updateTime, SERVER, SCRIPT } = task
        return {
            taskId: task_id,
            status,
            createTime,
            updateTime,
            arguments:task.arguments,
            server: Converter.ServerConverter(SERVER),
            script: Converter.ScriptConverter(SCRIPT)
>>>>>>> d99b2abd2c427c181b4c12b60550daea4be1d63a
        }
    }
}

module.exports = Converter