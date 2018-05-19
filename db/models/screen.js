/**
 * Created by lcr on 17-6-27.
 */
module.exports = (sequelize, DataTypes) => {
	return sequelize.define('screen',{
		screen_id: {
			type: DataTypes.BIGINT,
			primaryKey:true,
			autoIncrement:true
		},
		name:DataTypes.STRING(255),
		time:DataTypes.BIGINT,
		user_id:DataTypes.BIGINT,
		uuid:{
			type:DataTypes.STRING(255)
		},
		remark:DataTypes.STRING(255),
		resource_id:DataTypes.BIGINT,
		created_at:DataTypes.DATE,
		updated_at:DataTypes.DATE,
		version:DataTypes.BIGINT,
		screen_resolution:DataTypes.STRING(32)
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
	})
};