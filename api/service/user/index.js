/**
 * Created by Xinhe on 2017-09-20.
 */
const { USER } = require('../../../db')
const ApiError = require('../../../error/ApiError')
const ApiErrorNames = require('../../../error/ApiErrorNames')
const crypto = require('../../../utils/cryptoUtil')
const Converter = require ('../../converter')

class UserService {
    static async getUserInstance(userId) {
        if (!UserService.user) {
            UserService.user = await USER.findById(userId)
        }
        return UserService.user
    }

    static async checkUserNamePassword(username, password) {
        const user = await USER.findOne({
            where: {
                username,
            }
        })
        if (!user) {
            throw new ApiError(ApiErrorNames.USER_NOT_EXIST)
        }
        if (user.password != crypto.getSha1(password)) {
            throw new ApiError(ApiErrorNames.USER_PASSWORD_WRONG)
        }
        user.update({
            last_login_time: new Date().getTime()
        })
        return user.user_id
    }

    static async createUser(username, password, position, name, broker) {
        const time = new Date()
        let [user, created] = await USER.findOrCreate({
            where: {
                username
            },
            defaults: {
                //todo need fix
                mobile: username,
                position,
                name,
                broker,
                password: crypto.getSha1(password),
                register_time: time.getTime(),
                last_login_time: time.getTime()
            }
        })
        if (!created) {
            throw new ApiError(ApiErrorNames.USERNAME_EXIST)
        }
        if (!user.userId) {
            user = await USER.findOne({
                where: {
                    username,
                }
            })
        }
        return user.user_id
    }

    static async getUserInfo(userId) {
        const user = await UserService.getUserInstance(userId)
        return Converter.UserConverter(user)
    }

    static async modifyUserInfo(userId, userInfo) {
        await USER.update(userInfo, {
            where: {
                user_id: userId
            }
        })
        UserService.user=null;
    }

    static async getIndustryInterests(userId) {
        const user = await UserService.getUserInstance(userId)
        return await user.getINDUSTRies()
    }

    static async addIndustryInterests(userId, industryId) {
        const user = await UserService.getUserInstance(userId)
        return await user.addINDUSTRY(industryId, { through: { interest_time: new Date().getTime() } })
    }

    static async removeIndustryInterests(userId, industryId) {
        const user = await UserService.getUserInstance(userId)
        return await user.removeINDUSTRY(industryId)
    }

    static async getStockInterests(userId) {
        const user = await UserService.getUserInstance(userId)
        return await user.getSTOCKs()
    }

    static async addStockInterests(userId, stockId) {
        const user = await UserService.getUserInstance(userId)
        return await user.addSTOCK(stockId, { through: { interest_time: new Date().getTime() } })
    }

    static async removeStockInterests(userId, stockId) {
        const user = await UserService.getUserInstance(userId)
        return await user.removeSTOCK(stockId)
    }



}

UserService.user = null

module.exports = UserService
