'use strict'

class Query {
  constructor(token, domain, principalId, assetId, action) {
    this.token = token
    this.domain = domain
    this.principalId = principalId
    this.assetId = assetId
    this.action = action

    if (!this.assetId && !this.action) {
      throw new Error("At least one of 'assetId' or 'action' is required.")
    }

    if (!this.token) {
      throw new Error(
        'A token is required to call the SGNL API. Please see https://help.sgnl.ai for more details'
      )
    }

    if (!this.principalId) {
      throw new Error('A principalId is required.')
    }

    this.endpointUrl = new URL(
      '/access/v2/evaluations',
      ['https://', domain].join('')
    )
  }

  headers() {
    return {
      Authorization: `Bearer ${this.token}`
    }
  }

  endpoint() {
    return this.endpointUrl.toString()
  }

  payload() {
    const _payload = {
      principal: null,
      queries: []
    }

    _payload.principal = {
      id: this.principalId
    }

    const q = {}
    if (this.assetId) {
      q.assetId = this.assetId
    }

    if (this.action) {
      q.action = this.action
    }

    _payload.queries.push(q)

    return _payload
  }
}

module.exports = {
  Query
}
