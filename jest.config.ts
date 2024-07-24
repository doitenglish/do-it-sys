import nextJest from "next/jest";
import type { Config } from "@jest/types";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig: Config.InitialOptions = {
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@firebase/(.*)$": "<rootDir>/src/lib/firebase/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.jest.json",
    },
  },
};

export default createJestConfig(customJestConfig);
