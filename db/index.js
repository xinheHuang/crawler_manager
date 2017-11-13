/**
 * Created by Xinhe on 2017-11-08.
 */
const INDUSTRY = require('./models/INDUSTRY')
const USER = require('./models/USER')
const IndicatorInfo = require('./models/indicator_info')
const IndicatorValue = require('./models/indicator_value')
const IndicatorComment = require('./models/indicator_comment')
const STOCK = require('./models/STOCK')
const ANALYST = require('./models/ANALYST')
const USER_INTEREST_INDUSTRY = require('./models/USER_INTEREST_INDUSTRY')
const USER_INTEREST_STOCK = require('./models/USER_INTEREST_STOCK')
const NEWS = require('./models/NEWS')
const NEWS_INDUSTRY_RELATION = require('./models/NEWS_INDUSTRY_RELATION')
const ARTICLE = require('./models/ARTICLE')
const ARTICLE_RECOMMEND = require('./models/ARTICLE_RECOMMEND')
const ARTICLE_CONCLUSION = require('./models/ARTICLE_CONCLUSION')

const CALENDAR_STATISTIC = require('./models/CALENDAR_STATISTIC')
const CALENDAR_SCHEDULE = require ('./models/CALENDAR_SCHEDULE')

const GRAPH = require('./models/GRAPH')
const GRAPH_NODE = require('./models/GRAPH_NODE')
const GRAPH_NODE_RELATION = require('./models/GRAPH_NODE_RELATION')
const GRAPH_NODE_INDICATOR = require('./models/GRAPH_NODE_INDICATOR')
const NODE_COMMENT = require('./models/NODE_COMMENT')
const REPORT = require('./models/REPORT')
const REPORT_IMAGE = require('./models/REPORT_IMAGE')
const SEARCH_LIST = require('./models/SEARCH_LIST')

//indicator - indicator comment
IndicatorInfo.hasMany(IndicatorComment, {
    foreignKey: 'ID_tong',
    sourceKey: 'ID_tong'
})
IndicatorComment.belongsTo(IndicatorInfo, {
    foreignKey: 'ID_tong',
    targetKey: 'ID_tong',
})

//indicator - indicator value
IndicatorInfo.hasMany(IndicatorValue, {
    foreignKey: 'ID_tong',
    sourceKey: 'ID_tong'
})
IndicatorValue.belongsTo(IndicatorInfo, {
    foreignKey: 'ID_tong',
    targetKey: 'ID_tong',
})

//stock - industry
INDUSTRY.hasMany(STOCK, { foreignKey: 'industry_id' })
STOCK.belongsTo(INDUSTRY, { foreignKey: 'industry_id' })

//analyst industry
INDUSTRY.hasMany(ANALYST, { foreignKey: 'industry_id' })
ANALYST.belongsTo(INDUSTRY, { foreignKey: 'industry_id' })

//user interest industry
USER.belongsToMany(INDUSTRY, {
    foreignKey: 'user_id',
    otherKey: 'industry_id',
    through: USER_INTEREST_INDUSTRY,

})

INDUSTRY.belongsToMany(USER, {
    through: USER_INTEREST_INDUSTRY,
    foreignKey: 'industry_id',
    otherKey: 'user_id'
})

// USER_INTEREST_INDUSTRY.belongsTo(INDUSTRY,{
//     foreignKey: 'industry_id'
// })
//
// INDUSTRY.hasMany(USER_INTEREST_INDUSTRY, { foreignKey: 'industry_id' })

//user interest stock
USER.belongsToMany(STOCK, {
    foreignKey: 'user_id',
    otherKey: 'stock_id',
    through: USER_INTEREST_STOCK,

})

STOCK.belongsToMany(USER, {
    through: USER_INTEREST_STOCK,
    foreignKey: 'stock_id',
    otherKey: 'user_id'
})

// USER_INTEREST_STOCK.belongsTo(STOCK,{
//     foreignKey: 'stock_id'
// })
//
// STOCK.hasMany(USER_INTEREST_STOCK, { foreignKey: 'stock_id' })

//news industry relation
NEWS.belongsToMany(INDUSTRY, {
    foreignKey: 'news_id',
    otherKey: 'industry_id',
    through: NEWS_INDUSTRY_RELATION,

})

INDUSTRY.belongsToMany(NEWS, {
    through: NEWS_INDUSTRY_RELATION,
    foreignKey: 'industry_id',
    otherKey: 'news_id'
})

//article - industry
INDUSTRY.hasMany(ARTICLE, { foreignKey: 'industry_id' })
ARTICLE.belongsTo(INDUSTRY, { foreignKey: 'industry_id' })

//article - stock
STOCK.hasMany(ARTICLE, { foreignKey: 'stock_id' })
ARTICLE.belongsTo(STOCK, { foreignKey: 'stock_id' })

