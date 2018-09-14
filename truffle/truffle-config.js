'use strict'

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*'
    }
  },
  compilers: {
    solc: {
      version: '0.4.24'
    }
  },
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions : {
      showTimeSpent: true
    }
  }
}
