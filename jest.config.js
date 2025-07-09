module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/jest.setup.js'   // Add this line
  ],
  transformIgnorePatterns: [
  'node_modules/(?!(jest-)?@?react-native|@react-navigation|expo(nent)?|@expo|@unimodules|unimodules|native-base|sentry-expo|@firebase|firebase|@walletconnect)'
  ],
  moduleNameMapper: {
    '^@react-native-async-storage/async-storage$':
      '@react-native-async-storage/async-storage/jest/async-storage-mock',
    '^.+\\.(jpg|jpeg|png|svg|ttf)$': '<rootDir>/__mocks__/fileMock.js',
    '^./FirebaseConfig$': '<rootDir>/__mocks__/FirebaseConfig.ts',
    '^firebase/auth/react-native$': '<rootDir>/__mocks__/firebase.ts',
    '^firebase/auth$': '<rootDir>/__mocks__/firebase.ts',
    '^firebase/app$': '<rootDir>/__mocks__/firebase.ts',
    '^firebase/firestore$': '<rootDir>/__mocks__/firebase.ts',
    '^firebase/storage$': '<rootDir>/__mocks__/firebase.ts',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};
