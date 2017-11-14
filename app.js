const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const config = require('./conf/config')
const logUtil = require('./utils/logUtil')
const responseFormatter = require('./middlewares/responseFormatter')
const apis = require('./api/routes')
<<<<<<< HEAD

const historyFallback = require('koa2-history-api-fallback')
=======
const historyFallback = require('koa2-history-api-fallback')
const mqConfig = require('./conf/mqConfig')
>>>>>>> d99b2abd2c427c181b4c12b60550daea4be1d63a

app.keys = config.keys

app.use(historyFallback())

app.use(bodyparser({
<<<<<<< HEAD
                       enableTypes: ['json', 'form', 'text']
                   }))
=======
    enableTypes: ['json', 'form', 'text']
}))
>>>>>>> d99b2abd2c427c181b4c12b60550daea4be1d63a
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))


// logger
app.use(async (ctx, next) => {
    const start = new Date()
    try {
        await next()
        const ms = new Date() - start
        logUtil.logResponse(ctx, ms)
    } catch (error) {
        const ms = new Date() - start
        //记录异常日志
        logUtil.logError(ctx, error, ms)
    }
})

app.use(responseFormatter('^/api'))

// routes
app.use(apis.routes(), apis.allowedMethods())

app.on('error', function (err, ctx) {
    console.log(err)
})

<<<<<<< HEAD
=======
//amqp
const { queue, username, password, host, port } = mqConfig
const open = require('amqplib')
    .connect(`amqp://${username}:${password}@${host}:${port}`)

// Publisher
// open.then(conn => conn.createChannel())
//     .then(ch => ch.assertQueue(q)
//         .then(ok => ch.sendToQueue(q, new Buffer('something to do')))
//         .then(ok=>setTimeout(()=>{ch.sendToQueue(q,new Buffer('123'))},5000)))
//     .catch(console.warn)

// Consumer
open.then(conn => conn.createChannel())
    .then(ch => ch.assertQueue(queue)
        .then(ok => ch.consume(queue, msg => {
            console.log('1', msg)
            if (msg !== null) {
                console.log(msg.content.toString())
                ch.ack(msg)
                console.log('receive')
            }
        })))
    .catch((err) => {
        //todo add log
        console.warn(err)
    })

>>>>>>> d99b2abd2c427c181b4c12b60550daea4be1d63a
module.exports = app
