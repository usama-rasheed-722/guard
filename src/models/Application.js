const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Application = sequelize.define('Application', {
 
     
  }, {
    tableName: 'applications',
    indexes: [
       
    ]
  });
 
 

  return Application;
};