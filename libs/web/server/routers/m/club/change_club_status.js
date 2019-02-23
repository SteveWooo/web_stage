const crypto = require("crypto");

/*
* 修改社团的状态， 1代表上线正常，2代表已被下线
*/
module.exports = async function (req, res, next){
	var query = req.body;
	var swc = req.swc;

	if(!query.club_id || query.club_id.length != 32){
		req.response.status = 4003;
		req.response.error_message = "参数错误：club_id";
		next();
		return ;
	}

	if(!query.club_status){
		query.club_status = 1;
	}
	if(query.club_status != 2 && query.club_status != 1){
		req.response.status = 4003;
		req.response.error_message = "参数错误：status";
		next();
		return ;
	}

	try{
		var club = await swc.db.models.clubs.findAndCountAll({
			where : {
				club_id : query.club_id
			}
		})

		if(club.count == 0){
			req.response.status = 4004;
			req.response.error_message = "社团不存在";
			next();
			return ;
		}

		var result = await club.rows[0].update({
			club_status : query.club_status
		})

		req.response.data = result;
		next();
	}catch(e){
		req.response.status = 5000;
		req.response.error_message = e.message;
		next();
		return ;
	}

}
