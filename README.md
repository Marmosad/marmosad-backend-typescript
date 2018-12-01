# Marmosad Backend
The project originated from [here](https://github.com/Marmosad/-deprecated-marmosad-backend-mmkay) and was ported to TS in this repository for ease of further development.

This project was generated using [Typescript](https://github.com/Microsoft/TypeScript) along with [Node](https://github.com/nodejs).

The app is broken right now because we ran out of Google Cloud credits (We need to go not more MLH hackathons).
It can be found here http://marmosad.me/;

## Getting Started

For this project, you only need to install [Node](https://nodejs.org/en/) to keep the node_modules folder updated with npm.

[Postman](https://www.getpostman.com/) may also be useful for API testing.

We suggest using [Vscode](https://code.visualstudio.com/) or [Webstorm](https://www.jetbrains.com/webstorm/) as your IDE.

### Development server

To run in development, use

```
npm start
```
To test, use (We don't have  any :D)

```
npm test
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
