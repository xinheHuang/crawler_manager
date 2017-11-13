/**
 * Created by Xinhe on 2017-09-20.
 */
const { ARTICLE, ARTICLE_CONCLUSION, STOCK, ARTICLE_RECOMMEND } = require('../../../db')
const ApiError = require('../../../error/ApiError')
const ApiErrorNames = require('../../../error/ApiErrorNames')

const formatContent = (s) => s.split(new RegExp('[\r\n]'))
    .filter(d => d)

class ArticleService {

    static async getArticleById(articleId) {
        return await ARTICLE.findById(articleId)
    }

    static async getArticlesAfterTime(time) {
        return await ARTICLE.findAll({
            where: {
                time: {
                    $gt: time
                }
            },
            include: {
                model: STOCK
            }
        })
    }

    static async getArticleRecommendsByIndustryId(id) {
        return await ARTICLE.findAll({
            where: {
                industry_id: id
            },
            include: {
                model: ARTICLE_RECOMMEND,
                include: {
                    model: STOCK
                }
            },
            order: [
                ['time', 'DESC'],
            ]
        })
    }

    static async getStockArticles() {
        return await ARTICLE.findAll({
            include: {
                model: STOCK,
                required: true
            }
        })
    }

    static async getNewestKeyConclusions() {
        const conclusion = await ARTICLE_CONCLUSION.findOne({
            attributes: ['key_conclusion'],
            order: [
                ['time', 'DESC'],
            ]
        })
        return formatContent(conclusion.key_conclusion)
    }

    static async getNewestHotspotConclusions() {
        const conclusion = await ARTICLE_CONCLUSION.findOne({
            attributes: ['hotspot_conclusion'],
            order: [
                ['time', 'DESC'],
            ]
        })
        return formatContent(conclusion.hotspot_conclusion)
    }

    static async getArticleReadNumbersByStock(time) {
        return (await  ARTICLE.sum('num_read', {
            plain:false,
            where: {
                time: {
                    $gt: time
                },
            },
            include: {
                required:true,
                model: STOCK,
            },
            group: 'STOCK.stock_id'
        })).map((stock)=> ({
            sum: stock.sum,
            stockId:stock['STOCK.stock_id'],
            code:stock['STOCK.code'],
            name:stock['STOCK.name'],
            industryId:stock['STOCK.industry_id'],
            startTime:stock['STOCK.start_time'],
        }))
    }
}

module.exports = ArticleService
