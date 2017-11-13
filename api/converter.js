/**
 * Created by Xinhe on 2017-11-10.
 */

class Converter {
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
        }
    }
}

module.exports = Converter