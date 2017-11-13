/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('../database')
const Sequelize = require('sequelize')
const CALENDAR_SCHEDULE = database.define('CALENDAR_SCHEDULE', {
    calendar_schedule_id: { type: 'INTEGER', primaryKey: true },
    title: { type: 'TEXT', allowNull: false },
    time: { type: Sequelize.BIGINT(20), allowNull: false },
    content: { type: 'TEXT', allowNull: false },
    type: { type: 'INTEGER', allowNull: false },
    dial: { type: 'TEXT', allowNull: false },
    password: { type: 'TEXT', allowNull: false },
    location: { type: 'TEXT', allowNull: false },
    guest: { type: 'TEXT', allowNull: false },
    contact: { type: 'TEXT', allowNull: false },
})
module.exports = CALENDAR_SCHEDULE