/**
 * Created by Xinhe on 2017-09-20.
 */
const IndustryService = require('../../service/industry')
const NewsService = require('../../service/news')
const AnalystService = require('../../service/analyst')
const ArticleService = require('../../service/article')
module.exports = Object.values(
    {
        getIndustries: {
            url: '/industries',
            method: 'get',
            async handler(ctx) {
                ctx.body = await IndustryService.getAllIndustries()
            }
        },

        getIndustriesById: {
            url: '/industries/:id',
            method: 'get',
            async handler(ctx) {
                const { id } = ctx.params
                ctx.body = await IndustryService.getSubIndustryById(id)
            }
        },

        getNewsByIndustry: {
            url: '/industry/:id/news',
            method: 'get',
            async handler(ctx) {
                const { id } = ctx.params
                const { pageNumber, pageSize, key } = ctx.request.query
                ctx.body = {
                    news: await NewsService.getNewsByIndustryId(id, pageNumber, pageSize, key)
                }
            }
        },

        getNewsPageCountByIndustry: {
            method: 'get',
            url: '/industry/:id/pageCount',
            async handler(ctx) {
                const { id } = ctx.params
                const { pageSize, key } = ctx.request.query
                ctx.body = {
                    pageCount: await NewsService.getNewsTotalPageCountByIndustryId(id, pageSize, key)
                }

            }
        },

        searchInterestsAndStocksByKeyWord: {
            method: 'get',
            url: '/interests/',
            async handler(ctx) {
                const { key } = ctx.request.query
                ctx.body = await IndustryService.searchInterestsAndStocksByKeyWord(key)
            }
        },

        searchByKey: {  //搜索所有推送内容
            method: 'get',
            url: '/search',
            async handler(ctx) {
                const { pageNumber, pageSize, key } = ctx.request.query
                ctx.body = await   IndustryService.searchByKey(key, pageNumber, pageSize)
            }
        },

        getAnalystByIndustry: { //获取analyst
            method: 'get',
            url: '/industry/:id/analyst',
            async handler(ctx) {
                const { id } = ctx.params
                ctx.body = await AnalystService.getAnalystByIndustryId(id)
            }
        },

        getNewestHotSpotConclusion: { //获取最新的热点结论
            method: 'get',
            url: '/conclusions/hotspot',
            async handler(ctx) {
                ctx.body = await ArticleService.getNewestHotspotConclusions()
            }
        },

        getNewestKeyConclusion: { //获取最新的核心结论
            method: 'get',
            url: '/conclusions/key',
            async handler(ctx) {
                ctx.body = await ArticleService.getNewestKeyConclusions()
            }
        },


        getArticlesInLast7Days: { //获取最近七天的文章
            method: 'get',
            url: '/articles',
            async handler(ctx,) {
                const last7Day = new Date()
                last7Day.setDate(new Date().getDate() - 7) //七天之内
                // todo
                ctx.body = await ArticleService.getArticlesAfterTime(last7Day.getTime())
                //  ctx.body = await ArticleService.getArticlesAfterTime(0)
            }
        },
        getArticleById: { //获取文章
            method: 'get',
            url: '/article/:id',
            async handler(ctx,) {
                const { id } = ctx.params
                ctx.body = ArticleService.getArticleById(id)
            }
        },
        getArticleRecommendsByIndustry:{  //获取行业下的文章
            method: 'get',
            url: '/industry/:id/articles',
            async handler(ctx, ) {
                const {id} = ctx.params
                ctx.body = await ArticleService.getArticleRecommendsByIndustryId(id);
            }
        },

        getStockArticles:{
            method: 'get',
            url: '/stock/articles',
            async handler(ctx, ) {
                ctx.body = await ArticleService.getStockArticles()
            }
        },

        getStockArticleReadNumbers:{
            method: 'get',
            url: '/stock/articles/readNumbers',
            async handler(ctx, ) {
                const last7Day = new Date()
                last7Day.setDate(new Date().getDate() - 7) //七天之内
                // ctx.body = await ArticleService.getArticleReadNumbersByStock(last7Day.getTime())
                ctx.body = await ArticleService.getArticleReadNumbersByStock(0)
            }
        }

    })
