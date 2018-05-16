/**
 * Created by lcr on 17-6-27.
 */
module.exports = (sequelize, DataTypes) => {
	return sequelize.define('resource_ad',{
		resource_id:DataTypes.BIGINT,
		ad_label_id:DataTypes.BIGINT
	},{
		timestamps: false,
		underscored: true,
		version:false,
		freezeTableName: true,
	})
};