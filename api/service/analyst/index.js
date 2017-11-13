/**
 * Created by Xinhe on 2017-09-20.
 */
const { ANALYST } = require('../../../db')
const ApiError = require('../../../error/ApiError')
const ApiErrorNames = require('../../../error/ApiErrorNames')

class AnalystService {
    static async getAnalystByIndustryId(id) {
        return await  ANALYST.findAll(
            {
                where: {
                    industry_id: id
                },
            })
    }

}

module.exports = AnalystService
