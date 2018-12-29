module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: ['./src/inversify.config.ts'],
    "roots": [
        "<rootDir>/"
    ],
    "transform": {
        "^.+\\.tsx?$": "ts-jest"
    },
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
}