/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('../database')
const Sequelize = require('sequelize')
const SERVER = database.define('SERVER', {
    server_id: { type: 'INTEGER', primaryKey: true,autoIncrement: true, },
    ip: { type: Sequelize.STRING(45), allowNull: false },
    port: { type: 'INTEGER', allowNull: false },
    type: {type: Sequelize.STRING(45)},
    name: {type: Sequelize.STRING(45)},
    status: {type: Sequelize.STRING(45),allowNull:false},
    updateTime:{type:Sequelize.BIGINT(20),allowNull:false},
})
module.exports = SERVER