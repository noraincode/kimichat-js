/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '.d.ts',
    'dist/',
    'lib/__tests__/clearFiles.ts',
  ],
};
