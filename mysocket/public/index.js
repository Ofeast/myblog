~function($){
	var inputU = $('.usernameInput');
	var inputM = $('.inputMessage');
	var connectCount = $('.connectCount');
	var messages = $('.messages');
	var chatPage = $('.chat'); 
	var loginPage = $('.login'); 
	var socket = io.connect('http://localhost:3000');
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

inputU.on('keyup', function(ev){
	if(ev.keyCode==13){
		username = inputU.val().trim();
		if(username && username!=''){
			socket.emit('addUser', { username: username });
		}else{
			alert('请输入用户名');
		}
	}
});
	
inputM.on('keyup', function(ev){
	if(ev.keyCode==13){
		var newMsg = $(this).val().trim();
	    socket.emit('newMsg', { newMsg: newMsg});
	    showMsg({username:username,newMsg:newMsg},{msgType:'newMsg'})
	    inputM.val('');
	}
});

inputM.on('input',function(){
	socket.emit('change',{});
})

//展示消息
function showMsg(data,options){
	if (options.msgType=='addUser'){
		showUserMsg(data);
	}else if(options.msgType=='newMsg'){
		showNewMsg(data);
	}else if(options.msgType=='leave'){
		showUserCount(data);
	}else if(options.msgType=='change'){
		showChangeMsg(data);
	}

	if(options.msgType=='userCount'){
		showUserCount(data);
	}
}

//展示发送消息
function showNewMsg(data){
	var username=$('<span class="username">').text(data.username).css('color',color[data.userCount%color.length]);
	var messageBody=$('<span class="messageBody">').text(data.newMsg);
	var el=$('<li class="message">').append(username,messageBody);
	addMessageBody(el);
}


//展示用户数量
function showUserCount(data){
	var t='there are '+data.userCount+' participants';
	connectCount.html(t)
}

//展示添加用户消息
function showUserMsg(data){
	var el=$('<li class="log">').text(data.username+' come in');
	addMessageBody(el);
}

//用户离开消息
function userLeaveMsg(data){
	var el=$('<li class="log">').text(data.username+' leave');
	addMessageBody(el);
}

//用户正在输入中
function showChangeMsg(data){
	messages.has()
	var el=$('<li class="message">').text(data.username+' 正在输入...');
	addMessageBody(el);
}

//添加到messages
function addMessageBody(el){
	messages.append(el);
	el.hide().fadeIn(FADE_TIME);
}


socket.on('addUser',function(data){
	var options={msgType:'addUser'};
	showMsg(data,options);
});

socket.on('newMsg',function(data){
	var options={msgType:'newMsg'};
	showMsg(data,options);
});

socket.on('login',function(data){
	var options={msgType:'userCount'};
	showMsg(data,options);
	showMsgWindow();
});

socket.on('repeat',function(data){
	alert('名字重复了');
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