/**
 * Created by Xinhe on 2017-09-20.
 */
const { CALENDAR_SCHEDULE, CALENDAR_STATISTIC } = require('../../../db')
const ApiError = require('../../../error/ApiError')
const ApiErrorNames = require('../../../error/ApiErrorNames')

class CalendarService {
    static async getAllScheduleCalendarByTime(time) {
        if (!time) { //all calendar
            return await CALENDAR_SCHEDULE.findAll()
        }
        const today = new Date(time)
        const tomorrow = new Date(time)
        today.setHours(0, 0, 0, 0)
        tomorrow.setHours(24, 0, 0, 0)
        return await CALENDAR_SCHEDULE.findAll({
            where: {
                time: {
                    $gte: today.getTime(),
                    $lte: tomorrow.getTime()
                }
            }
        })
    }

    static async getAllStatisticCalendar() {
        return await CALENDAR_STATISTIC.findAll()
    }
}

module.exports = CalendarService
