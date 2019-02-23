module.exports = async function(req, res, next){
	var query = req.body;
	var swc = req.swc;

	if(!query.news_id || query.news_id.length != 32){
		req.response.status = 4005;
		req.response.error_message = "参数错误：news_id";
		next();
		return ;
	}

	try{
		var result = await swc.db.models.news_joins.findAndCountAll({
			where : {
				news_id : query.news_id,
				user_id : req.source.user.user_id
			}
		})

		if(result.count != 0){
			req.response.status = 2001;
			req.response.error_message = "您已经报名了哟～";
			next();
			return ;
		}

		var now = +new Date();
		var news_join = {
			news_id : query.news_id,
			user_id : req.source.user.user_id,
			create_at : now,
			update_at : now,
			create_by : req.source.user.user_id,
			update_by : req.source.user.user_id
		}

		var result2 = await swc.db.models.news_joins.create(news_join);
		req.response.data = result2;
		next();
	}catch(e){
		req.response.status = 5000;
		req.response.error_message = e.message;
		next();
		return ;
	}

	next();
}