'use strict'
const assert = require('assert')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
chai.use(chaiAsPromised)

module.exports = { assert, expect }