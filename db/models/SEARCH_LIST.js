/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('../database')
const Sequelize = require('sequelize')

const SEARCH_LIST = database.define('SEARCH_LIST', {
    ID: { type: 'INTEGER', primaryKey: true, autoIncrement: true },
    time: { type:  Sequelize.BIGINT(20), allowNull: false },
    keywords: { type: 'TEXT'},
    news_id:{type:'INTEGER'},
    report_image_id:{type:'INTEGER'},
    indicator_comment_id:{type:'INTEGER'},
    graph_id:{type:'INTEGER'},
})
module.exports = SEARCH_LIST