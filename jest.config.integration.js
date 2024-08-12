var config = require('./jest.config')
config.testRegex = '.*\\.itest\\.ts$'
console.log('RUNNING INTEGRATION TESTS')
module.exports = config
