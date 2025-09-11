const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define('Job', {
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
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    hourly_rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    total_hours: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    required_guards: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    hired_guards: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('open', 'hiring', 'hired', 'in_progress', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'open'
    },
    requirements: {
      type: DataTypes.JSON,
      allowNull: true
    },
    special_instructions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    total_budget: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true
    }
  }, {
    tableName: 'jobs',
    indexes: [
      {
        fields: ['company_id']
      },
      {
        fields: ['date']
      },
      {
        fields: ['status']
      },
      {
        fields: ['hourly_rate']
      }
    ]
  });

  Job.associate = (models) => {
    Job.belongsTo(models.User, {
      foreignKey: 'company_id',
      as: 'company'
    });

    Job.hasMany(models.JobLocation, {
      foreignKey: 'job_id',
      as: 'locations'
    });

    Job.hasMany(models.Application, {
      foreignKey: 'job_id',
      as: 'applications'
    });

    Job.hasMany(models.Attendance, {
      foreignKey: 'job_id',
      as: 'attendance'
    });

    Job.hasMany(models.Transaction, {
      foreignKey: 'job_id',
      as: 'transactions'
    });
  };

  return Job;
};