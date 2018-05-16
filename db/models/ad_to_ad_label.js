module.exports = (sequelize, DataTypes) => {
	return sequelize.define('ad_to_ad_label',{
		ad_label_id:DataTypes.BIGINT,
		ad_id:DataTypes.BIGINT
	},{
		timestamps: false,
		underscored: true,
		version:false,
		freezeTableName: true
	})
};