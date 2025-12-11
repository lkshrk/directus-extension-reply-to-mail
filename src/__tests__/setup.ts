// Test setup file
import { jest } from "@jest/globals";

// Mock Directus services and dependencies
globalThis.console = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Mock the entire @directus/extensions module
jest.mock(
  "@directus/extensions",
  () => ({
    defineOperationApi: jest.fn((config) => config),
    defineOperationApp: jest.fn((config) => config),
  }),
  {
    virtual: true,
  },
);
