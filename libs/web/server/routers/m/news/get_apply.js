module.exports = async (req, res, next)=>{
	var query = req.query;
	var swc = req.swc;

	if(!query.item_per_page){
		query.item_per_page = 10;
	}

	query.item_per_page = parseInt(query.item_per_page);

	if(!query.page){
		query.page = 1;
	}

	if(query.news_id != undefined){

		if(query.news_id.length != 32){
			req.response.status = 4005;
			req.response.error_message = "参数错误：news_id";
			next();
			return ;
		}

		var result = await swc.db.models.news.findAndCountAll({
			where : {
				news_id : query.news_id
			}
		})

		for(var i=0;i<result.rows.length;i++){
			result.rows[i].content = new Buffer(result.rows[i].content, "base64").toString()
		}

		req.response.data = result;
		next();
		return ;
	} else {

		if(parseInt(query.page) != query.page || parseInt(query.item_per_page) != query.item_per_page){
			req.response.status = 4005;
			req.response.error_message = "参数错误：page or item_per_page";
			next();
			return ;
		}

		//查询条件
		var condition = {
			news_status : 2
		};

		if(query.club_id && query.club_id.length == 32){
			condition.club_id = query.club_id;
		}

		var result = await swc.db.models.news.findAndCountAll({
			where : condition,
			include : {
				as : "club",
				model : swc.db.models.clubs
			},
			order : [["create_at", "DESC"]],
			limit : query.item_per_page,
			offset : (query.page - 1) * query.item_per_page
		})

		for(var i=0;i<result.rows.length;i++){
			result.rows[i].content = new Buffer(result.rows[i].content, "base64").toString()
		}

		req.response.data = result;
		next();
		return ;
	}
}