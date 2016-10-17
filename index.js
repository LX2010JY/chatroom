var express = require('express');
var sio = require('socket.io');
var bodyparser = require('body-parser');
var log4js = require('log4js');
var app = express();

log4js.configure({
    appenders:[
        {
            type:'file',
            filename:'logs/access.log',
            maxLogSize: 1024000,
            backups:3,
            category:'normal'
        }
    ],
    replaceControl:true
});
var loger = log4js.getLogger('normal');
loger.setLevel('TRACE');
app.use(log4js.connectLogger(loger,{level:log4js.levels.TRACE}));

app.use(express.static('node_modules'));
app.use(express.static('public'));
app.use(bodyparser.json());

app.use(bodyparser.urlencoded({ extended: false }));


//express 4 弄不懂原理，不知道为什么，头大
var server = app.listen(3000);
var io = sio.listen(server);


// var server = require('http').createServer(app);
// var io = sio.listen(server);
var a=0;
io.sockets.on('connection',function (socket) {
    console.log('someone connect '+a);
    a++;

    socket.on('join',function (name) {
        socket.nickname = name;
        //broadcasr 广播的意思，如果直接emit则只会发给一个客户端
        socket.broadcast.emit('announcement',name+' joined the chat.');
    });
    //接受客户端发来的text类型消息，并广播出去
    socket.on('text',function (msg) {
        socket.broadcast.emit('text',socket.nickname,msg);
        console.log("["+new Date()+']'+socket.nickname+": "+msg);
    });
    //断开连接发送消息
    socket.on('disconnect',function(){
        console.log(socket.nickname+" 离开了聊天室");
        socket.broadcast.emit('leave',socket.nickname+" 离开了聊天室");
    });
});

//app.listen(3000);