//article recommend - article
ARTICLE.hasMany(ARTICLE_RECOMMEND, { foreignKey: 'article_id' })
ARTICLE_RECOMMEND.belongsTo(ARTICLE, { foreignKey: 'article_id' })

//article recommend - stock
STOCK.hasMany(ARTICLE_RECOMMEND, { foreignKey: 'stock_id' })
ARTICLE_RECOMMEND.belongsTo(STOCK, { foreignKey: 'stock_id' })


//article conclusion - article
ARTICLE.hasMany(ARTICLE_CONCLUSION, { foreignKey: 'article_id' })
ARTICLE_CONCLUSION.belongsTo(ARTICLE, { foreignKey: 'article_id' })

//CALENDAR_STATISTIC - indicator
IndicatorInfo.hasMany(CALENDAR_STATISTIC, { foreignKey: 'indicator_id' })
CALENDAR_STATISTIC.belongsTo(IndicatorInfo, { foreignKey: 'indicator_id' })

//graph - user
USER.hasMany(GRAPH, { foreignKey: 'user_id' })
GRAPH.belongsTo(USER, { foreignKey: 'user_id' })

//graph_node_relation - node
GRAPH_NODE.hasMany(GRAPH_NODE_RELATION, { foreignKey: 'node_id' })
GRAPH_NODE_RELATION.belongsTo(GRAPH_NODE, { foreignKey: 'node_id' })

//graph_node_relation - graph
GRAPH.hasMany(GRAPH_NODE_RELATION, { foreignKey: 'graph_id' })
GRAPH_NODE_RELATION.belongsTo(GRAPH, { foreignKey: 'graph_id' })

//graph - node
GRAPH.belongsToMany(GRAPH_NODE, {
    foreignKey: 'graph_id',
    through: GRAPH_NODE_RELATION,

})

GRAPH_NODE.belongsToMany(GRAPH, {
    through: GRAPH_NODE_RELATION,
    foreignKey: 'node_id'
})

//node_indicator - graph_node_relation
GRAPH_NODE_RELATION.hasMany(GRAPH_NODE_INDICATOR, { foreignKey: 'graph_node_relation_id' })
GRAPH_NODE_INDICATOR.belongsTo(GRAPH_NODE_RELATION, { foreignKey: 'graph_node_relation_id' })

//node_indicator - IndicatorInfo
IndicatorInfo.hasMany(GRAPH_NODE_INDICATOR, { foreignKey: 'indicator_id' })
GRAPH_NODE_INDICATOR.belongsTo(IndicatorInfo, { foreignKey: 'indicator_id' })

//graph_node_relation - IndicatorInfo
GRAPH_NODE_RELATION.belongsToMany(IndicatorInfo, {
    foreignKey: 'graph_node_relation_id',
    through: GRAPH_NODE_INDICATOR,

})

IndicatorInfo.belongsToMany(GRAPH_NODE_RELATION, {
    through: GRAPH_NODE_INDICATOR,
    foreignKey: 'indicator_id'
})

//node_comment - user
USER.hasMany(NODE_COMMENT, { foreignKey: 'user_id' })
NODE_COMMENT.belongsTo(USER, { foreignKey: 'user_id' })

//node_comment - node
GRAPH_NODE.hasMany(NODE_COMMENT, { foreignKey: 'node_id' })
NODE_COMMENT.belongsTo(GRAPH_NODE, { foreignKey: 'node_id' })

//report image - report
REPORT.hasMany(REPORT_IMAGE, { foreignKey: 'report_id' })
REPORT_IMAGE.belongsTo(REPORT, { foreignKey: 'report_id' })

//search list
SEARCH_LIST.belongsTo(NEWS, {
    foreignKey: 'news_id'
})
SEARCH_LIST.belongsTo(IndicatorComment, {
    foreignKey: 'indicator_comment_id',
})
SEARCH_LIST.belongsTo(REPORT_IMAGE, {
    foreignKey: 'report_image_id',
})
SEARCH_LIST.belongsTo(GRAPH, {
    foreignKey: 'graph_id',
})

module.exports = {
    USER,
    INDUSTRY,
    NEWS,
    USER_INTEREST_INDUSTRY,
    STOCK,
    CALENDAR_STATISTIC,
    CALENDAR_SCHEDULE,
    SEARCH_LIST,
    GRAPH,
    GRAPH_NODE,
    GRAPH_NODE_RELATION,
    GRAPH_NODE_INDICATOR,
    NODE_COMMENT,
    IndicatorComment,
    IndicatorInfo,
    IndicatorValue,
    REPORT_IMAGE,
    REPORT,
    ANALYST,
    ARTICLE,
    ARTICLE_CONCLUSION,
    ARTICLE_RECOMMEND,
}
