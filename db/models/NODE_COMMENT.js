/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('../database')
const Sequelize = require('sequelize')

const NODE_COMMENT = database.define('NODE_COMMENT', {
    comment_id: { type: 'INTEGER', primaryKey: true, autoIncrement: true, },
    node_id: { type: Sequelize.STRING(20), allowNull: false },
    time: { type: Sequelize.BIGINT(20), allowNull: false },
    user_id: { type: 'INTEGER', allowNull: false },
    content: { type: 'LONGTEXT', allowNull: false },
})
module.exports = NODE_COMMENT