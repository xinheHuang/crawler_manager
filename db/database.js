/**
 * Created by Xinhe on 2017-09-20.
 * 数据库实例初始化
 */
const config = require('../conf/dbConfig_prod')
const Sequelize = require('sequelize')
const {  username, password, host, port } = config
const sequelize = new Sequelize('crawler', username, password, {
    host,
    port,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    },
    define: {
        timestamps: false,
        freezeTableName: true,
    }
})

module.exports = sequelize