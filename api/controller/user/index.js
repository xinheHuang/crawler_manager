/**
 * Created by Xinhe on 2017-09-20.
 */
const UserService = require('../../service/user')

module.exports = Object.values({
    login: { //登录
        method: 'post',
        url: '/auth/login',
        async handler(ctx) {
            const { username, password } = ctx.request.body
            const userId = await UserService.checkUserNamePassword(username, password)
            console.log(userId)
            ctx.session.userId = userId
            ctx.body = 'login'
        }
    },

    logout: { //logout
        method: 'post',
        url: '/auth/logout',
        async handler(ctx) {
            ctx.session.userId = null
            ctx.body = 'logout'
        }
    },

    register: { //注册
        method: 'post',
        url: '/auth/register',
        async handler(ctx) {
            const { username, password, position, industry_id, name, broker } = ctx.request.body
            const userId = await UserService.createUser(username, password, position, industry_id, name, broker)
            ctx.session.userId = userId
            ctx.body = 'register'
        }
    },
    getUserInfo: { //获取userinfo
        method: 'get',
        url: '/userInfo',
        async handler(ctx, userId) {
            ctx.body = await UserService.getUserInfo(userId)
        }
    },
    postUserInfo: { //修改userinfo
        method: 'post',
        url: '/userInfo',
        async handler(ctx, userId) {
            const { userInfo } = ctx.request.body
            await UserService.modifyUserInfo(userId, userInfo)
            ctx.body = 'success'

        },
    },

    getIndustryInterests: {
        method: 'get',
        url: '/interests/industry',
        async handler(ctx, userId) {
            ctx.body = await UserService.getIndustryInterests(userId)
        }

    },
    postIndustryInterests: {
        method: 'post',
        url: '/interests/industry',
        async handler(ctx, userId) {
            const { industryId } = ctx.request.body
            await UserService.addIndustryInterests(userId,industryId)
            ctx.body ='success'
        }

    },
    deleteIndustryInterests: {
        method: 'delete',
        url: '/interests/industry',
        async handler(ctx, userId) {
            const { industryId } = ctx.request.body
            await UserService.removeIndustryInterests(userId,industryId)
            ctx.body ='success'
        }
    },
    getStockInterests: {
        method: 'get',
        url: '/interests/stock',
        async handler(ctx, userId) {
            ctx.body = await UserService.getStockInterests(userId)
        }

    },
    postStockInterests: {
        method: 'post',
        url: '/interests/stock',
        async handler(ctx, userId) {
            const { stockId } = ctx.request.body
            await UserService.addStockInterests(userId,stockId)
            ctx.body ='success'
        }
    },
    deleteStockInterests: {
        method: 'delete',
        url: '/interests/stock',
        async handler(ctx, userId) {
            const { stockId } = ctx.request.body
            await UserService.removeStockInterests(userId,stockId)
            ctx.body ='success'
        }
    },

})
