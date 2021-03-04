module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ["/node_modules/", "/__tests__/utillity/"],
  collectCoverage: true,
  coverageReporters: ["html"]
};