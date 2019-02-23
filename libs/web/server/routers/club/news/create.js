const crypto = require("crypto");
const fs = require("fs");

async function get_images(swc, images){
	var result = [];
	for(var i=0;i<images.length;i++){
		var file_data = swc.common.images.set_image(swc, {
			cover : images[i].base64
		});
		if(!file_data){
			continue;
		}
		result.push("/" + file_data.filename);
	}

	return result.join(",");
}

module.exports = async (req, res, next)=>{
	var query = req.body;
	var swc = req.swc;

	if(!query.club_id || query.club_id.length != 32){
		req.response.status = 4005;
		req.response.error_message = "参数错误：club_id";
		next();
		return ;
	}

	query.cover_url = await get_images(swc, [{
		base64 : query.cover
	}])

	if(!query.cover_url){
		req.response.status = 4005;
		req.response.error_message = "参数错误：cover";
		next();
		return ;
	}

	var now = +new Date();
	var source = [
		"news",
		req.source.user.user_id,
		now,
		swc.config.wechat.public_salt
	].join("&")
	var news = {
		news_id : crypto.createHash("md5").update(source).digest("hex"),
		club_id : query.club_id,
		title : query.title,
		cover_url : query.cover_url,
		content : (new Buffer(query.content).toString("base64")),
		images : await get_images(swc, query.images),
		news_status : 2,
		create_at : now,
		create_by : req.source.user.user_id,
		update_at : now,
		update_by : req.source.user.user_id
	}

	try{
		var result = await swc.db.models.news.create(news);

		req.response.data = result;
		req.response.message = "创建成功";
		next();
		return ;
	}catch(e){
		console.log(e);
		req.response.status = 5000;
		req.response.error_message = e.message;
		next();
		return ;
	}
}