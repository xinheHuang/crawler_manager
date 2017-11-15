/**
 * Created by Xinhe on 2017-11-08.
 */

const SERVER = require('./models/SERVER')
const SCRIPT = require('./models/SCRIPT')
const TASK = require('./models/TASK')
const SUBTASK= require('./models/SUBTASK')

SERVER.hasMany(SUBTASK, { foreignKey: 'server_id' })
SUBTASK.belongsTo(SERVER, { foreignKey: 'server_id' })

SCRIPT.hasMany(SUBTASK, { foreignKey: 'script_id' })
SUBTASK.belongsTo(SCRIPT, { foreignKey: 'script_id' })

TASK.hasMany(SUBTASK, { foreignKey: 'task_id' })
SUBTASK.belongsTo(TASK, { foreignKey: 'task_id' })

module.exports = {
    SERVER,
    SCRIPT,
    TASK,
    SUBTASK
}
