/*
* @param apply_staus变更状态
* 关于状态：2代表通过，3代表拒绝
* 通过社团申请，创建新社团
*/
const crypto = require("crypto");
module.exports = async function (req, res, next){
	var query = req.body;
	var swc = req.swc;
	if(!query.apply_status){
		query.apply_status = 1;
	}

	if(parseInt(query.apply_status) != query.apply_status || !(query.apply_status in {1:true,3:true})){
		req.response.status = 4003;
		req.response.error_message = "参数错误：status";
		next();
		return ;
	}

	try{
		if(!query.apply_id || query.apply_id.length != 32){
			req.response.status = 4003;
			req.response.error_message = "参数错误：apply_id";
			next();
			return ;
		}

		//查找对应的apply
		var result = await swc.db.models.club_applies.findAndCountAll({
			where : {
				apply_id : query.apply_id
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
		var result2 = result.rows[0].update({
			apply_status : query.apply_status,
			update_at : now,
			update_by : req.source.admin.admin_id
		})

		//如果状态为上线，则创建club数据
		if(query.apply_status == 1){
			var apply_data = result.rows[0];
			var club = {
				club_id : crypto.createHash("md5").update([
					apply_data.name,
					req.source.admin.admin_id,
					now,
					swc.config.wechat.public_salt
				].join("&")).digest("hex"),
				category_id : apply_data.category_id,
				name : apply_data.name,
				e_name : apply_data.e_name,
				description : apply_data.description,
				cover_url : apply_data.cover_url,

				create_by : apply_data.create_by,
				update_by : req.source.admin.admin_id,
				create_at : now,
				update_at : now
			}

			var result3 = await swc.db.models.clubs.create(club);
			req.response.data = result3;
			next();
		} else {
			req.response.data = result2;
			next();
		}
	}catch(e){
		req.response.status = 5000;
		req.response.error_message = e.message;
		next();
		return ;
	}
}