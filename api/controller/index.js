/**
 * Created by Xinhe on 2017-09-20.
 */
const TaskService = require('../service/task')

module.exports = Object.values({
    postIndustryInterests: {
        method: 'post',
        url: '/task/start',
        async handler(ctx, userId) {
            const { serverId,scriptId, args } = ctx.request.body
            await TaskService.startTask(serverId,scriptId,args)
            ctx.body ='success'
        }
    },
    deleteStockInterests: {
        method: 'delete',
        url: '/interests/stock',
        async handler(ctx, userId) {
            const { stockId } = ctx.request.body
            await TaskService.removeStockInterests(userId,stockId)
            ctx.body ='success'
        }
    },

})
