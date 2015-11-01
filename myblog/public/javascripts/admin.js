$('#summernote').summernote({
  height:350,
  focus:true,
  lang:'zh-CN'
});

var send = $('#send');
var title = $('#title');
var nav = $('#navList');
var summernote = $('#summernote');
var myDropdown = $('#myDropdown');
var typeName = $('#typeName');
var type = 'JavaScript';

myDropdown.on('click','a',function(){
	var innerHTML=$(this).html();
	typeName.html(innerHTML+' <span class="caret"></span>');
	type=innerHTML;
})

send.on('click',function(){
	$.ajax({
		url: 'admin',
		method: 'post',
		data: {
			title:title.val(),
			content:summernote.code(),
			type:type
		},
		success: function(str){
			var data=$.parseJSON(str);
			alert(data.msg)
			title.val('');
			content:summernote.code('');
		}
	});
});


nav.on('click','li',function(){
	var _this=$(this);
	nav.find('li').removeClass('active');
	_this.addClass('active');
	type=_this.find('a').html();
})


