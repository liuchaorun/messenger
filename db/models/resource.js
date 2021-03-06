/**
 * Created by lcr on 17-6-27.
 */
module.exports = (sequelize, DataTypes) => {
	return sequelize.define('resource',{
		resource_id:{
			type: DataTypes.BIGINT,
			primaryKey:true,
			autoIncrement:true
		},
		name:{
			type:DataTypes.STRING(255)
		},
		md5:DataTypes.STRING(255),
		user_id:DataTypes.BIGINT,
		remark:DataTypes.STRING(255),
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
			models.resource.hasMany(
				models.screen,
				{
					foreignKey: 'resource_id'
				});
			models.resource.belongsToMany(
				models.ad,
				{
					through: 'resource_ad',
					foreignKey: 'resource_id'
				});
		}
	})
};