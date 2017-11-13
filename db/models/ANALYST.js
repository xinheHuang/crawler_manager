/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('../database')
const Sequelize = require('sequelize')
const ANALYST = database.define('ANALYST', {
    analyst_id: { type: 'INTEGER', primaryKey: true,autoIncrement: true, },
    mobile: { type: Sequelize.STRING(45), allowNull: false },
    name: { type: Sequelize.STRING(45), allowNull: false },
    industry_id: { type: 'INTEGER', allowNull: false },
    leader: {type: 'INTEGER',allowNull:false},
    time: {type:Sequelize.BIGINT(20),allowNull:false}
})
module.exports = ANALYST