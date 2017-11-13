/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('../database')
const Sequelize = require('sequelize')
const IndicatorValue = database.define('indicator_value', {
    ID: { type: 'INTEGER', primaryKey: true },
    ID_tong: { type: Sequelize.STRING(25), allowNull: false },
    time: { type: Sequelize.BIGINT(20), allowNull: false },
    value: { type: 'FLOAT', allowNull: false },
})
module.exports = IndicatorValue