/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('../database')
const Sequelize = require('sequelize')
const SCRIPT = database.define('SCRIPT', {
    script_id: { type: 'INTEGER', primaryKey: true,autoIncrement: true, },
    fileName: { type: Sequelize.STRING(45), allowNull: false },
    name: {type: Sequelize.STRING(45)},
})
module.exports = SCRIPT