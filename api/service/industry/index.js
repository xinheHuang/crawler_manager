/**
 * Created by Xinhe on 2017-09-20.
 */
const { INDUSTRY,STOCK,SEARCH_LIST,REPORT,REPORT_IMAGE,IndicatorInfo,IndicatorComment,IndicatorValue,NEWS,GRAPH_NODE,USER} = require('../../../db')

class IndustryService {
    static async getSubIndustryById(id) {
        return (await INDUSTRY.findAll({
            where: {
                parent_industry_id: id
            }
        })) || []
    }

    static async getAllIndustries() {
        const industries = (await INDUSTRY.findAll()) || []
        const find = (ID) => {
            return industries
                .filter((industry) => industry.parent_industry_id === ID)
                .map((industry) => ({
                    ...industry.get({'plain':true}),
                    subs: find(industry.industry_id)
                }))
        }
        return find(0)
    }

    static async searchInterestsAndStocksByKeyWord(key) {
        const stocksPromise = STOCK.findAll({
            where: {
                $or: [
                    {
                        code: {
                            '$like': `%${key}%`
                        }
                    },
                    {
                        name: {
                            '$like': `%${key}%`
                        }
                    }
                ]

            }
        })
        const industryPromise = INDUSTRY.findAll({
            where: {
                name: {
                    '$like': `%${key}%`
                }
            }
        })
        return await Promise.all([stocksPromise, industryPromise])
            .then(([stocks, industries]) => {
                return {
                    stocks,
                    industries
                }
            })
    }

    static async searchByKey(key, pageNumber, pageSize) {
        const query = {
            where: {
            },
            order: [
                ['time', 'DESC'],
                ['ID','DESC']
            ],
            offset: (pageNumber - 1) * pageSize,
            limit: +pageSize,
        }

        if (key) {
            query.where.keywords={
                '$like': `%${key}%`
            }
        }
        const res = await SEARCH_LIST.findAll(query)
        const details = res.map((item) => {
            if (item.graph_id) {
                item.type = 'graph'
                return item.getGRAPH({
                    include: [
                        {
                            model: GRAPH_NODE
                        },
                        {
                            model:USER
                        }
                    ]
                })
            }
            if (item.indicator_comment_id) {
                item.type = 'indicator'
                return item.getIndicator_comment({
                    include: [{
                        model: IndicatorInfo,
                        include: [
                            {
                                model: IndicatorValue
                            }
                        ]
                    }]
                })
            }
            if (item.news_id) {
                item.type = 'news'
                return item.getNEWS()
            }
            if (item.report_image_id) {
                item.type = 'report'
                return item.getREPORT_IMAGE({
                    include: [
                        {
                            model: REPORT
                        }
                    ]
                })
            }
        })
        return (await Promise.all(details)).map((data, index) => {
            const {ID, type, time} = res[index]
            return ({
                ID,
                type,
                time,
                data
            })
        })
    }
}

module.exports = IndustryService
