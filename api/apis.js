/**
 * Created by Xinhe on 2017-09-20.
 */
<<<<<<< HEAD
const user = require('./controller/user')
const industry = require('./controller/industry')
const calendar = require('./controller/calendar')
const graph = require('./controller/graph')

const apis = [
    ...user,
    ...industry,
    ...calendar,
    ...graph
=======
const controller = require('./controller')

const apis = [
    ...controller,
>>>>>>> d99b2abd2c427c181b4c12b60550daea4be1d63a
]

module.exports = apis