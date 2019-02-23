module.exports = async function (req, res, next){
	var query = req.query;
	var swc = req.swc;

	if(!query.item_per_page){
		query.item_per_page = 200;
	}

	if(!query.page){
		query.page = 1;
	}

	if(!query.news_id || query.news_id.length != 32){
		req.response.status = 4005;
		req.response.error_message = "参数错误：news_id";
		next();
		return ;
	}

	if(parseInt(query.page) != query.page || parseInt(query.item_per_page) != query.item_per_page){
		req.response.status = 4005;
		req.response.error_message = "参数错误：page or item_per_page";
		next();
		return ;
	}
	query.item_per_page = parseInt(query.item_per_page);
	var conditions = {
		news_id : query.news_id
	};

	var result = await swc.db.models.news_joins.findAndCountAll({
		where : conditions,
		include : [{
			as : "user",
			model : swc.db.models.users
		}],
		order : [["create_at", "DESC"]],
		limit : query.item_per_page,
		offset : (query.page - 1) * query.item_per_page
	})

	req.response.data = result;
	next();
	return ;
}