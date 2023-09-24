/**
 * Unit tests for src/sgnl.js
 */
const { sgnl } = require('../src/sgnl')
const { Query } = require('../src/query')
const { expect } = require('@jest/globals')
const core = require('@actions/core')

const axios = require('axios')
jest.mock('axios')

// Mock the GitHub Actions core library
jest.spyOn(core, 'debug').mockImplementation()
jest.spyOn(core, 'info').mockImplementation()
jest.spyOn(core, 'warning').mockImplementation()

// fixtures
let allowData
let denyData

const basicQuery = new Query('t', 'a.com', 'p', 'a1', 'a2')

beforeEach(() => {
  jest.clearAllMocks()

  allowData = {
    decisions: [
      {
        action: 'c',
        assetId: 'b',
        decision: 'Allow',
        reasons: ['allowed!!']
      }
    ]
  }

  denyData = {
    decisions: [
      {
        action: 'c',
        assetId: 'b',
        decision: 'Deny',
        reasons: ['denied!!']
      }
    ]
  }
})

it('returns an allow response', async () => {
  axios.post.mockResolvedValue({ data: allowData })

  const response = await sgnl(basicQuery)
  expect(response).toStrictEqual({
    decision: true,
    reason: 'allowed!!'
  })

  expect(axios.post).toHaveBeenCalled()
})

it('returns an allow response without a reason', async () => {
  delete allowData.decisions[0].reasons
  axios.post.mockResolvedValue({ data: allowData })

  const response = await sgnl(basicQuery)
  expect(response).toStrictEqual({
    decision: true,
    reason: ''
  })

  expect(axios.post).toHaveBeenCalled()
})

it('returns an deny response', async () => {
  axios.post.mockResolvedValue({ data: denyData })

  const response = await sgnl(basicQuery)
  expect(response).toStrictEqual({
    decision: false,
    reason: 'denied!!'
  })

  expect(axios.post).toHaveBeenCalled()
})

it('returns an deny response without a reason', async () => {
  delete denyData.decisions[0].reasons
  axios.post.mockResolvedValue({ data: denyData })

  const response = await sgnl(basicQuery)
  expect(response).toStrictEqual({
    decision: false,
    reason: ''
  })

  expect(axios.post).toHaveBeenCalled()
})
