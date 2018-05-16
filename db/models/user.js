/**
 * Created by liuchaorun on 2017/3/30.
 */
module.exports = (sequelize, DataTypes) => {
	return sequelize.define("user", {
		user_id: {
			type: DataTypes.BIGINT,
			primaryKey:true,
			autoIncrement:true
		},
		username: {
			type:DataTypes.STRING(255)
		},
		email: {
			type:DataTypes.STRING(255)
		},
		password: {
			type:DataTypes.STRING(32)
		},
		last_login_time:DataTypes.DATE,
		work_place:DataTypes.STRING(255),
		created_at:DataTypes.DATE,
		updated_at:DataTypes.DATE,
		version:DataTypes.BIGINT
	},{
		timestamps: true,
		underscored: true,
		freezeTableName: true,
		version:true,
		hooks:{
			beforeCreate:user=>{
				user.version = 0;
			},
			beforeUpdate:user=>{
				user.version++;
			}
		},
		associate:function (models) {
			models.user.hasMany(
				models.ad,
				{
					foreignKey: 'user_id'
				});
			models.user.hasMany(
				models.screen,
				{
					foreignKey: 'user_id'
				});
			models.user.hasMany(
				models.resource,
				{
					foreignKey: 'user_id'
				});
			models.user.belongsToMany(
				models.ad_label,
				{
					through:'user_ad_label',
					foreignKey:'user_id'
				});
		}
	})
};