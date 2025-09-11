const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const CompanyLocation = sequelize.define('CompanyLocation', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    company_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    location_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false
    },
    special_requirements: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'company_locations',
    indexes: [
      { fields: ['company_id'] },
      { fields: ['latitude', 'longitude'] }
    ]
  });

  CompanyLocation.associate = (models) => {
    CompanyLocation.belongsTo(models.User, {
      foreignKey: 'company_id',
      as: 'company'
    });
  };

  return CompanyLocation;
};

