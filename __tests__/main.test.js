/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */
const core = require('@actions/core')
const main = require('../src/main')

// Mock the GitHub Actions core library
jest.spyOn(core, 'debug').mockImplementation()
jest.spyOn(core, 'info').mockImplementation()
const warning = jest.spyOn(core, 'warning').mockImplementation()
jest.spyOn(core, 'setSecret').mockImplementation()

const getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
const setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
const setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

// Mock the sgnl object
jest.mock('../src/sgnl')
const { sgnl } = require('../src/sgnl')

// fixture
let inputs

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // typical inputs
    getInputMock.mockImplementation(name => {
      return inputs[name]
    })

    inputs = {
      token: 't',
      domain: 'abc.xyz',
      principalId: 'p',
      assetId: 'a',
      action: 'b',
      bypassMode: 'false'
    }
  })

  // scenarios that skip
  it('does skip SGNL API if bypass mode is true', async () => {
    inputs.bypassMode = true

    await main.run()
    expect(core.getInput('bypassMode')).toBe(true)
    expect(sgnl).not.toHaveBeenCalled()
  })

  // scenarios that do not skip
  test.each([
    { bypassMode: false },
    { bypassMode: '' },
    { bypassMode: 'false' },
    { bypassMode: null },
    { bypassMode: 'true' },
    { bypassMode: 'asdfafadfa' },
    { bypassMode: -1 },
    { bypassMode: { a: 123 } },
    { bypassMode: NaN }
  ])(
    'does not skip SGNL API if bypass mode is `$bypassMode`',
    async ({ bypassMode }) => {
      inputs.bypassMode = bypassMode

      await main.run()
      expect(core.getInput('bypassMode')).toBe(bypassMode)
      expect(sgnl).toHaveBeenCalled()
    }
  )

  it('prints lots of warnings if bypas mode is true', async () => {
    inputs.bypassMode = true

    await main.run()
    expect(core.getInput('bypassMode')).toBe(true)
    expect(warning).toHaveBeenNthCalledWith(
      1,
      '*** WARNING: BYPASS MODE ENABLED ***'
    )
    expect(warning).toHaveBeenNthCalledWith(
      2,
      '*** Skipping SGNL Policy Checks ***'
    )
  })

  it('sets the output to true when bypass mode is enabled', async () => {
    inputs.bypassMode = true

    await main.run()
    expect(setOutputMock).toHaveBeenNthCalledWith(
      1,
      'reason',
      'Skipping SGNL call due to bypassMode=true'
    )
    expect(setOutputMock).toHaveBeenNthCalledWith(2, 'decision', true)
  })

  // returns a Deny
  it('fails job on a Deny response', async () => {
    sgnl.mockImplementation(() => {
      return {
        decision: false,
        reason: "Sorry Dave, I can't do that"
      }
    })

    await main.run()
    expect(sgnl).toHaveBeenCalled()
    expect(setFailedMock).toHaveBeenCalledWith("Sorry Dave, I can't do that")
  })

  // returns a Deny
  it('fails job on a Deny response, with empty reason', async () => {
    sgnl.mockImplementation(() => {
      return {
        decision: false
      }
    })

    await main.run()
    expect(sgnl).toHaveBeenCalled()
    expect(setFailedMock).toHaveBeenCalled()
  })

  // returns an Allow
  it('does not fail job on a Allow response', async () => {
    sgnl.mockImplementation(() => {
      return {
        decision: true,
        reason: 'affirmative!'
      }
    })

    await main.run()
    expect(sgnl).toHaveBeenCalled()
    expect(setFailedMock).not.toHaveBeenCalled()
  })

  // returns a Allow
  it('does not fail job on a Allow response, with empty reason', async () => {
    sgnl.mockImplementation(() => {
      return {
        decision: true
      }
    })

    await main.run()
    expect(sgnl).toHaveBeenCalled()
    expect(setFailedMock).not.toHaveBeenCalled()
  })

  // throw 401 exception
  it('fails job on non-200 error', async () => {
    sgnl.mockImplementation(() => {
      const e = new Error()
      e.response = {
        data: {},
        status: 401,
        headers: {}
      }
      e.toJSON = () => {
        return 'failed!'
      }
      throw e
    })

    await main.run()
    expect(sgnl).toHaveBeenCalled()
    expect(setFailedMock).toHaveBeenCalledWith('failed!')
  })

  // request error
  it('fails job on a request error', async () => {
    sgnl.mockImplementation(() => {
      const e = new Error()
      e.request = 'request failed'
      throw e
    })

    await main.run()
    expect(sgnl).toHaveBeenCalled()
    expect(setFailedMock).toHaveBeenCalledWith(
      'SGNL API did not respond, details:\nrequest failed'
    )
  })

  // raise error from query
  it('fails job on Query validation error', async () => {
    sgnl.mockImplementation(() => {
      throw new Error('Sorry!')
    })

    await main.run()
    expect(sgnl).toHaveBeenCalled()
    expect(setFailedMock).toHaveBeenCalledWith('Sorry!')
  })
})
