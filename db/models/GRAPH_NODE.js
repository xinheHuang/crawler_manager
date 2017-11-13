/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('../database')
const Sequelize = require('sequelize')

const GRAPH_NODE = database.define('GRAPH_NODE', {
    node_id: {
        type: Sequelize.STRING(20),
        primaryKey: true,
    },
    title: {
        type: 'TEXT',
        allowNull: false
    },
})
module.exports = GRAPH_NODE