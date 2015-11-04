var express = require('express');
var app = express();
var server = require('http').Server(app);
server.setTimeout(360000000);
var io = require('socket.io')(server);

var usernames={};
var userCount=0;

server.listen(4000,function(){
  console.log('4000 Port success!');  
});
app.use(express.static(__dirname+'/public'))

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  // socket.emit('news', { hello: 'world' });
  socket.on('addUser', function (data) {
    username = data.username;
    if(usernames[username]){
      socket.emit('repeat',{
        repeat: true
      });
      return;
    }
    
    usernames[username]=username;
    ++userCount;
    socket.username=data.username;
    socket.emit('login',{
      userCount:userCount,
      status: true
    });
    socket.broadcast.emit('userCount',{
      userCount: userCount
    });
    socket.broadcast.emit('addUser',{
      username: data.username,
      userCount: userCount,
      repeat: true
    });
  });

  socket.on('newMsg', function (data) {
    socket.broadcast.emit('newMsg',{
      username:socket.username,
      newMsg:data.newMsg,
      userCount:userCount
    });
  });

  // socket.on('change', function (data) {
  //   socket.broadcast.emit('change',{
  //     username:socket.username
  //   });
  // });

  socket.on('disconnect', function () {
    --userCount;
    if (userCount<0) {
      userCount=0;
    };
    delete usernames[socket.username];

    socket.broadcast.emit('leave',{
      userCount:userCount
    });
  });

});