/**
 * Created by Xinhe on 2017-09-20.
 * 数据库实例初始化
 */
const config = require('../conf/dbConfig_prod')
const Sequelize = require('sequelize')
const {  username, password, host, port } = config
<<<<<<< HEAD
const sequelize = new Sequelize('IFC', username, password, {
=======
const sequelize = new Sequelize('crawler', username, password, {
>>>>>>> d99b2abd2c427c181b4c12b60550daea4be1d63a
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