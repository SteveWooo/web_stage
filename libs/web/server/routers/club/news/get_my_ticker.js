module.exports = async (req, res, next)=>{
	var query = req.query;
	var swc = req.swc;

	var result = await swc.db.models.news_joins.findAndCountAll({
		where : {
			user_id : req.source.user.user_id
		},
		include : {
			as : "news",
			model : swc.db.models.news
		},
		order : [["create_at", "DESC"]],
		limit : 100
	})

	req.response.data = result;
	next();
	return ;
}