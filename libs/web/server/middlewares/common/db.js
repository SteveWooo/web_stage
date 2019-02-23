const Sequelize = require("sequelize");
async function models_defined(swc){
	swc.db.models.users = swc.db.seq.define("users", {
		openid : {type : Sequelize.STRING(32)},
		user_id : {type : Sequelize.STRING(32)},
		nick_name : {type : Sequelize.STRING()},
		avatar_url : {type : Sequelize.STRING()},

		create_by : {type : Sequelize.STRING(32)},
		update_by : {type : Sequelize.STRING(32)},
		create_at : {type : Sequelize.STRING()},
		update_at : {type : Sequelize.STRING()},
	})
	swc.db.models.news = swc.db.seq.define("news", {
		news_id : {type : Sequelize.STRING(32)},
		club_id : {type : Sequelize.STRING(32)},
		title : {type : Sequelize.STRING()},
		content : {type : Sequelize.STRING()},
		images : {type : Sequelize.STRING()},
		news_status : {type : Sequelize.INTEGER()},
		cover_url : {type : Sequelize.STRING()},

		end_time : {type : Sequelize.STRING()},

		create_by : {type : Sequelize.STRING(32)},
		update_by : {type : Sequelize.STRING(32)},
		create_at : {type : Sequelize.STRING()},
		update_at : {type : Sequelize.STRING()},
	})
	swc.db.models.news_joins = swc.db.seq.define("news_joins", {
		news_id : {type : Sequelize.STRING(32)},
		user_id : {type : Sequelize.STRING(32)},

		create_by : {type : Sequelize.STRING(32)},
		update_by : {type : Sequelize.STRING(32)},
		create_at : {type : Sequelize.STRING()},
		update_at : {type : Sequelize.STRING()},
	})
	swc.db.models.clubs = swc.db.seq.define("clubs", {
		club_id : {type : Sequelize.STRING(32)},
		category_id : {type : Sequelize.STRING(32)},
		name : {type : Sequelize.STRING()},
		e_name : {type : Sequelize.STRING()},
		description : {type : Sequelize.STRING()},
		cover_url : {type : Sequelize.STRING()},
		club_status : {type : Sequelize.INTEGER()},

		create_by : {type : Sequelize.STRING(32)},
		update_by : {type : Sequelize.STRING(32)},
		create_at : {type : Sequelize.STRING()},
		update_at : {type : Sequelize.STRING()},
	})
	swc.db.models.club_categories = swc.db.seq.define("club_categories", {
		category_id : {type : Sequelize.STRING(32)},
		name : {type : Sequelize.STRING()},

		create_by : {type : Sequelize.STRING(32)},
		update_by : {type : Sequelize.STRING(32)},
		create_at : {type : Sequelize.STRING()},
		update_at : {type : Sequelize.STRING()},
	})
	swc.db.models.club_applies = swc.db.seq.define("club_applies", {
		apply_id : {type : Sequelize.STRING(32)},
		category_id : {type : Sequelize.STRING(32)},
		name : {type : Sequelize.STRING()},
		e_name : {type : Sequelize.STRING()},
		cover_url : {type : Sequelize.STRING()},
		description : {type : Sequelize.STRING()},

		apply_status : {type : Sequelize.INTEGER()},

		create_by : {type : Sequelize.STRING(32)},
		update_by : {type : Sequelize.STRING(32)},
		create_at : {type : Sequelize.STRING()},
		update_at : {type : Sequelize.STRING()},
	})
	swc.db.models.admins = swc.db.seq.define("admins", {
		admin_id : {type : Sequelize.STRING(32)},
		account : {type : Sequelize.STRING()},
		password : {type : Sequelize.STRING(32)},
		type : {type : Sequelize.INTEGER},
		name : {type : Sequelize.STRING},

		create_by : {type : Sequelize.STRING(32)},
		update_by : {type : Sequelize.STRING(32)},
		create_at : {type : Sequelize.STRING()},
		update_at : {type : Sequelize.STRING()},
	})

	// swc.db.models.clubs.hasMany(swc.db.models.news, {
	// 	foreignKey : "club_id"
	// })

	//数据索引
	swc.db.models.club_applies.belongsTo(swc.db.models.users, {
		foreignKey : "create_by",
		targetKey : "user_id",
		as : "user"
	})
	swc.db.models.club_applies.belongsTo(swc.db.models.club_categories, {
		foreignKey : "category_id",
		targetKey : "category_id",
		as : "category"
	})

	swc.db.models.clubs.belongsTo(swc.db.models.users, {
		foreignKey : "create_by",
		targetKey : "user_id",
		as : "user"
	})
	swc.db.models.clubs.belongsTo(swc.db.models.club_categories, {
		foreignKey : "category_id",
		targetKey : "category_id",
		as : "category"
	})

	swc.db.models.club_categories.belongsTo(swc.db.models.users, {
		foreignKey : "create_by",
		targetKey : "user_id",
		as : "user"
	})
	swc.db.models.club_categories.belongsTo(swc.db.models.admins, {
		foreignKey : "create_by",
		targetKey : "admin_id",
		as : "admin"
	})

	swc.db.models.news.belongsTo(swc.db.models.clubs, {
		foreignKey : "club_id",
		targetKey : "club_id",
		as : "club"
	})

	swc.db.models.news_joins.belongsTo(swc.db.models.users, {
		foreignKey : "user_id",
		targetKey : "user_id",
		as : "user"
	})
	swc.db.models.news_joins.belongsTo(swc.db.models.news, {
		foreignKey : "news_id",
		targetKey : "news_id",
		as : "news"
	})
	// swc.db.models.news.belongsTo(swc.db.models.clubs, {
	// 	foreignKey : "club_id"
	// })

	return swc;
}

module.exports = async (swc)=>{
	var seq = new Sequelize(swc.config.mysql.database, swc.config.mysql.user, swc.config.mysql.password, {
		host : swc.config.mysql.host,
		dialect : "mysql",
		port : swc.config.mysql.port || 3306,
		operatorsAliases: false,
		pool : {
			max : 5,
			min : 0,
			acquire : 30000,
			idle : 10000,
		},
		define: {
	    	timestamps: false
	 	},
	 	logging : false
	})
	//检查连接情况
	try{
		var res = await seq.authenticate();
	}catch(e){
		throw "Unable to connect database :" + e.message
	}

	swc.db = {
		seq : seq,
		models : {}
	}
	//定义orm模型
	swc = await models_defined(swc);
	return swc;
}