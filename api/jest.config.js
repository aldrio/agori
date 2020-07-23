module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', 'skip-test', '/tests/utils/'],
  moduleDirectories: ['node_modules', 'src', '.'],
  setupFiles: ['./tests/utils/setup-test-env.ts'],
  maxWorkers: 1,
}
