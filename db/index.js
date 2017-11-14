/**
 * Created by Xinhe on 2017-11-08.
 */

const SERVER = require('./models/SERVER')
const SCRIPT = require('./models/SCRIPT')
const TASK = require('./models/TASK')

SERVER.hasMany(TASK, { foreignKey: 'server_id' })
TASK.belongsTo(SERVER, { foreignKey: 'server_id' })

SCRIPT.hasMany(TASK, { foreignKey: 'script_id' })
TASK.belongsTo(SCRIPT, { foreignKey: 'script_id' })

module.exports = {
    SERVER,
    SCRIPT,
    TASK
}
