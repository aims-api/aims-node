const config = require('./jest.config')
config.testRegex = '/test/live_integration/.*\\.test\\.ts$'
console.log('RUNNING INTEGRATION TESTS')
module.exports = config
