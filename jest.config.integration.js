import config from './jest.config.js'
config.testRegex = '/test/live_integration/.*\\.test\\.ts$'
console.log('RUNNING INTEGRATION TESTS')
export default config
