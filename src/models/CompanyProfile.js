const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const CompanyProfile = sequelize.define('CompanyProfile', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    company_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    license_number: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    zip_code: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    logo_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    verification_status: {
      type: DataTypes.ENUM('pending', 'verified', 'rejected'),
      defaultValue: 'pending'
    },
    verification_documents: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    tableName: 'company_profiles',
    indexes: [
      {
        unique: true,
        fields: ['user_id']
      },
      {
        fields: ['verification_status']
      }
    ]
  });

  CompanyProfile.associate = (models) => {
    CompanyProfile.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return CompanyProfile;
};