/**
 * Created by Xinhe on 2017-09-20.
 */
const { SCRIPT } = require('../../../db')
const ApiError = require('../../../error/ApiError')
const ApiErrorNames = require('../../../error/ApiErrorNames')
const Converter = require ('../../converter')
class ScriptService {

    static async getScripts() {
        return (await SCRIPT.findAll()).map(Converter.ScriptConverter)
    }
    static async getScriptById(scriptId){
        return Converter.ScriptConverter(await SCRIPT.findById(scriptId));
    }
}

module.exports = ScriptService
