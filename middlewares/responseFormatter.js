/**
 * Created by Xinhe on 2017/10/7.
 */
const ApiError = require('../error/ApiError')
const BusinessError = require('../error/BusinessError')
/**
 * 在app.use(router)之前调用
 */
var response_formatter = (ctx) => {
    //如果有返回数据，将返回数据添加到data中
    ctx.body = {
        code: 0,
        message: 'success',
        data: ctx.body
    }
}

var url_filter = (pattern) => {

    return async (ctx, next) => {
        //only for rest apis
        var reg = new RegExp(pattern)
        try {
            await next()
            if (ctx.status !== 200) {
                ctx.throw(ctx.status)
            }
        } catch (error) {
            console.log(error)
            if (reg.test(ctx.originalUrl)) {
                if (error instanceof ApiError) {
                    ctx.status = 200
                    ctx.body = {
                        code: error.code,
                        message: error.message
                    }
                }
                if (error instanceof BusinessError) {
                    ctx.status = 417
                    ctx.body = {
                        message: error.message
                    }
                }
            }


            //继续抛，让外层中间件处理日志
            throw error
        }
        //通过正则的url进行格式化处理
        if (reg.test(ctx.originalUrl)) {
            response_formatter(ctx)
        }
    }
}

// module.exports = response_formatter;
module.exports = url_filter