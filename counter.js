function count(event, files){
	event.preventDefault();
	event.stopPropagation();
	var regexp = new RegExp("\n");
	$("#drag_panel").attr('class', 'drag_panel_on_file_loaded');
	$("#info_panel").attr('class', "info_panel_on_file_loaded");
	$("#drag_panel").html("<ul id=\"file_list\" />");
	$("#info_panel").html("");
	var lines = 0;
	var loaded = 0;
	for(var i=0;i<files.length;i++){
		if(files[i].name=="."){
			continue;
		}
		var reader = new FileReader();
		reader.onload = (function(file) {
			return function(e) {
				var line = e.target.result.split(regexp).length;
				var log_elem = $(document.createElement("li"));
				log_elem.text(file.name+" : "+line+"行");
				$('#drag_panel>ul#file_list').append(log_elem);
				lines += line;
				loaded++;
				updateLineInfo(loaded, lines);
			};
		})(files[i]);
		reader.onerror = (function(file) {
			return function(e) {
				var log_elem = $(document.createElement("li"));
				switch(e.target.error.code){
					case e.target.error.ABORT_ERR:
						log_elem.text("中断エラー："+file.name);
						break;
					case e.target.error.ENCODING_ERR:
						log_elem.text("エンコードエラー："+file.name);
						break;
					case e.target.error.NOT_FOUND_ERR:
						log_elem.text("ファイルが見つかりません："+file.name);
						break;
					case e.target.error.NOT_READABLE_ERR:
						log_elem.text("ファイルが読めません："+file.name);
						break;
					case e.target.error.SECURITY_ERR:
						log_elem.text("セキュリティエラー："+file.name);
						break;
				}
				$('#drag_panel>ul#file_list').append(log_elem);
				updateLineInfo(loaded, lines);
			};
		})(files[i]);
		reader.readAsText(files[i]);
	}
	
}

function updateLineInfo(loaded_files, lines){
	$('#info_panel').html("<strong>"+loaded_files+"</strong>&nbsp;ファイル　"+"<strong>"+lines+"</strong>&nbsp;行");
}


$(document).ready(function(){
	var btn = document.getElementById('count_button');
	btn.addEventListener('click',function(e){count(e, $("#file_input")[0].files);}, true);
	var panel = document.getElementById('drag_panel');
	panel.addEventListener("dragover", function(e){ e.preventDefault();}, false);
	panel.addEventListener('drop',function(e){count(e,e.dataTransfer.files);},false);
});
