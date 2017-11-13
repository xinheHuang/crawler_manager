/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('../database')
const Sequelize = require('sequelize')

const USER = database.define('USER', {
    user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: Sequelize.STRING(45),
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING(45),
        allowNull: false
    },
    email: {
        type: Sequelize.STRING(45)
    },
    mobile: {
        type: Sequelize.STRING(45),
        allowNull: false
    },
    broker: {
        type: Sequelize.STRING(45),
    },
    position: {
        type: Sequelize.STRING(45),
    },
    last_login_time: {
        type: Sequelize.BIGINT(20),
        allowNull: false
    },
    register_time: {
        type: Sequelize.BIGINT(20),
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING(45),
    },
})
module.exports = USER