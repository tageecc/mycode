function $importJS(path){
	document.write("<script type='text/javascript' src='"+path+"'></script>");
}
function $importCSS(path){
	document.write("<link rel='stylesheet' type='text/css' href='"+path+"'>");
}

$importCSS('jquery-easyui/themes/default/easyui.css');
$importCSS('jquery-easyui/themes/icon.css');
$importCSS('css/elan.css');
$importCSS('css/style.css');
$importJS('jquery-easyui/js/jquery.easyui.min.js');
$importJS('jquery-easyui/local/easyui-lang-zh_CN.js');

/**
 * 自定义控件
 * 
 ***/
/**
 * 1、数据表格控件
 */
var onLoadSuccess = "";
var Screen_Height =window.screen.height;
$.fn.elanGrid = function(config,params){
	var obj = $(this);
	/**
	 * 如果是方法
	 * **/
	if(config){
		/**
		 * 加载数据方法
		 */
		var options = $('#' + $(obj).attr('id')).data('options');
		if(config.queryParams){
			$.extend(options.extradata,config.queryParams);
			//保存参数
			$('#' + $(obj).attr('id')).data('options',options);
			return;
		}
		if(config == 'load'){
			var body_content = '';
			/**
			 * 设置分页页面
			 */
			if(params){
				if(params.page){options.currentpage = params.page;}
				if(params.rows){options.pagesize = params.rows;}
			}
			//查询参数
			var queryParams = $.extend(options.extradata,{page:options.currentpage,rows:options.pagesize});
			$.post(options.url,queryParams,function(data){
						//返回回来是否有数据
						if(data.rows && data.rows.length > 0){
							$(data.rows).each(function(index,rowData){
								body_content = body_content + '<tr>';
								$(options.columns).each(function(cindex,cdata){
									//样式调整
									if((cindex + 1) == options.columns.length){
										body_content = body_content + '<td class="td_right">&nbsp;';
									}else{
										body_content = body_content + '<td>&nbsp;';
									}
									//判断是否是数据字段
									if(cdata.field){
										var val = eval('rowData.' + cdata.field);
										if(val || val == 0){
											body_content = body_content + val;
										}
									}else{
										//格式化数据
										body_content = body_content + cdata.formatter(eval('rowData.' + cdata.field),index,rowData);
									}
									body_content = body_content + '</td>';
								});
								body_content = body_content + '</tr>';
							});//end data.rows
							/**
							 * *设置分页栏
							 */
							if(options.pageable){
								//总页数
								if(data.total){
								var page = parseInt(data.total / options.pagesize);
								if(data.total % options.pagesize == 0){
									page = page;
								}else{
									page = page + 1;
								}}
								//缓存总页数
								options.page = page;
								$('#' + $(obj).attr('id')).find('.elanTotalPage').text(page);
								$('#' + $(obj).attr('id')).find('.elanCurrentPage').val(options.currentpage);
								$('#' + $(obj).attr('id')).find('.elanTotalSize').text(data.total);
								$('#' + $(obj).attr('id')).find('.elanFromStart').text((options.currentpage - 1) * options.pagesize + 1);
								var end_size = data.total;
								if((options.currentpage * options.pagesize) < data.total){
									end_size = options.currentpage * options.pagesize;
								}
								$('#' + $(obj).attr('id')).find('.elanFromEnd').text(end_size);
								
							}//end 设置分页栏
							
							if(onLoadSuccess != undefined)eval("("+onLoadSuccess(data)+")");
						}else{
							body_content = "<tr>无数据！</tr>";
							$('#' + $(obj).attr('id')).find('.elanTotalPage').text(0);
							$('#' + $(obj).attr('id')).find('.elanCurrentPage').val(0);
							$('#' + $(obj).attr('id')).find('.elanTotalSize').text(0);
							$('#' + $(obj).attr('id')).find('.elanFromStart').text(0);
							$('#' + $(obj).attr('id')).find('.elanFromEnd').text(0);
						}
						$(obj).find('tbody').html($(body_content));
					});
			//保存参数
			$('#' + $(obj).attr('id')).data('options',options);
			return;
		}
	}
	//默认参数
	
		if(Screen_Height<769)
			{
			var defaults = {
					pageable:false,
					lazyload:false,
					extradata:'',
					width:'100%',
					currentpage:1,
					pagesize:10
					};
			}
		else
		{
			var defaults = {
					pageable:false,
					lazyload:false,
					extradata:'',
					width:'100%',
					currentpage:1,
					pagesize:15
					};
		}

	
	var opts = $.extend(defaults,config);
	//添加table标签
	var table_content ='<table id="' + $(this).attr('id') + '" class="elan_tb_data_list" width="' + opts.width + '" cellpadding="5px"  cellspacing="0" border="0">';
	//页头
	if(opts.columns){
		table_content = table_content + '<thead>'
    		+ '<tr>';
			$(opts.columns).each(function(index,data){
				if(index == (opts.columns.length - 1)){
					table_content = table_content + '<td class="td_right">' + data.title + '</td>';
				}else{
					table_content = table_content + '<td>' + data.title + '</td>';
				}
			});
    		table_content = table_content + '</tr>'
    	+'</thead>';
	}
	/**
	 * 主体部分
	 */
	table_content = table_content + '<tbody><tr><td colspan="9">正在加载中...</td></tr></tbody>';
	/**
	 * 底部
	 */
	//分页字段
	if(opts.pageable){
		table_content = table_content + '<tfoot><tr>';
		table_content = table_content + '<td class="pageset" colspan="' + opts.columns.length + '" style="border: 0;">';
		table_content = table_content + '<div id="page_style"><a href="javascript:void(0);" class="elanFirstPage">&nbsp; 首页&nbsp; </a>&nbsp;&nbsp;';
		table_content = table_content + '<a href="javascript:void(0);" class="elanUpPage">&nbsp; 上一页&nbsp; </a>';
		table_content = table_content + '第<input value="1" size="2" class="elanCurrentPage" />页/共<span class="elanTotalPage">0</span>页';
		table_content = table_content + '<a href="javascript:void(0);" class="elanNextPage" >&nbsp; 下一页&nbsp; </a>';
		table_content = table_content + '&nbsp;&nbsp;<a href="javascript:void(0);" class="elanLastPage">&nbsp; 尾页&nbsp; </a>&nbsp;&nbsp;&nbsp;';
		//数据总数显示
		table_content = table_content + '共<span class="elanTotalSize">0</span>条数据，显示<span class="elanFromStart">0</span>-<span class="elanFromEnd">0</span>条';
		table_content = table_content + '</div></td>';
		table_content = table_content + '</tr></tfoot>';
	}
	table_content = table_content + '</table>';
	//替换掉样例文档节点
	$(table_content).replaceAll($(this));
	/**
	 * end 底部
	 */
	var table_data = "";
	//设置页数
	var def_pageconfig = {
			pageSize:opts.pagesize,
			currentPage:opts.currentpage
	};
	var t_extradata = $.extend(def_pageconfig,opts.extradata);
	/**
	 * 事件绑定
	 */
	//找到下一页,实现点击事件
	$('#' + $(obj).attr('id')).find('.elanNextPage').click(function(){
		var options = $('#' + $(obj).attr('id')).data('options');
		if(options.currentpage + 1 > options.page){
			$('#' + $(obj).attr('id')).elanGrid('load',{page:options.page,rows:options.pagesize});
		}else{
			$('#' + $(obj).attr('id')).elanGrid('load',{page:(options.currentpage + 1),rows:options.pagesize});
		}
	});
	//找到上一页,实现点击事件
	$('#' + $(obj).attr('id')).find('.elanUpPage').click(function(){
		var options = $('#' + $(obj).attr('id')).data('options');
		if((options.currentpage - 1) < 1){
			$('#' + $(obj).attr('id')).elanGrid('load',{page:1,rows:options.pagesize});
		}else{
			$('#' + $(obj).attr('id')).elanGrid('load',{page:(options.currentpage - 1),rows:options.pagesize});
		}
	});
	//找到第一页,实现点击事件
	$('#' + $(obj).attr('id')).find('.elanFirstPage').click(function(){
		var options = $('#' + $(obj).attr('id')).data('options');
		$('#' + $(obj).attr('id')).elanGrid('load',{page:1,rows:options.pagesize});
	});
	//找到最后一页,实现点击事件
	$('#' + $(obj).attr('id')).find('.elanLastPage').click(function(){
		var options = $('#' + $(obj).attr('id')).data('options');
		$('#' + $(obj).attr('id')).elanGrid('load',{page:options.page,rows:options.pagesize});
	});
	/**
	 * end 事件绑定
	 */
	onLoadSuccess = config.onLoadSuccess;
	//非延迟加载数据
	if(!opts.lazyload){
		//追加数据
		$('#' + $(this).attr('id')).data('options',opts);
		$('#' + $(this).attr('id')).elanGrid('load');
	}//加载数据
}

