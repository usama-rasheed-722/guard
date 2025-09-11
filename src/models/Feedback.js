const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define('Feedback', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    from_user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    to_user_id: {
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
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    feedback_type: {
      type: DataTypes.ENUM('guard_to_company', 'company_to_guard'),
      allowNull: false
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'feedback',
    indexes: [
      {
        fields: ['from_user_id']
      },
      {
        fields: ['to_user_id']
      },
      {
        fields: ['job_id']
      },
      {
        fields: ['shift_id']
      },
      {
        fields: ['rating']
      },
      {
        fields: ['feedback_type']
      },
      {
        unique: true,
        fields: ['from_user_id', 'to_user_id', 'job_id'],
        where: {
          job_id: {
            [sequelize.Sequelize.Op.ne]: null
          }
        }
      },
      {
        unique: true,
        fields: ['from_user_id', 'to_user_id', 'shift_id'],
        where: {
          shift_id: {
            [sequelize.Sequelize.Op.ne]: null
          }
        }
      }
    ]
  });

  Feedback.associate = (models) => {
    Feedback.belongsTo(models.User, {
      foreignKey: 'from_user_id',
      as: 'fromUser'
    });

    Feedback.belongsTo(models.User, {
      foreignKey: 'to_user_id',
      as: 'toUser'
    });

    Feedback.belongsTo(models.Job, {
      foreignKey: 'job_id',
      as: 'job'
    });

    Feedback.belongsTo(models.Shift, {
      foreignKey: 'shift_id',
      as: 'shift'
    });
  };

  return Feedback;
};