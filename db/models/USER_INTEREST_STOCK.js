/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('../database')
const Sequelize = require('sequelize')
const USER_INTEREST_STOCK = database.define('USER_INTEREST_STOCK', {
    user_id: {
        type: 'INTEGER',
        primaryKey: true,
    },
    stock_id: {
        type: 'INTEGER',
        primaryKey: true,
    },
    interest_time:{
        type:Sequelize.BIGINT(20),
        allowNull:false,
    }
})
module.exports = USER_INTEREST_STOCK