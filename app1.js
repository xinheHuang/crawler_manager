/* 实例化外部依赖 */
let Koa = require("koa");
let WebSocket = require("koa-websocket");

/* 实例化 WebSocket, 实例化储存所有上线文数组 并分配监听的端口 */
let app = WebSocket(new Koa());
let ctxs = [];
app.listen(3080);

/* 实现简单的接发消息 */
app.ws.use((ctx, next) => {
    ctxs.push(ctx);
    ctx.websocket.on("message", (message) => {
        console.log(message);
        for(let i = 0; i < ctxs.length; i++) {
            if (ctx == ctxs[i]) continue;
            ctxs[i].websocket.send(message);
        }
    });
});