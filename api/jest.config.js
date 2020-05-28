module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', 'skip-test'],
  moduleDirectories: ['node_modules', 'src'],
  setupFiles: ['./tests/setup-test-env.skip-test.ts'],
}
