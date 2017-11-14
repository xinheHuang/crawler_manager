/**
 * Created by Xinhe on 2017/10/7.
 */
module.exports = class BusinessError extends Error {
    constructor(message) {
        super()
        this.message = message
    }
}