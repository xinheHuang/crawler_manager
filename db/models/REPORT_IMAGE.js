/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('../database')
const Sequelize = require('sequelize')

const REPORT_IMAGE = database.define('REPORT_IMAGE', {
    report_image_id: { type: 'INTEGER', primaryKey: true},
    report_id:{type:'INTEGER',allowNull:false},
    fileID: { type: 'TEXT', allowNull: false },
    sequence:{type:'INTEGER',allowNull:false},
    title: { type: 'TEXT', allowNull: false },
    source: { type: 'TEXT', allowNull: false },
    user_id:{type:'INTEGER',allowNull:false},
    time: { type: Sequelize.BIGINT(20), allowNull: false },
    is_checked:{type:'INTEGER',allowNull:false},
    is_useless:{type:'INTEGER',allowNull:false},
    comment: { type: 'TEXT', allowNull: false },
})
module.exports = REPORT_IMAGE