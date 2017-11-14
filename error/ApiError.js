/**
 * Created by Xinhe on 2017/10/7.
 */
const ApiErrorNames = require('./ApiErrorNames')
module.exports = class ApiError extends Error {
    constructor(errorName) {
        super()
        const {code, message} = ApiErrorNames.getErrorInfo(errorName)
        this.name = errorName
        this.code = code
        this.message = message
    }
}