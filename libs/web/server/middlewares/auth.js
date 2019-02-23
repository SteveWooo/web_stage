async function auth(req, res, next){
	var query;
	if(req.method == "GET"){
		query = req.query
	} else {
		query = req.body;
	}
	// req.source.user = {
	// 	user_id : "test"
	// }
	// next();
	// return ;

	if(!(query.swc_session in global.swc.redis.swc_session)){
		res.send(JSON.stringify({
			status : 4003,
			message : "请重新打开小程序"
		}))
		return ;
	}
	// console.log(global.swc.redis.swc_session[query.swc_session].openid + " is visited");
	req.source.user = {
		user_id : global.swc.redis.swc_session[query.swc_session].user_id,
		swc_session : query.swc_session
	}
	next();
}

module.exports = auth;