# SGNL Policy Action

[![GitHub Super-Linter](https://github.com/actions/javascript-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/actions/javascript-action/actions/workflows/ci.yml/badge.svg)
![Code Coverage](badges/coverage.svg)

## Calling SGNL from a GitHub Action

This SGNL-ai/policy-action allows you to call the SGNL API from a GitHub Actions
workflow. You can use this policy check to determine if the GitHub user is
allowed to execute or trigger the workflow in question based on a policy
definition in SGNL. To get started you will need to define a protected system
and policy in the SGNL console. For more information on how to setup SGNL for
GitHub, please see our
[setup guide](https://help.sgnl.ai/articles/protected-systems/protected-system-github/)

### Example

This example is passing the GitHub username of the user who triggered the action
as the principalId and the current repository as the assetId.

```yaml
steps:
  - name: Checkout
    id: checkout
    uses: actions/checkout@v4

  - name: SGNL Policy Check
    id: sgnl
    uses: SGNL-ai/policy-action@v2
    with:
      domain: ${{ vars.SGNL_SUBDOMAIN }}.sgnlapis.cloud
      token: ${{ secrets.SGNL_TOKEN }}
      principalId: ${{ github.actor }}
      action: 'my action'
      assetId: ${{ github.repository }}

  - name: Print Output
    id: output
    run: >
      echo "Decision '${{ steps.sgnl.outputs.decision }}',  Reason '${{
      steps.sgnl.outputs.reason }}'"
```

### Reporting bugs

If you run into problems with this action, first please check
[help.sgnl.ai](https://help.sgnl.ai) and
[developer.sgnl.ai](https://developer.sgnl.ai). If that doesn't resolve the
problem, please open a GitHub ticket against this repository.

## Building and Releasing

This section is for instructions on how to build and release the policy-action

### Setting up

1. This action is written in JavaScript. You'll need a version of Node.js >= v20
   (`node --version`)
1. clone the repository
1. run `npm run install` to install the dependencies

### Build loop

1. create a feature branch
1. add tests & make changes
1. `npm run test` should be green
1. `npm run all` to package the release (this creates the bundled action in
   /dist)
1. push your branch
1. create a PR

### Testing

Tests are using [Jest](https://jestjs.io/)

### Releasing

After a release is merged, the release has to be tagged so other projects can
use it correctly.

> [!NOTE] Example: You are releasing a backwards compatible feature to the v2
> major release. Let's assume the next release is v2.1.0 (i.e. not a patch, not
> a breaking change) then you would do the following to create the tags:

Updating the existing v2 tag so existing workflows can take advantage of your
new feature

`git tag -s -f -m "update v2 tag" v2`

Create a new tag to track your new feature more specifically

`git tag -s -m "update v2.1.0 tag" v2.1.0`

Or, if you are just patching a bug against v2.0, create a patch tag for a bugfix

`git tag -s -m "create v2.0.1 tag" v2.0.1`

Push the tags up to GitHub. The `-f` is required to update the v2 tag

`git push --tags --force`

### debugging super-linter issues

Occasionally the super-linter runs into issues with GitHub Actions and you want
to debug locally.

#### Apple Silicon

Until
[super-linter#5070](https://github.com/super-linter/super-linter/issues/5070) is
fixed

```bash
docker run --platform=linux/amd64 -e SHELL=/bin/bash -e DEFAULT_BRANCH=main -e \
VALIDATE_JSCPD=false -e VALIDATE_JAVASCRIPT_STANDARD=false -e \
VALIDATE_JAVASCRIPT_ES=false -e VALIDATE_JSON=false -e LOG_LEVEL=INFO \
-e RUN_LOCAL=true -v /path/to/local/policy-action:/tmp/lint \
--rm ghcr.io/super-linter/super-linter:latest
```

or generally other architectures

```bash
docker run -e DEFAULT_BRANCH=main -e VALIDATE_JSCPD=false \
-e VALIDATE_JAVASCRIPT_STANDARD=false -e LOG_LEVEL=INFO \
-e VALIDATE_JAVASCRIPT_ES=false -e VALIDATE_JSON=false -e \
RUN_LOCAL=true -v /path/to/local/policy-action:/tmp/lint \
--rm ghcr.io/super-linter/super-linter:latest
```
