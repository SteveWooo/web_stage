/*
* @param 
* 社团申请接口, 申请社团后，把图片写入资源库中
*/
const crypto = require("crypto");
const fs = require("fs");

module.exports = async function(req, res, next){
	var query = req.body;
	var swc = req.swc;
	if(!query.name || !query.e_name || !query.description || !query.category_id || !query.cover){
		req.response.status = 4005;
		req.response.error_message = "参数错误";
		next();
		return ;
	}

	var file_data = swc.common.images.set_image(swc, query);
	if(!file_data){
		req.response.status = 4003;
		req.response.error_message = "图片错误";
		next();
		return ;
	}

	var now = +new Date();
	var club_apply = {
		create_by : req.source.user.user_id,
		update_by : req.source.user.user_id,
		create_at : now,
		update_at : now,

		name : query.name,
		e_name : query.e_name,
		category_id : query.category_id,
		cover_url : "/" + file_data.filename,
		description : query.description,

		apply_id : crypto.createHash("md5").update([
			req.source.user.user_id,
			now,
			swc.config.wechat.public_salt
		].join("&")).digest("hex")
	}

	try{
		var result = await swc.db.models.club_applies.create(club_apply);
		req.response.data = result;
		next();
	}catch(e){
		req.response.status = 5000;
		req.response.error_message = e.message;
		next();
		return ;
	}

}