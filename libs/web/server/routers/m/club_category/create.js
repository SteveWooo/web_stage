const crypto = require("crypto");

/*
* @param name
* 创建分类函数。
*/
module.exports = async (req, res, next)=>{
	var query = req.body;
	var swc = req.swc;
	if(!query.name){
		req.response.status = 4005;
		req.response.error_message = "参数错误:name";
		next();
		return ;
	}

	var now = +new Date();
	var category = {
		name : query.name,
		category_id : crypto.createHash("md5").update([
			query.name,
			req.source.admin.admin_id,
			now,
			swc.config.wechat.public_salt
		].join("&")).digest("hex"),
		create_by : req.source.admin.admin_id,
		update_by : req.source.admin.admin_id,
		create_at : now,
		update_at : now
	}

	try{
		var result = await swc.db.models.club_categories.create(category);
		req.response.data = result;
		next();
	}catch(e){
		console.log(e);
		req.response.status = 5000;
		req.response.error_message = "系统错误";
		next();
		return ;
	}
}