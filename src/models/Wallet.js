const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Wallet = sequelize.define('Wallet', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    balance: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    last_updated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'wallets',
    indexes: [
      {
        unique: true,
        fields: ['user_id']
      },
      {
        fields: ['is_active']
      }
    ]
  });

  Wallet.associate = (models) => {
    Wallet.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    Wallet.hasMany(models.Transaction, {
      foreignKey: 'wallet_id',
      as: 'transactions'
    });
  };

  return Wallet;
};