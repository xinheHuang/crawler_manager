/**
 * Created by Xinhe on 2017-09-20.
 */
const GraphService = require('../../service/graph')

module.exports = Object.values(
    {
        getGraphById: { //获取graph
            method: 'get',
            url: '/graph/:graphId',
            async handler(ctx) {
                const {graphId} = ctx.params
                ctx.body = await GraphService.getGraphById(graphId)
            }
        },


        getUserGraphs: {
            method: 'get',
            url: '/graphs',
            async handler(ctx, userId) {
                ctx.body = await GraphService.getGraphsByUserId(userId)
            }
        },

        getNodeComments: {
            method: 'get',
            url: '/node/:id/comments',
            async handler(ctx) {
                const {id} = ctx.params
                const {pageNumber, pageSize} = ctx.request.query
                ctx.body = await GraphService.getNodeCommentsByNodeId(id, pageNumber, pageSize)
            }
        },

        getGraphNodeIndicators: {
            method: 'get',
            url: '/graphNode/:id/indicators',
            async handler(ctx) {
                const {id} = ctx.params
                ctx.body = await GraphService.getGraphNodeIndicators(id)
            }
        },

        getDraftGraphByEntity: {
            method: 'get',
            url: '/draftGraph',
            async handler(ctx, userId) {
                const {entity} = ctx.request.query
                ctx.body = await GraphService.getDraftGraphByUserIdAndEntity(userId, entity)
            }
        },

        postNodeComment: {
            method: 'post',
            url: '/node/:id/comment',
            async handler(ctx, userId) {
                const {id} = ctx.params
                const {content} = ctx.request.body
                ctx.body = await GraphService.addNodeComment(userId, id, content)
            }
        },

        searchIndicatorByKeyWord: {
            method: 'get',
            url: '/indicator/',
            async handler(ctx,) {
                const {pageNumber, pageSize, key} = ctx.request.query
                ctx.body = await GraphService.searchIndicatorByKeyWord(key, pageNumber, pageSize)
            }
        },

        postGraphNodeIndicator: {
            method: 'post',
            url: '/graphNode/:id/indicator/',
            async handler(ctx, next) {
                const {id} = ctx.params
                const {indicatorId} = ctx.request.body
                ctx.body = await GraphService.addNodeIndicator(id, indicatorId)
            }
        },


        deleteNodeIndicators: {
            method: 'delete',
            url: '/graphIndicator/:ID',
            async handler(ctx, next) {
                const {ID} = ctx.params
                await GraphService.deleteNodeIndicator(ID)
                ctx.body = 'success'
            }
        },

        putNodeIndicators: {
            method: 'put',
            url: '/graphIndicator/:ID',
            async handler(ctx, next) {
                const {ID} = ctx.params
                const {warn_type, upper_limit, lower_limit} = ctx.request.body
                await GraphService.changeNodeIndicator(ID, {
                    warn_type,
                    upper_limit,
                    lower_limit,
                })
                ctx.body = 'success'
            }
        },

        postDraftGraphByEntity: {
            method: 'post',
            url: '/draftGraph',
            async handler(ctx, userId) {
                const {entity} = ctx.request.query
                const {nodes} = ctx.request.body
                await GraphService.postDraftGraph(userId, entity, nodes)
                ctx.body='success'
            }
        },
        postFinalGraph: {
            method: 'post',
            url: '/finalGraph',
            async handler(ctx, userId) {
                const {entity} = ctx.request.query
                const {nodes, name} = ctx.request.body
                await GraphService.postFinalGraph(userId,name,entity,nodes)
                ctx.body='success'
            }
        },
    }
)
