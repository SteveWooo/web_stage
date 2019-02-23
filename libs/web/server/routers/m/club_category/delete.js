const crypto = require("crypto");
module.exports = async (req, res, next)=>{
	var query = req.body;
	var swc = req.swc;

	if(!query.category_id || query.category_id.length != 32){
		req.response.status = 4005;
		req.response.error_message = "参数错误：category_id";
		next();
		return ;
	}

	try{
		var result = await swc.db.models.club_categories.destroy({
			where : {
				category_id : query.category_id
			}
		});

		req.response.data = result;
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