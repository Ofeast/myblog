~function($){
	var _window = $(window);
	var inputU = $('.usernameInput');
	var inputM = $('.inputMessage');
	var connectCount = $('.connectCount');
	var messages = $('.messages');
	var chatArea = $('.chatArea');
	var chatPage = $('.chat'); 
	var loginPage = $('.login'); 
	// var socket = io.connect('http://localhost:81');
	var socket = io.connect('http://45.62.113.108:3001');
	var username;	//用户名
	var FADE_TIME=200; 	//200ms
	var color=[
	    '#e21400', '#91580f', '#f8a700', '#f78b00',
	    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
	    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  	];	//字体颜色
	inputU.focus();
//显示消息窗口
function showMsgWindow(){
	loginPage.stop().animate({'opacity':0},{complete:function(){
		loginPage.hide();
		chatPage.show();
		inputM.focus();
	}})
}

// inputU.on('keyup', function(ev){
// 	if(ev.keyCode==13){
		
// 	}
// });
	
_window.keydown(function(event){
	if(event.which==13){
		if(username){
			sendMsg();
		}else{
			setUsername();
		}
	}
});

var flag=true;
function sendMsg(){
	if(flag){
		setTimeout(function(){
			flag=true;
		},1000)
		var newMsg=clearInput(inputM.val().trim());
		if(newMsg!='' && newMsg.length>0){
			inputM.val('');
		    flag=false;
		    showMsg({username:username,newMsg:newMsg},{msgType:'newMsg'})
		    socket.emit('newMsg', { newMsg: newMsg});
		}else{
			alert('The message cannot be empty');
		}
	}else{
		alert("Ban refresh！！");
	}
}

function setUsername(){
	username = clearInput(inputU.val().trim());
	if(username && username!=''){
		socket.emit('addUser', { username: username });
	}else{
		alert('Please input your user name ');
	}
}


function clearInput(input){
	return $('<div/>').text(input).text();
}
// inputM.on('input',function(){
// 	socket.emit('change',{});
// })

//展示消息
function showMsg(data,options){
	if (options.msgType=='addUser'){
		showUserMsg(data);
	}else if(options.msgType=='newMsg'){
		showNewMsg(data);
	}else if(options.msgType=='leave'){
		userLeaveMsg(data);
	}else if(options.msgType=='change'){
		showChangeMsg(data);
	}else if(options.msgType=='login'){
		showLoginInfo(data);
	}
}

//展示发送消息
function showNewMsg(data){
	var username=$('<span class="username"/>').text(data.username).css('color',color[data.userCount%color.length]);
	var messageBody=$('<span class="messageBody"/>').text(data.newMsg);
	var el=$('<li class="message"/>').append(username,messageBody);
	addMessageBody([el]);
}


//自己的登录信息
function showLoginInfo(data){
	var t='Welcome to Lv Xiaodong\'s chat room';
	var welcome=$('<li class="log"/>').text(t);
	var userCount=createUserCount(data);
	addMessageBody([welcome,userCount]);
}

//他人用户消息
function showUserMsg(data){
	var username=$('<li class="log"/>').text(data.username+' come in');
	var userCount=createUserCount(data);
	addMessageBody([username,userCount]);
}

//用户离开消息
function userLeaveMsg(data){
	var username=$('<li class="log"/>').text(data.username+' leave');
	var userCount=createUserCount(data);
	addMessageBody([username,userCount]);
}

//用户正在输入中
function showChangeMsg(data){
	messages.has()
	var el=$('<li class="message"/>').text(data.username+' 正在输入...');
	addMessageBody(el);
}

function createUserCount(data){
	return $('<li class="log"/>').text('there are '+data.userCount+' participants');
}

//添加到messages
function addMessageBody(els){
	for (var i = 0; i < els.length; i++) {
		messages.append(els[i]);
		els[i].hide().fadeIn(FADE_TIME);
		setScroll();
	};
}

function setScroll(){
	messages[0].scrollTop=messages[0].scrollHeight;
}

socket.on('addUser',function(data){
	var options={msgType:'addUser'};
	showMsg(data,options);
});

socket.on('newMsg',function(data){
	var options={msgType:'newMsg'};
	showMsg(data,options);
});

// socket.on('userCount',function(data){
// 	var options={msgType:'userCount'};
// 	showMsg(data,options);
// });
socket.on('login',function(data){
	var options={msgType:'login'};
	showMsg(data,options);
	showMsgWindow();
});

socket.on('repeat',function(data){
	alert('name repeat,Please change your name!');
});

socket.on('leave',function(data){
	var options={msgType:'leave'};
	showMsg(data,options)
});
// socket.on('change',function(data){
// 	var options={msgType:'change'};
// 	showMsg(data,options)
// });

}(jQuery);