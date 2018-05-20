/**
 * Created by lcr on 17-6-27.
 */
module.exports = (sequelize, DataTypes) => {
	return sequelize.define('ad',{
		ad_id: {
			type: DataTypes.BIGINT,
			primaryKey:true,
			autoIncrement:true
		},
		name: {
			type:DataTypes.STRING(255),
			allowNull: false
		},
		size: {
			type:DataTypes.BIGINT,
			allowNull:false
		},
		url: {
			type:DataTypes.STRING(32),
			allowNull:false
		},
		user_id: {
			type: DataTypes.BIGINT,
			allowNull:false
		},
		ad_size:{
			type:DataTypes.STRING(255),
			allowNull:false
		},
		file_type:{
			type:DataTypes.STRING(255),
			allowNull:false
		},
		thumbnails_url:{
			type:DataTypes.STRING(255),
			allowNull:false
		},
		md5:DataTypes.STRING(32),
		target:DataTypes.STRING(255),
		position:DataTypes.STRING(255),
		file_name:DataTypes.STRING(255),
		ad_type:DataTypes.INTEGER,//0为图片，1为视频
		created_at:DataTypes.DATE,
		updated_at:DataTypes.DATE,
		version:DataTypes.BIGINT
	},{
		timestamps: true,
		underscored: true,
		version:true,
		freezeTableName: true,
		hooks:{
			beforeCreate:user=>{
				user.version = 0;
			},
			beforeUpdate:user=>{
				user.version++;
			}
		},
		associate:function (models) {
			models.ad.belongsToMany(
				models.resource,
				{
					through: 'resource_ad',
					foreignKey: 'ad_id'
				});
			models.ad.belongsToMany(
				models.ad_label,
				{
					through:'ad_to_ad_label',
					foreignKey:'ad_id'
				});
		}
	})
};