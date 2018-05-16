module.exports = (sequelize, DataTypes) => {
	return sequelize.define('user_ad_label',{
		user_id:DataTypes.BIGINT,
		ad_label_id:DataTypes.BIGINT
	},{
		timestamps: false,
		underscored: true,
		version:false,
		freezeTableName: true,
	})
};