const sequelize = require('../database')
const {DataTypes, UUIDV4} = require('sequelize')

const User = sequelize.define('users',{
  id_user: {type: DataTypes.UUID, primaryKey: true, defualtValue: UUIDV4},
  login: {type: DataTypes.STRING},
  password: {type: DataTypes.STRING, allowNull:true},
  role: {type: DataTypes.STRING, defaultValue: "user"},
})

module.exports={
  User
}