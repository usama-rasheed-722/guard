const sequelize = require('../../config/sequelize');
const { DataTypes } = require('sequelize');

// Import all models
const User = require('./User');
const CompanyProfile = require('./CompanyProfile');
const GuardProfile = require('./GuardProfile');
const Job = require('./Job');
const JobLocation = require('./JobLocation');
const Shift = require('./Shift');
const Application = require('./Application');
const Attendance = require('./Attendance');
const Wallet = require('./Wallet');
const Transaction = require('./Transaction');
const Feedback = require('./Feedback');
const CompanyLocation = require('./CompanyLocation');
const ShiftAssignment = require('./ShiftAssignment');

// Initialize models
const models = {
  User: User(sequelize, DataTypes),
  CompanyProfile: CompanyProfile(sequelize, DataTypes),
  GuardProfile: GuardProfile(sequelize, DataTypes),
  Job: Job(sequelize, DataTypes),
  JobLocation: JobLocation(sequelize, DataTypes),
  Shift: Shift(sequelize, DataTypes),
  ShiftAssignment: ShiftAssignment(sequelize, DataTypes),
  Application: Application(sequelize, DataTypes),
  Attendance: Attendance(sequelize, DataTypes),
  Wallet: Wallet(sequelize, DataTypes),
  Transaction: Transaction(sequelize, DataTypes),
  Feedback: Feedback(sequelize, DataTypes),
  CompanyLocation: CompanyLocation(sequelize, DataTypes)
};

// Define associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = require('sequelize');

module.exports = models;