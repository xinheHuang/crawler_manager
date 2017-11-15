/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('../database')
const Sequelize = require('sequelize')
const SUBTASK = database.define('SUBTASK', {
    subtask_id: { type: 'INTEGER', primaryKey: true,autoIncrement: true, },
    task_id: { type: 'INTEGER', allowNull:false, },
    server_id: { type: 'INTEGER', allowNull: false },
    script_id: { type: 'INTEGER', allowNull: false },
    status: {type: Sequelize.STRING(45),allowNull:false},
    createTime: {type: Sequelize.BIGINT(20),allowNull:false},
    updateTime:{type:Sequelize.BIGINT(20),allowNull:false},
    arguments:{type:Sequelize.STRING(200),allowNull:false},
    name: {type: Sequelize.STRING(45),allowNull:false},
    order: { type: 'INTEGER', allowNull: false },
})
SUBTASK.status={
    INIT:'init',
    START:'start',
    STOP : 'stop',
    ERROR: 'error'
}
module.exports = SUBTASK