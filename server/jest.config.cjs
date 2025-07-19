// jest.config.cjs
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "app/**/*.js",
    "!app/createApp.js"
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};