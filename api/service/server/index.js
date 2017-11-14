/**
 * Created by Xinhe on 2017-09-20.
 */
const { SERVER } = require('../../../db')
const ApiError = require('../../../error/ApiError')
const ApiErrorNames = require('../../../error/ApiErrorNames')
const Converter = require ('../../converter')
class ServerService {
    static async getServers() {
        return (await SERVER.findAll()).map(Converter.ServerConverter)
    }
    static async getServerById(serverId){
        return Converter.ServerConverter(await SERVER.findById(serverId));
    }
}

module.exports = ServerService
