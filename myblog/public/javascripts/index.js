~function(){
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

	function setScrollTop(){
		document.body.scrollTop=0;
	}


	function showNav(){
		header.show();
		header.css('position','relative');
	}

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
				showNav();
				setScrollTop();
			}
		});
	}

	function createList(list){
		var innerHTML = '';
		for (var i = 0; i < list.length; i++) {
			innerHTML+='<a href="/article/'+list[i].id+'" class="list-group-item"> \
							<label>['+list[i].type+']</label>'+list[i].title+' \
							<span class="badge">'+list[i].time+'</span> \
							<span class="badge">'+list[i].clicks+'</span> \
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

	addWheel(document,function(down){
		var scrollTop=document.body.scrollTop || document.documentElement.scrollTop;
		if(scrollTop<60){
			showNav();
		}else{
			if(down){
				header.hide();
				header.css('position','fixed');
			}else{
				header.show();
				header.css('position','fixed');
			}
			
		}
	});
}();