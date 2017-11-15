/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('../database')
const Sequelize = require('sequelize')
const TASK = database.define('TASK', {
    task_id: { type: 'INTEGER', primaryKey: true,autoIncrement: true, },
    status: {type: Sequelize.STRING(45),allowNull:false},
    createTime: {type: Sequelize.BIGINT(20),allowNull:false},
    updateTime:{type:Sequelize.BIGINT(20),allowNull:false},
    name:{type:Sequelize.STRING(45),allowNull:false},
    interval:{type:Sequelize.BIGINT(20),allowNull:false}
})
TASK.status={
    INIT:'init',
    START:'start',
    STOP : 'stop',
    ERROR: 'error'
}
module.exports = TASK