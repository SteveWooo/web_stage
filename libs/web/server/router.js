/*
* 统一入口
*/
async function req_handle(req, res, next){
	req.response = {
		status : 2000
	}
	req.response_headers = {};
	req.source = {
		user : {}
	}
	next();
}

/*
* 统一响应出口，把req.response的内容响应给前端
*/
async function res_handle(req, res){
	res.header("Content-Type", "application/json; charset=utf-8")
	for(var i in req.response_headers){
		res.header(i, req.response_headers[i]);
	}

	req.response.source = req.source;

	res.send(JSON.stringify(req.response));
}

//不需要鉴权的路由
var public_router = {
	login : { //客户端登陆
		module : require("./routers/login"),
		path : "/login",
		method : "get"
	},
	p_news_get : {
		module : require("./routers/p/news/get"),
		path : "/api/p/news/get",
		method : "get"
	},

	p_club_category_get : {
		module : require("./routers/p/club/get_category"),
		path : "/api/p/club/get_category",
		method : "get"
	},

	p_clubs_get : {
		module : require("./routers/p/club/get"),
		path : "/api/p/club/get",
		method : 'get'
	}
}

//需要鉴权用户信息的路由
var security_routers = {
	club_apply : {
		module : require("./routers/club/apply/create"),
		path : "/api/club/apply/create",
		method : "post"
	},

	set_info : {
		module : require("./routers/u/info/set"),
		path : "/api/u/info/set",
		method : "post"
	},

	p_clubs_get : {
		module : require("./routers/club/info/get"),
		path : "/api/club/info/get",
		method : 'get'
	},

	club_news_create : {
		module : require("./routers/club/news/create"),
		path : "/api/club/news/create",
		method : 'post'
	},

	club_news_join : {
		module : require("./routers/club/news/join"),
		path : "/api/club/news/join",
		method : 'post'
	},

	get_user_join : {
		module : require("./routers/club/news/get_my_ticker"),
		path : "/api/club/news/get_my_join",
		method : "get"
	},

	get_news_join_list : {
		module : require("./routers/club/news/get_join_list"),
		path : "/api/club/news/get_join_list",
		method : "get"
	}
}

//后台接口
var admin_routers = {
	login : {
		module : require("./routers/m/login"),
		path : "/api/m/login",
		method : "post"
	},
	admin_info : {
		module : require("./routers/m/admin_info"),
		path : "/api/m/admin_info",
		method : "get"
	},

	//社团分类
	club_category_create : {
		module : require("./routers/m/club_category/create"),
		path : "/api/m/club_category/create",
		method : "post"
	},
	club_category_delete : {
		module : require("./routers/m/club_category/delete"),
		path : "/api/m/club_category/delete",
		method : "post"
	},

	//社团申请类
	club_apply_get : {
		module : require("./routers/m/club/get_apply"),
		path : "/api/m/club_apply/get",
		method : "get"
	},
	club_apply_pass : {
		module : require("./routers/m/club/pass_apply"),
		path : "/api/m/club_apply/pass",
		method : "post"
	},

	//社团操作类
	club_status_change : {
		module : require("./routers/m/club/change_club_status"),
		path : "/api/m/club/change_club_status",
		method : "post"
	},

	//社团活动类
	club_news_apply_list : {
		module : require("./routers/m/news/get_apply"),
		path : "/api/m/news/get_apply",
		method : "get"
	},
	club_news_apply_pass : {
		module : require("./routers/m/news/pass_apply"),
		path : "/api/m/news/pass_apply",
		method : "post"
	},
	club_news_status_change : {
		module : require("./routers/m/news/change_status"),
		path : "/api/m/news/change_status",
		method : "post"
	}
}

//中间件
var middlewares = {
	auth : {
		module : require("./middlewares/auth"),
	},
	admin_auth : {
		module : require("./middlewares/admin_auth"),
	}
}

/*
* 加载路由器
*/
async function router(swc){
	for(var i in public_router){
		var r = public_router[i];
		swc.app[r.method](r.path, (req, res, next)=>{
			req.swc = swc;
			next();
		}, 
		req_handle, 
		r.module, 
		res_handle);
	}

	for(var i in security_routers){
		var r = security_routers[i];
		swc.app[r.method](r.path, (req, res, next)=>{
			req.swc = swc;
			next();
		}, 
		req_handle, 
		middlewares.auth.module, 
		r.module, 
		res_handle);
	}

	for(var i in admin_routers){
		var r = admin_routers[i];
		swc.app[r.method](r.path, (req, res, next)=>{
			req.swc = swc;
			next();
		}, 
		req_handle,
		middlewares.admin_auth.module, 
		r.module, 
		res_handle);
	}

	return swc;
}

exports.router = router;