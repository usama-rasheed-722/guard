const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Application = sequelize.define('Application', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    guard_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    job_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'jobs',
        key: 'id'
      }
    },
    shift_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'shifts',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('applied', 'accepted', 'rejected', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'applied'
    },
    bid_rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    cover_letter: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    applied_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    responded_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'applications',
    indexes: [
      {
        fields: ['guard_id']
      },
      {
        fields: ['job_id']
      },
      {
        fields: ['shift_id']
      },
      {
        fields: ['status']
      },
      {
        unique: true,
        fields: ['guard_id', 'job_id'],
        where: {
          job_id: {
            [sequelize.Sequelize.Op.ne]: null
          }
        }
      },
      {
        unique: true,
        fields: ['guard_id', 'shift_id'],
        where: {
          shift_id: {
            [sequelize.Sequelize.Op.ne]: null
          }
        }
      }
    ]
  });

  Application.associate = (models) => {
    Application.belongsTo(models.User, {
      foreignKey: 'guard_id',
      as: 'guard'
    });

    Application.belongsTo(models.Job, {
      foreignKey: 'job_id',
      as: 'job'
    });

    Application.belongsTo(models.Shift, {
      foreignKey: 'shift_id',
      as: 'shift'
    });
  };

  return Application;
};