/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('../database')
const Sequelize = require('sequelize')

const GRAPH_NODE_INDICATOR = database.define('GRAPH_NODE_INDICATOR', {
    id: { type: 'INTEGER', primaryKey: true,autoIncrement: true, },
    indicator_id: { type: 'INTEGER', allowNull: false },
    graph_node_relation_id: { type: 'INTEGER', allowNull: false },
    warn_type: { type: 'INTEGER', allowNull: false,default:0 },
    upper_limit: { type: 'FLOAT', allowNull: false,default:0 },
    lower_limit: { type: 'FLOAT', allowNull: false,default:0},
})
module.exports = GRAPH_NODE_INDICATOR