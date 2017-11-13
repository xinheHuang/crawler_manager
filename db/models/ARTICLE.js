/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('../database')
const Sequelize = require('sequelize')
const ARTICLE = database.define('ARTICLE', {
    article_id: { type: 'INTEGER', primaryKey: true },
    title: { type: 'TEXT', allowNull: false },
    author: { type: 'TEXT', allowNull: false },
    content: { type: 'LONGTEXT', allowNull: false },
    num_read: { type: 'INTEGER', allowNull: false },
    num_like: { type: 'INTEGER', allowNull: false },
    time: { type: Sequelize.BIGINT(20), allowNull: false },
    industry_id: { type: 'INTEGER', allowNull: true },
    broker: { type: 'TEXT', allowNull: true },
    stock_id: { type: 'INTEGER', allowNull: true },
})
module.exports = ARTICLE