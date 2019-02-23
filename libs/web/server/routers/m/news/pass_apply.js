/*
* 审核通过社团发布的活动
*/
const crypto = require("crypto");
module.exports = async function (req, res, next){
	var query = req.body;
	var swc = req.swc;
	if(!query.news_status){
		query.news_status = 1;
	}

	if(parseInt(query.news_status) != query.news_status || !(query.news_status in {1:true,3:true})){
		req.response.status = 4003;
		req.response.error_message = "参数错误：status";
		next();
		return ;
	}

	try{
		if(!query.news_id || query.news_id.length != 32){
			req.response.status = 4003;
			req.response.error_message = "参数错误：news_id";
			next();
			return ;
		}

		//查找对应的apply
		var result = await swc.db.models.news.findAndCountAll({
			where : {
				news_id : query.news_id
			}
		})
		if(result.count == 0){
			req.response.status = 4004;
			req.response.error_message = "申请不存在";
			next();
			return ;
		}

		//更新apply状态
		var now = +new Date();
		var result2 = await result.rows[0].update({
			news_status : query.news_status,
			update_at : now,
			update_by : req.source.admin.admin_id
		})

		req.response.data = result2;
		next();
	}catch(e){
		req.response.status = 5000;
		req.response.error_message = e.message;
		next();
		return ;
	}
}