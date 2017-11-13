/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('../database')
const Sequelize = require('sequelize')
const CALENDAR_STATISTIC = database.define('CALENDAR_STATISTIC', {
    calendar_statistic_id: { type: 'INTEGER', primaryKey: true },
    indicator_id: { type: 'INTEGER', allowNull: false },
    time: { type: Sequelize.BIGINT(20), allowNull: false },
    country: { type: 'TEXT', allowNull: false },
    previous: { type: 'FLOAT', allowNull: false },
    estimate: { type: 'FLOAT', allowNull: false },
    announce: { type: 'FLOAT', allowNull: false },
    institution: { type: 'TEXT', allowNull: false },
    unit: { type: 'TEXT', allowNull: false },
})
module.exports = CALENDAR_STATISTIC