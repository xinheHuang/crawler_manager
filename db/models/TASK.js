/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('../database')
const Sequelize = require('sequelize')
const TASK = database.define('TASK', {
    task_id: { type: 'INTEGER', primaryKey: true,autoIncrement: true, },
    server_id: { type: 'INTEGER', allowNull: false },
    script_id: { type: 'INTEGER', allowNull: false },
    status: {type: Sequelize.STRING(45),allowNull:false},
    createTime: {type: Sequelize.STRING(45),allowNull:false},
    updateTime:{type:Sequelize.BIGINT(20),allowNull:false},
    arguments:{type:Sequelize.STRING(200),allowNull:false}
})
TASK.status={
    INIT:'init',
    START:'start',
    RUNNING: 'running',
    STOP : 'stop',
    FINISH: 'finish',
    ERROR: 'error'
}
module.exports = TASK