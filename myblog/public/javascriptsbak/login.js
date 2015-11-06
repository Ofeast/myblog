~function(){
	var username = $('#username');
	var password = $('#password');
	var login = $('#login');
	var reg = $('#reg');

	login.on('click',function(){
		$.ajax({
			url: '/login',
			method: 'post',
			data: {
				username: username.val(),
				password: password.val()
			},
			success: function(str){
				var data=$.parseJSON(str);
				if(data.err){
					alert(data.msg);
				}else{
					 window.location.href='/admin';
				}
			}
		})
	});

	reg.on('click',function(){
		$.ajax({
			url: '/reg',
			method: 'post',
			data: {
				username: username.val(),
				password: password.val()
			},
			success: function(data){
				alert(data);
			}
		})
	})
}();