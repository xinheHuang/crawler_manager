/**
 * Created by Xinhe on 2017-09-20.
 */
const CalendarService = require('../../service/calendar')

module.exports = Object.values(
    {
        getAllStatisticCalendar: { //获取所有statistic calendar()
            method: 'get',
            url: '/calendar/statistic',
            async handler(ctx) {
                ctx.body = await CalendarService.getAllStatisticCalendar()
            }
        },
        getAllScheduleCalendarByTime: { //获取所有schedule calendar
            method: 'get',
            url: '/calendar/schedule',
            async handler(ctx) {
                const { time } = ctx.request.query
                ctx.body= await CalendarService.getAllScheduleCalendarByTime(+time)
            }
        },
    })
