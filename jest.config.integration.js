var config = require('./jest.config')
config.testRegex = '/test/integration/.*\\.test\\.ts$'
console.log('RUNNING INTEGRATION TESTS')
module.exports = config
