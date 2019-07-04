# Marmosad Backend
The project originated from [here](https://github.com/Marmosad/-deprecated-marmosad-backend-mmkay) and was ported to TS in this repository for ease of further development.

This project was generated using [Typescript](https://github.com/Microsoft/TypeScript) along with [Node](https://github.com/nodejs).

~~_The app *may be* broken right now because we ran out of Google Cloud credits (We need to go not more MLH hackathons).
It can be found [here](https://marmodb.firebaseapp.com);_~~

We've stopped paying for and maintaining the app in this form. We're currently working to go serverless on AWS Lambda. Cost savings and scalability! :D

[![Coverage Status](https://coveralls.io/repos/github/Marmosad/marmosad-backend-typescript/badge.svg?branch=integration)](https://coveralls.io/github/Marmosad/marmosad-backend-typescript?branch=integration)
[![Build Status](https://travis-ci.com/Marmosad/marmosad-backend-typescript.svg?branch=integration)](https://travis-ci.com/Marmosad/marmosad-backend-typescript)
## Getting Started

For this project, you only need to install [Node](https://nodejs.org/en/) to keep the node_modules folder updated with npm.

[Postman](https://www.getpostman.com/) may also be useful for API testing.

We suggest using [Vscode](https://code.visualstudio.com/) or [Webstorm](https://www.jetbrains.com/webstorm/) as your IDE.

### Development server

To run in development, use

```
yarn dev
```
To test
```
yarn jest
```

### Production server

To run in production, use
```
npm run start-prod
```
To test, use

```
npm test-prod
```

## Deployment

To run the front end with the back end, run
```
ng build
```
on the front end.

The backend should be run in development.


## Signficant modules

* [InversifyJS](https://github.com/inversify/InversifyJS) - Container control
* [Socket.io](https://github.com/socketio/socket.io) - Front-end communication
* [ts-node](https://github.com/TypeStrong/ts-node) - Executing typescript
* [Jest](https://jestjs.io/docs/en/getting-started) - Tests test tests!

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our style guide, and the process for submitting pull requests to us.

## Dependencies

Our dependencies are listed in [package.json](package.json).

## Authors
* **Jonathan Yang** - [Jono1202](https://github.com/jono1202)
* **Brendan Zhang** - [Blzzhang](https://github.com/blzzhang)
* **Wen Yu Ge** - [gewenyu99](https://github.com/gewenyu99) (Thanks a lot for forgetting me, guys :D)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
