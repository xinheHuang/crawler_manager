/**
 * Created by Xinhe on 2017-09-20.
 */
const { INDUSTRY , NEWS} = require('../../../db')
const ApiError = require('../../../error/ApiError')
const ApiErrorNames = require('../../../error/ApiErrorNames')

class NewsService {
    static async getNewsByIndustryId(id,pageNumber,pageSize,key) {
        const query = {
            attributes: { exclude: ['content'] },
            order: [
                ['time', 'DESC'],
            ],
            offset: (pageNumber - 1) * pageSize,
            limit: +pageSize,
        }

        if (key){
            query.where={
                $or: [
                    {
                        abstract: {
                            '$like': `%${key}%`
                        }
                    },
                    {
                        title: {
                            '$like': `%${key}%`
                        }
                    }
                ]
            }
        }
        if (id == 0) {
            return await NEWS.findAll(query)
        }

        const industry = await INDUSTRY.findById(id)
        if (!industry) {
            throw new ApiError(ApiErrorNames.NOT_FOUND)
        }
        return await industry.getNEWS(query)
    }

    static async getNewsTotalPageCountByIndustryId(id,pageSize,key){
        const query={}
        if (key){
            query.where={
                $or: [
                    {
                        abstract: {
                            '$like': `%${key}%`
                        }
                    },
                    {
                        title: {
                            '$like': `%${key}%`
                        }
                    }
                ]
            }
        }
        if (id == 0) {
            const count = await NEWS.count(query)
            return Math.ceil(count / pageSize)
        }
        const industry = await INDUSTRY.findById(id)
        if (!industry) {
            throw new ApiError(ApiErrorNames.NOT_FOUND)
        }
        const count = await industry.countNEWS(query)
        return  Math.ceil(count / pageSize)
    }
}

module.exports = NewsService
