const crypto = require("crypto");
module.exports = async (req, res, next)=>{
	var query = req.body;
	var swc = req.swc;

	if(!req.source.admin_id){
		req.source.admin_id = "ROOT";
	}

	if(!query.news_id || query.news_id.length != 32){
		req.response.status = 4005;
		req.response.error_message = "参数错误：news_id";
		next();
		return ;
	}

	//todo：鉴权是否club_id和admin所在的club_id是否一致。（懒

	try{
		var result = await swc.db.models.news.destroy({
			where : {
				news_id : query.news_id
			}
		});

		req.response.result = result;
		req.response.message = "删除成功";
		next();
		return ;
	}catch(e){
		req.response.status = 5000;
		req.response.error_message = e.message;
		next();
		return ;
	}
}