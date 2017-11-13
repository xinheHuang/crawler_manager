/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('../database')
const Sequelize = require('sequelize')
const INDUSTRY = database.define('INDUSTRY', {
    industry_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, },
    name: { type: Sequelize.STRING(45), },
    tier: { type: Sequelize.INTEGER, },
    parent_industry_id: { type: Sequelize.INTEGER, allowNull: false },
})
module.exports = INDUSTRY