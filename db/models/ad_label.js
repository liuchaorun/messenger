module.exports = (sequelize, DataTypes) => {
	return sequelize.define('ad_label',{
		ad_label_id:{
			type: DataTypes.BIGINT,
			primaryKey:true,
			autoIncrement:true
		},
		name:DataTypes.STRING(255),
		times:DataTypes.BIGINT,
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
				user.times = 0;
			},
			beforeUpdate:user=>{
				user.version++;
				user.times++;
			}
		},
		associate:function (models) {
			models.ad_label.belongsToMany(
				models.ad,
				{
					through:'ad_to_ad_label',
					foreignKey:'ad_label_id'
				});
			models.ad_label.belongsToMany(
				models.user,
				{
					through:'user_ad_label',
					foreignKey:'ad_label_id'
				});
		}
	})
};