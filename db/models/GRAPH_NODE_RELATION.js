/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('../database')
const Sequelize = require('sequelize')

const GRAPH_NODE_RELATION = database.define('GRAPH_NODE_RELATION', {
	id:{type:'INTEGER', primaryKey: true,autoIncrement: true,},
    node_id: { type: Sequelize.STRING(20) },
    graph_id: { type: 'INTEGER', allowNull: false },
    parent_node_id: { type: Sequelize.STRING(20), allowNull: false },
    direction: { type: 'TEXT', allowNull: false },
})
module.exports = GRAPH_NODE_RELATION