/**
 * end 1、数据表格控件
 */
/**
 * 2、表单控件
 */
var hczd_client = {
		form:{
			//区域控件
			area:function(){
				var id = arguments[0] ? arguments[0] : 'sel_area';
				var level = arguments[1] ? arguments[1] : 2;
				var extension = arguments[2] ? arguments[2] : '';
				var urlprovince = arguments[3] ? arguments[3] : ('common/dict_province/ajax_list.htm' + (extension ? '?type=1' : ''));
				var urlcity = arguments[4] ? arguments[4] : ('common/dict_city/ajax_list.htm' + (extension ? '?type=1&' : '?'));
				var urldistrict = arguments[5] ? arguments[5] : ('common/dict_district/ajax_list.htm' + (extension ? '?type=1&' : '?'));
				if(level > 3){
					$('#' + id).after('<input id="' + id + '_sale_input_select" />');
				}
				if(level > 2){
					$('#' + id).after('<select id="' + id + '_sale_district_select"><option value="选择区域">选择区域</option></select>');
				}
				//添加城市
				if(level > 1){
					$('#' + id).after('<select id="' + id + '_sale_city_select"><option value="选择城市">选择城市</option></select>');
				}
				$('#' + id).after('<select id="' + id + '_sale_province_select"><option value="选择省份">选择省份</option></select>');
				//省份下拉框
				$('#' + id + '_sale_province_select').combobox({  
				    url:urlprovince,  
				    valueField:'provinceId',  
				    textField:'provinceName',
				    onSelect:function(event){
				    	if(level > 1){
				    		$('#' + id + '_sale_city_select').combobox('reload',urlcity + 'province_id=' + $(this).combobox('getValue'));
				    		if(level > 1){
				    			$('#' + id + '_sale_city_select').combobox('reset');
				    		}
				    		if(level > 2){
				    			$('#' + id + '_sale_district_select').combobox('reset');
				    		}
				    		if(level > 3){
				    			$('#' + id + '_sale_input_select').val('');
				    		}
				    	}
				    	//选择省份
				    	$('#' + id).val($(this).combobox('getText') + ' ');
				    }
				});
				//城市
				if(level > 1){
					$('#' + id + '_sale_city_select').combobox({  
					    valueField:'cityId',  
					    textField:'cityName',
					    onSelect:function(event){
					    	//选择城市
					    	$('#' + id).val($('#' + id).val() + $(this).combobox('getText') + " ");
					    	if(level > 2){
					    		$('#' + id + '_sale_district_select').combobox('reload',urldistrict + 'city_id=' + $(this).combobox('getValue'));
					    		$('#' + id + '_sale_district_select').combobox('reset');
					    	}
					    	if(level > 3){
				    			$('#' + id + '_sale_input_select').val('');
				    		}
					    }
					});
				}
				//区域
				if(level > 2){
					$('#' + id + '_sale_district_select').combobox({  
					    valueField:'districtName',  
					    textField:'districtName',
					    onSelect:function(event){
					    	//选择区域
					    	$('#' + id).val($('#' + id).val() + $(this).combobox('getText') + ' ');
					    	if(level > 3){
				    			$('#' + id + '_sale_input_select').val('');
				    		}
					    }
					});
				}
				//详细地址
				if(level > 3){
					$('#' + id + '_sale_input_select').change(function(){
						//选择区域
				    	$('#' + id).val($('#' + id).val() + $(this).val());
					});
				}
		}//end area
	},	loader:{
		show:function(){
			var msg = arguments[0] ? arguments[0] : '正在处理，请稍候。。。';
			$("<div class=\"datagrid-mask\"></div>").css({display:"block",width:"100%",height:$(window).height()}).appendTo("body"); 
			$("<div class=\"datagrid-mask-msg\"></div>").html(msg).appendTo("body").css({display:"block",left:($(document.body).outerWidth(true) - 190) / 2,top:($(window).height() - 45) / 2});
		},
		close:function(){
			$('.datagrid-mask').remove();
			$('.datagrid-mask-msg').remove();
		}
	},	window:{
		/**新建窗体**/
		edit:function(){
			var title = arguments[0] ? arguments[0] : '添加';
			var url = arguments[1] ? arguments[1] : '#'; 
			var width = arguments[2] ? arguments[2] : 600; 
			var height = arguments[3] ? arguments[3] : 400; 
			var id = arguments[4] ? arguments[4] : 'hczd_sys_win_edit';
			$('body').append('<div id="' + id +'" data-options="iconCls:' + "'icon-edit'" +'"></div>');
			$('#' + id).window({
				title:title,
			    width:width,  
			    height:height, 
			    href:url,
			    modal:true
			});
		},//end add
		/**详细页面**/
		detail:function(){
			var title = arguments[0] ? arguments[0] : '详细';
			var url = arguments[1] ? arguments[1] : '#'; 
			var width = arguments[2] ? arguments[2] : 600; 
			var height = arguments[3] ? arguments[3] : 400; 
			var id = arguments[4] ? arguments[4] : 'hczd_sys_win_detail'; 
			$('body').append('<div id="' + id +'" data-options="iconCls:' + "'icon-tip'" +'"></div>');
			$('#' + id).window({
				title:title,
			    width:width,  
			    height:height, 
			    href:url,
			    modal:true
			});
		},
		/**创建frame**/
		editFrame:function (){
			var title = arguments[0] ? arguments[0] : '详细';
			var url = arguments[1] ? arguments[1] : '#'; 
			var width = arguments[2] ? arguments[2] : 600; 
			var height = arguments[3] ? arguments[3] : 400; 
			var id = arguments[4] ? arguments[4] : 'hczd_sys_win_detail'; 
			$('body').append('<div id="' + id +'" data-options="iconCls:' + "'icon-tip'" +'">'+hczd_sys.window.createFrame(url)+'</div>');
			$('#' + id).window({
				title:title,
			    width:width,  
			    height:height, 
			    //href:url,
			    modal:true,
			    onClose:function(){
			    	$('#' + id).remove();
			    }
			});

		},
		/***创建iframe内容**/
		createFrame : function (url) {
			var s = '<iframe scrolling="auto" frameborder="0"  src="' + url
					+ '" style="width:100%;height:100%;"></iframe>';
			return s;
		}
	}
};
