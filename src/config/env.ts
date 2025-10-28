/**
 * Environment Variable Validation
 *
 * This module ensures all required environment variables are present and valid
 * at runtime, preventing runtime errors from missing configuration.
 */

const GITHUB_TOKEN_REGEX = /^(ghp|gho|ghu|ghs|ghr)_[a-zA-Z0-9]{36,}$/;

interface EnvConfig {
  GITHUB_TOKEN: string;
  NODE_ENV: 'development' | 'production' | 'test';
}

/**
 * Validates that the GitHub token has the correct format
 * GitHub Personal Access Tokens follow the pattern: prefix_base62string
 *
 * Prefixes:
 * - ghp_: Personal Access Token
 * - gho_: OAuth Access Token
 * - ghu_: User-to-server token
 * - ghs_: Server-to-server token
 * - ghr_: Refresh token
 */
function validateGitHubToken(token: string | undefined): string {
  if (!token) {
    throw new Error(
      'GITHUB_TOKEN environment variable is not set. ' +
      'Please create a .env.local file with GITHUB_TOKEN="your_token_here"'
    );
  }

  if (!GITHUB_TOKEN_REGEX.test(token)) {
    throw new Error(
      'GITHUB_TOKEN has invalid format. ' +
      'Expected format: ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    );
  }

  return token;
}

/**
 * Validates and exports all environment variables
 * This function is called on module import, ensuring early failure
 * if configuration is invalid.
 */
function validateEnv(): EnvConfig {
  const nodeEnv = process.env.NODE_ENV || 'development';

  if (!['development', 'production', 'test'].includes(nodeEnv)) {
    throw new Error(`Invalid NODE_ENV: ${nodeEnv}`);
  }

  return {
    GITHUB_TOKEN: validateGitHubToken(process.env.GITHUB_TOKEN),
    NODE_ENV: nodeEnv as 'development' | 'production' | 'test',
  };
}

/**
 * Validated environment configuration
 * Use this instead of process.env to ensure type safety and validation
 *
 * @example
 * import { env } from '@/config/env';
 *
 * const response = await fetch(url, {
 *   headers: {
 *     Authorization: `Bearer ${env.GITHUB_TOKEN}`
 *   }
 * });
 */
export const env = validateEnv();

/**
 * Helper to check if running in production
 */
export const isProduction = env.NODE_ENV === 'production';

/**
 * Helper to check if running in development
 */
export const isDevelopment = env.NODE_ENV === 'development';

/**
 * Helper to check if running in test environment
 */
export const isTest = env.NODE_ENV === 'test';
