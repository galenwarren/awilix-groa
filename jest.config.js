module.exports = {
  collectCoverageFrom: ["src/**/*.js"],
  coverageReporters: ["text", "html"],
  testPathIgnorePatterns: ["/node_modules/", "/controllers/"],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    }
  }
};
