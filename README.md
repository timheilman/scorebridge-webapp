<!-- TOC start (generated with https://github.com/derlin/bitdowntoc) -->

- [Welcome to ScoreBridge-Webapp](#welcome-to-scorebridge-webapp)
- [Getting Started with Create React App](#getting-started-with-create-react-app)
- [Linting](#linting)
- [Updating TypeScript Types for GQL Types](#updating-typescript-types-for-gql-types)
- [Testing](#testing)
- [Available Scripts](#available-scripts)
  - [`npm start`](#npm-start)
  - [`npm test`](#npm-test)
  - [`npm run cypress:open`](#npm-run-cypressopen)
  - [`npm run build`](#npm-run-build)
  - [`npm run eject`](#npm-run-eject)
- [Learn More](#learn-more)
- [captcha](#captcha)

<!-- TOC end -->

## Welcome to ScoreBridge-Webapp

Please read the [scorebridge-ts-submodule README](https://github.com/timheilman/scorebridge-ts-submodule/blob/main/README.md) for important context regarding this project.

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
Then handsonreact.com examples
Then the redux repo's counter-ts example

## Linting

Quick notes on linting: `npm run tidy` will keep prettier and eslint both running as separate systems.
eslint is improved with type-checking abilities for typescript.

On that front, `@typescript-eslint/no-misused-promises` seems like it can
help a lot with common difficult-to-diagnose (because they provide no stack
trace) Promise-related coding errors. However, for reasons I don't want to
rabbit-hole on, when using the `@reduxjs/toolkit` command, `createAsyncThunk`
and the `extraReducers` field on the options to `createSlice`, this rule
misfires, likely because that `extraReducers` implementation is not type-safe
to express that a promise is being returned.

For now, convention is simply to disable this lint rule for this condition,
since in general the rule can save enormous headaches.

Use one or the other of this kind of code to get prettier and eslint passing
despite this gotcha needed case-by-case disablement.

```typescript jsx
<button
  className={
    styles.asyncButton /* eslint-disable @typescript-eslint/no-misused-promises */
  }
  onClick={
    () =>
      dispatch(
        incrementAsync(incrementValue),
      ) /* eslint-enable @typescript-eslint/no-misused-promises */
  }
>
  Add Async
</button>
```

Or with no preceding attribute on the element:

```typescript jsx
{/* eslint-disable @typescript-eslint/no-misused-promises */}
<button
  onClick={
    () =>
      dispatch(
        incrementAsync(incrementValue),
      ) /* eslint-enable @typescript-eslint/no-misused-promises */
  }
>
```

## Updating TypeScript Types for GQL Types

When changes occur in the cloud gql api, they need to be refreshed via the scorebridge-ts-submodule repo.

TODO: SCOR-146 fix this and make sure it works, once vite and amplify v6 are in place and deployable to amplify frontend:

- `export SCOREBRIDGE_WEBAPP_CLONE_LOCATION=../scorebridge-webapp`
- `npm run codegen-gql-types # this creates/updates appsync.d.ts`
- `npm run provideGqlTypesToWebapp # this copies appsync.d.ts to SCOREBRIDGE_WEBAPP_CLONE_LOCATION`

## Testing

Testing requires some environment variable and TypeScript type setup. Files are checked in locally but need to
be copied:

- `cp ./.env.dev.env ./.env`
- `cp ./cypress.env.dev.json ./cypress.env.json`

Or updating from within a `scorebridge-cloud` clone into this repo's clone:

- `export SCOREBRIDGE_WEBAPP_CLONE_LOCATION=../scorebridge-webapp`
- `npm run refreshDetailsToWebapp`

React automatically honors `.env` but only for env variables prefixed `REACT_APP`. Cypress does not use these.

Cypress honors cypress.env.json.

`tsconfig.json` imports `appsync.d.ts` which also gets copied over.

use `npm start` in one terminal, then `npm run cypress:open`. The Cypress application takes over the driving of the tests beneath
`cypress`.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the react-based test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run cypress:open`

Launches the Cypress-based test runner application. This
runs e2e tests in Electron.

### `npm run cypress:run`

This runs all e2e tests headless in Electron and outputs results to the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## package.json and .nvmrc commentary

The version of node is locked to 18.13.0 because [Amplify frontend hosting is fastest with 
this version of node 18](
https://github.com/aws-amplify/amplify-hosting/issues/3109#issuecomment-1509264093), and vite 
depends on node to do its stuff.  Any later versions would require building node from source on
every build, which failed when I tried it with v18.19.0 anyway.  The version of npm is locked 
to 9.7.1 because [amplify-js v6 requires this version or later in the development environment](
https://docs.amplify.aws/react/build-a-backend/troubleshooting/migrate-from-javascript-v5-to-v6/#step-1-upgrade-your-dev-environment).

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## captcha

Go here to get the key under the scorebridge8 account w/google
https://developers.google.com/recaptcha/intro
