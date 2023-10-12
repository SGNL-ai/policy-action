'use strict'

const core = require('@actions/core')
const { sgnl } = require('./sgnl')
const { Query } = require('./query')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  // skip calling SGNL if bypassMode is true.
  if (core.getInput('bypassMode') === true) {
    core.warning('*** WARNING: BYPASS MODE ENABLED ***')
    core.warning('*** Skipping SGNL Policy Checks ***')
    core.setOutput('reason', 'Skipping SGNL call due to bypassMode=true')
    core.setOutput('decision', true)
    return
  }

  // construct a Query object; this validates the input and raises an error if
  // the params are malformed
  try {
    const query = new Query(
      core.getInput('token'),
      core.getInput('domain'),
      core.getInput('principalId'),
      core.getInput('assetId'),
      core.getInput('action')
    )

    core.setSecret(query.token)

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(
      `Querying SGNL accessEvaluation API. Query is:\n${JSON.stringify(
        query.payload(),
        null,
        2
      )}`
    )

    // Call SGNL, returns an object with the decision and reason
    const result = await sgnl(query)

    // Set outputs for other workflow steps to use
    core.setOutput('reason', result.reason)
    core.setOutput('decision', result.decision)

    // set the action to failed
    if (!result.decision) {
      core.setFailed(result.reason)
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.warning('SGNL API request failed')

    if (error.response) {
      // non-200 response from SGNL
      core.info(error.response.data)
      core.info(error.response.status)
      core.info(error.response.headers)
      core.setFailed(error.toJSON())
    } else if (error.request) {
      // SGNL did not response to the request
      core.info(error.request)
      core.setFailed(`SGNL API did not respond, details:\n${error.request}`)
    } else {
      // Generic error
      core.info('Error', error.message)
      core.setFailed(error.message)
    }
  }
}

module.exports = {
  run
}
