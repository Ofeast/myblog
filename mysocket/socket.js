var express = require('express');
var app = express();
var server = require('http').Server(app);

var io = require('socket.io')(server);

var usernames={};
var userCount=0;

server.listen(81,function(){
  console.log('81 Port success!');  
});
app.use(express.static(__dirname+'/public'))

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  var addedUser = false;
  socket.on('addUser', function (data) {
    username = data.username;
    if(usernames[username]){
      socket.emit('repeat',{
        repeat: true
      });
      return;
    }
    
    usernames[username]=username;
    socket.username=username;
    ++userCount;
    addedUser=true;
    socket.emit('login',{
      username: data.username,
      userCount:userCount
    });
    // socket.broadcast.emit('userCount',{
    //   userCount: userCount
    // });
    socket.broadcast.emit('addUser',{
      username: data.username,
      userCount: userCount
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
    if(addedUser){
      --userCount;
      delete usernames[socket.username];

      socket.broadcast.emit('leave',{
        userCount:userCount,
        username:socket.username
      });
    }
  });

});