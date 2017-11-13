/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('../database')
const Sequelize = require('sequelize')
const IndicatorComment = database.define('indicator_comment', {
    ID: { type: 'INTEGER', primaryKey: true },
    ID_tong: { type: Sequelize.STRING(25), allowNull: false },
    time: { type: Sequelize.BIGINT(20), allowNull: false },
    comment: { type: 'TEXT', allowNull: false },
})
module.exports = IndicatorComment