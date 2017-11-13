/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('../database')
const Sequelize = require('sequelize')
const ARTICLE_CONCLUSION = database.define('ARTICLE_CONCLUSION', {
    conclusion_id: { type: 'INTEGER', primaryKey: true },
    time: { type:  Sequelize.BIGINT(20), allowNull: false },
    article_id: { type: 'INTEGER', allowNull: false },
    hotspot_conclusion: { type: 'TEXT', allowNull: false },
    key_conclusion: { type: 'TEXT', allowNull: false },
})
module.exports = ARTICLE_CONCLUSION