module.exports = async function (req, res, next){
	var query = req.query;
	var swc = req.swc;

	if(query.apply_id && query.apply_id.length == 32){
		var result = await swc.db.models.club_applies.findAndCountAll({
			where : {
				apply_id : query.apply_id
			}
		})
		req.response.data = result;
		next();
		return ;
	}

	if(!query.item_per_page){
		query.item_per_page = 10;
	}

	if(!query.page){
		query.page = 1;
	}

	if(parseInt(query.page) != query.page || parseInt(query.item_per_page) != query.item_per_page){
		req.response.status = 4005;
		req.response.error_message = "参数错误：page or item_per_page";
		next();
		return ;
	}
	query.item_per_page = parseInt(query.item_per_page);
	var result = await swc.db.models.club_applies.findAndCountAll({
		where : {
			apply_status : 2
		},
		include : [{
			as : "user",
			model : swc.db.models.users
		},{
			as : "category",
			model : swc.db.models.club_categories
		}],
		order : [["create_at", "DESC"]],
		limit : query.item_per_page,
		offset : (query.page - 1) * query.item_per_page
	})

	req.response.data = result;
	next();
	return ;
}