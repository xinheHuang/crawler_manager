/**
 * Created by Xinhe on 2017/10/7.
 */
const crypto = require('crypto')

/**
 * @sha1加密模块 (加密固定,不可逆)
 * @param str string 要加密的字符串
 * @retrun string 加密后的字符串
 * */
exports.getSha1 = (str) => {
    const sha1 = crypto.createHash("sha1")
    sha1.update(str)
    return sha1.digest("hex")
}