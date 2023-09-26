'use strict'

const axios = require('axios')
const core = require('@actions/core')
const { Query } = require('./query')

/**
 * Call SGNL access API
 *
 * @param {String} token The authentication token used to make calls to the SGNL accessEvaluation API
 * @param {String} principleId The identity of the principal executing this action. Typically a github username or email address.
 * @param {String} assetId The identifier of an asset for this policy check. Typically the repo from the action. At least one of 'assetId' or 'action' is required.
 * @param {String} action An optional action to pass to SGNL. At least one of 'assetId' or 'action' is required.
 * @returns {Promise<Object>} Resolves with {decision:boolean,reason:String}
 */
async function sgnl(query) {
  const response = await axios.post(query.endpoint(), query.payload(), {
    headers: query.headers()
  })

  core.debug(`SGNL API returned:\n${JSON.stringify(response.data, null, 2)}`)

  return parse(response)
}

function parse(response) {
  return {
    decision: response.data.decisions[0].decision === 'Allow',
    reason: response.data.decisions[0].reasons
      ? response.data.decisions[0].reasons[0]
      : ''
  }
}

module.exports = { sgnl }
