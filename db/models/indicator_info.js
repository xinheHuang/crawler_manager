/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('../database')
const Sequelize = require('sequelize')
const IndicatorInfo = database.define('indicator_info', {
    ID: { type: 'INTEGER', primaryKey: true },
    ID_tong: { type:  Sequelize.STRING(25), allowNull: false },
    name: { type: 'TEXT', allowNull: false },
    frequency: { type: 'TEXT', allowNull: false },
    unit: { type: 'TEXT', allowNull: false },
    source: { type: 'TEXT', allowNull: false },
    path: { type: 'TEXT', allowNull: false },
    type: { type: 'TEXT', allowNull: false },
    region: { type: 'TEXT', allowNull: false },
    country: { type: 'TEXT', allowNull: false },
    currency: { type: 'TEXT', allowNull: false },
    memo: { type: 'TEXT', allowNull: false },
})
module.exports = IndicatorInfo