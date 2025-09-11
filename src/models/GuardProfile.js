const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const GuardProfile = sequelize.define('GuardProfile', {
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
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
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
    experience_years: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    hourly_rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    availability: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    is_armed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    license_number: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    license_expiry: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    certificates: {
      type: DataTypes.JSON,
      allowNull: true
    },
    skills: {
      type: DataTypes.JSON,
      allowNull: true
    },
    languages: {
      type: DataTypes.JSON,
      allowNull: true
    },
    profile_picture: {
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
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      defaultValue: 0.00
    },
    total_ratings: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'guard_profiles',
    indexes: [
      {
        unique: true,
        fields: ['user_id']
      },
      {
        fields: ['availability']
      },
      {
        fields: ['is_armed']
      },
      {
        fields: ['verification_status']
      },
      {
        fields: ['rating']
      }
    ]
  });

  GuardProfile.associate = (models) => {
    GuardProfile.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return GuardProfile;
};