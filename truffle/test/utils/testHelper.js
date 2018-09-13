'use strict'
const assert = require('assert')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
chai.use(chaiAsPromised)

const expectErrorReason = async (fn, errorReason) => {
  try {
    await fn()
  } catch (err) {
    return expect(err.reason).to.equal(errorReason)
  }
  assert.fail('Expecting an error but none was caught')
}

module.exports = { assert, expect, expectErrorReason }