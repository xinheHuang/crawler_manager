/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('../database')

const NEWS_INDUSTRY_RELATION = database.define('NEWS_INDUSTRY_RELATION', {
    news_id: { type: 'INTEGER',primaryKey: true, },
    industry_id: { type: 'INTEGER', primaryKey: true, },
})
module.exports = NEWS_INDUSTRY_RELATION