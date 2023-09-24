# SGNL Policy Action

[![GitHub Super-Linter](https://github.com/actions/javascript-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/actions/javascript-action/actions/workflows/ci.yml/badge.svg)
![Code Coverage](badges/coverage.svg)

## Calling SGNL from a Github Action
This SGNL-ai/policy-action allows you to call the SGNL API from a Github actions workflow. You can use
this policy check to determine if the Github user is allowed to execute or trigger the workflow in
question based on a policy definition in SGNL. To get started you will need to define a protected system and policy in the SGNL console. For more information on how to setup SGNL for Github, please see our [setup guide](https://help.sgnl.ai/articles/protected-systems/protected-system-github/)

### Example
This example is passing the github username of the user who triggered the action as the principalId and the current repository as the assetId.

```yaml
steps:
  - name: Checkout
    id: checkout
    uses: actions/checkout@v4

  - name: SGNL Policy Check
    id: sgnl
    uses: SGNL-ai/policy-action@v1
    with:
      token: ${{ secrets.SGNL_TOKEN }}
      principalId: ${{ github.actor }}
      action: 'my action'
      assetId: ${{ github.repository }}

  - name: Print Output
    id: output
    run: echo "Decision '${{ steps.sgnl.outputs.decision }}', Reason '${{ steps.sgnl.outputs.reason }}'"
```