# Getting Started with Create React App

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

When changes occur in the cloud gql api, they need to be refreshed here:

- `cp ../scorebridge-cloud/appsync.d.ts .`

Or use the `scorebridge-cloud` facility:

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
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the react-based test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run cypress:open`

Launches the Cypress-based test runner application. This
runs e2e tests in Electron.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
