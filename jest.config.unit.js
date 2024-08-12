var config = require('./jest.config')
config.testRegex = 'test\\.ts$'
console.log('RUNNING UNIT TESTS')
module.exports = config
