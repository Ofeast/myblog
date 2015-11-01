var header = $('div.header');
var navList = $('#navList');
var navPage = $('#navPage');
var content = $('#content');
var searchBtn = $('#searchBtn');
var searchBox = $('#searchBox');
var pageNum = 1;

var search = window.location.hash.replace('#','');
// var typeName = search.split('=')[1];
// alert(search)
var aLi=navList.find('li');
var aType=navList.find('a');
for (var i = 0; i < aType.length; i++) {
	if (search == aType[i].innerHTML) {
		aLi.removeClass('active');
		$(aLi[i]).addClass('active');
	}
};

navList.on('click','li',function(){
	var _this=$(this);
	navList.find('li').removeClass('active');
	_this.addClass('active');
})

// navList.on('click', 'a', function(ev){
// 	var type=$(this).html();
// 	window.location.href='/?type='+type;
	// $.ajax({
	// 	url:'/getByType',
	// 	data: {
	// 		type:type
	// 	},
	// 	success: function(str){
	// 		var data = eval('('+str+')');
	// 		content.html(createList(data.list));
	// 		// navPage.html(createPageCount(data.pageCount));
	// 	}
	// });
	// $.ajax({
	// 	url:'/getPageCount',
	// 	data: {
	// 		type:type
	// 	},
	// 	success: function(str){
	// 		var data = eval('('+str+')');
	// 		navPage.html(createPageCount(data.msg));
	// 	}
	// });
// });

navPage.on('click','a',function(){
	var _this=$(this);
	if(_this.attr('data-pageNum')=='prev'){
		pageNum--;
		if(pageNum<1){
			pageNum=1;
			return;
		}
	}else if(_this.attr('data-pageNum')=='next'){
		pageNum++;
		if(pageNum>navPage.children().length-2){
			pageNum=navPage.children().length-2
			return;
		}
	}else{
		pageNum=_this.attr('data-pageNum');
	}
	getListByPageCount();
});

function getListByPageCount(){
	$.ajax({
		url:'/getListByPageCount',
		data:{
			pageNum:pageNum
		},
		success: function(str){
			var list = eval('('+str+')');
			var innerHTML = createList(list);
			content.html(innerHTML);
		}
	});
}

function createList(list){
	var innerHTML = '';
	for (var i = 0; i < list.length; i++) {
		innerHTML+='<a href="/article/'+list[i].id+'" class="list-group-item"> \
						<label>['+list[i].type+']</label>'+list[i].title+' \
						<span class="badge">'+list[i].time+'</span> \
					</a>'
	};
	return innerHTML;
}

function createPageCount(pageCount){
	var str='';
	for (var i = 1; i <= pageCount; i++) {
		str+='<li><a href="javascript:;"  data-pageNum="'+i+'">'+i+'</a></li>'
	};
	return '<li><a href="javascript:;" data-pageNum="prev">上一页</a></li>'+str+'<li><a href="javascript:;"  data-pageNum="next">下一页</a></li>';
}


// searchBtn.on('click', function(){
// 	$.ajax({
// 		url: '/search',
// 		data: {
// 			search:searchBox.val()
// 		},
// 		success: function(str){
// 			var list = eval('('+str+')');
// 			var innerHTML = createList(list);
// 			console.log(innerHTML)
// 			content.html(innerHTML);
// 		}
// 	});
// });
// 
var flag=false; 
addWheel(document,function(down){
	var scrollTop=document.body.scrollTop || document.documentElement.scrollTop;
	if(scrollTop<60){
		header.css('position','relative');
	}else{
		if(down){
			if(flag==down) return
			flag=down;
			header.hide(300);
		}else{
			if(flag==down) return
			flag=down;
			header.show(300);
			header.css('position','fixed');
		}
		
	}
})