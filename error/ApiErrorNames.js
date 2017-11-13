/**
 * Created by Xinhe on 2017/10/7.
 */
/**
 * API错误名称
 */
const ApiErrorNames = {}

ApiErrorNames.UNKNOW_ERROR = 'unknowError'
ApiErrorNames.USER_NOT_EXIST = 'userNotExist'
ApiErrorNames.USER_PASSWORD_WRONG = 'userPasswordWrong'
ApiErrorNames.USERNAME_EXIST = 'usernameExist'
ApiErrorNames.NOT_FOUND = 'resourceNotFound'
/**
 * API错误名称对应的错误信息
 */
const error_map = new Map()

error_map.set(ApiErrorNames.UNKNOW_ERROR, {
    code: -1,
    message: '未知错误'
})
error_map.set(ApiErrorNames.USER_NOT_EXIST, {
    code: 101,
    message: '用户不存在'
})
error_map.set(ApiErrorNames.USER_PASSWORD_WRONG, {
    code: 102,
    message: '密码错误'
})
error_map.set(ApiErrorNames.USERNAME_EXIST, {
    code: 103,
    message: '用户名已存在'
})
error_map.set(ApiErrorNames.NOT_FOUND, {
    code: -2,
    message: '资源未找到'
})

//根据错误名称获取错误信息
ApiErrorNames.getErrorInfo = (error_name = ApiErrorNames.UNKNOW_ERROR) => {
    return error_map.get(error_name) || error_map.get(ApiErrorNames.UNKNOW_ERROR)
}

module.exports = ApiErrorNames