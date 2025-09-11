const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    from_user_id: {
      type: DataTypes.UUID,
      allowNull: true,
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
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('deposit', 'escrow', 'release', 'withdrawal', 'refund', 'fee'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'success', 'failed', 'hold', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reference_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    escrow_release_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    processed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    failure_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'transactions',
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
        fields: ['type']
      },
      {
        fields: ['status']
      },
      {
        fields: ['created_at']
      }
    ]
  });

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.User, {
      foreignKey: 'from_user_id',
      as: 'fromUser'
    });

    Transaction.belongsTo(models.User, {
      foreignKey: 'to_user_id',
      as: 'toUser'
    });

    Transaction.belongsTo(models.Job, {
      foreignKey: 'job_id',
      as: 'job'
    });

    Transaction.belongsTo(models.Shift, {
      foreignKey: 'shift_id',
      as: 'shift'
    });
  };

  return Transaction;
};