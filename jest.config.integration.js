import config from './jest.config'
config.testRegex = '/test/live_integration/.*\\.test\\.ts$'
console.log('RUNNING INTEGRATION TESTS')
export default config
