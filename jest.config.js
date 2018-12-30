module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: ['./src/config/inversify.config.ts'],
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
    "collectCoverageFrom": [
        "src/**/*.{ts}",
        "!src/app.ts",
        "!src/config.ts",
        "!src/config/config.ts",
        "!**/*/config.ts",
        "!<rootDir>/node_modules/",
        "!<rootDir>/src/config/"
    ],
    "coveragePathIgnorePatterns": ["/node_modules/", "<rootDir>/build/", "<rootDir>/coverage/", "<rootDir>/src/interface/"]
}
