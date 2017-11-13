/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('../database')
const Sequelize = require('sequelize')
const STOCK = database.define('STOCK', {
    stock_id: { type: 'INTEGER', primaryKey: true,autoIncrement: true, },
    code: { type: Sequelize.STRING(45), allowNull: false },
    name: { type: Sequelize.STRING(45), allowNull: false },
    industry_id: { type: 'INTEGER', allowNull: false },
    start_time: {type:Sequelize.BIGINT(20),allowNull:false}
})
module.exports = STOCK