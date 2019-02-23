const crypto = require("crypto");
const fs = require("fs");
	
const IMAGE_HEADERS = {
	"data:image/png;base64" : "png", 
	"data:image/jpeg;base64" : "jpeg"
}
/*
* @param cover图片base64
* 保存文件到本地
*/
var set_image = function(swc, options){
	//取文件后缀
	var file_header = options.cover.substring(0, options.cover.indexOf(','));
	if(!(file_header in IMAGE_HEADERS)){
		return undefined;
	}
	var filename = crypto.createHash("md5").update(options.cover).digest("hex");
	filename = filename + "." + IMAGE_HEADERS[file_header];

	options.cover = options.cover.replace(/^data:image\/\w+;base64,/, "");

	var data_buffer = new Buffer(options.cover, 'base64');
	fs.writeFileSync(swc.config.server.base_res_path + "/" + filename, data_buffer);
	return {
		filename : filename
	}
}

exports.set_image = set_image;