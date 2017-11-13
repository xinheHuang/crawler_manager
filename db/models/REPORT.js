/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('../database')
const Sequelize = require('sequelize')

const REPORT = database.define('REPORT', {
    report_id: { type: 'INTEGER', primaryKey: true,autoIncrement:true},
    fileID: { type: 'TEXT', allowNull: false },
    time: { type: Sequelize.BIGINT(20), allowNull: false },
    title: { type: 'TEXT', allowNull: false },
    broker: { type: 'TEXT', allowNull: false },
    analyst_id: { type: 'INTEGER', allowNull: false },
    category: { type: 'TEXT', allowNull: false },
    industry_id: { type: 'INTEGER', allowNull: false },
    equity: { type: 'TEXT', allowNull: false },
    is_imaged:{type:'INTEGER',allowNull:false},
    user_id:{type:'INTEGER',allowNull:false},
    fileType: { type: 'TEXT', allowNull: false },
    page:{type:'INTEGER',allowNull:false},
})
module.exports = REPORT