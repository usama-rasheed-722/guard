const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const JobLocation = sequelize.define('JobLocation', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    job_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'jobs',
        key: 'id'
      }
    },
    company_location_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'company_locations',
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
    hours_required: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: true
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: true
    },
    required_guards: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    special_requirements: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'job_locations',
    indexes: [
      {
        unique: true,
        fields: ['job_id']
      },
      {
        fields: ['latitude', 'longitude']
      }
    ]
  });

  JobLocation.associate = (models) => {
    JobLocation.belongsTo(models.Job, {
      foreignKey: 'job_id',
      as: 'job'
    });

    JobLocation.belongsTo(models.CompanyLocation, {
      foreignKey: 'company_location_id',
      as: 'companyLocation'
    });
  };

  return JobLocation;
};