module.exports = (sequelize, DataTypes) => {
	return sequelize.define('feedback_info',{
		id: {
			type: DataTypes.BIGINT,
			primaryKey:true,
			autoIncrement:true
		},
		browser:DataTypes.STRING(255),
		device_type:DataTypes.STRING(255),
		device:DataTypes.STRING(255),
		os:DataTypes.STRING(255),
		ip:DataTypes.STRING(255),
		uuid:DataTypes.STRING(255),
		position:DataTypes.STRING(255),
		ad_type:DataTypes.STRING(255),
		ad_id:DataTypes.STRING(255),
		scan_time:DataTypes.STRING(255),
		created_at:DataTypes.DATE,
		updated_at:DataTypes.DATE,
		version:DataTypes.BIGINT
	},{
		timestamps: true,
		underscored: true,
		version:true,
		freezeTableName: true
	})
};