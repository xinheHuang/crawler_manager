/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('../database')
const Sequelize = require('sequelize')
const ARTICLE_RECOMMEND = database.define('ARTICLE_RECOMMEND', {
    recommend_id: { type: 'INTEGER', primaryKey: true },
    article_id: { type: 'INTEGER', allowNull: false },
    stock_id: { type: 'INTEGER', allowNull: false },
    time: { type: Sequelize.BIGINT(20), allowNull: false },
})
module.exports = ARTICLE_RECOMMEND