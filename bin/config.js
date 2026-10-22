/**
 * Configuration constants and settings for the CLI
 */

import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const CONFIG = {
  // Version and compatibility
  minNodeVersion: '22.12.0',

  // Default values
  defaultProjectName: 'my-app',
  maxProjectNameLength: 50,

  // Network settings
  registryUrl: 'https://registry.npmjs.org/',
  timeout: {
    packageInstall: 30000,
    versionCheck: 5000,
    networkRequest: 10000,
  },

  // File paths
  paths: {
    root: path.join(__dirname, '..'),
    packageJson: path.join(__dirname, '../package.json'),
    templates: path.join(__dirname, '../templates'),
    devtools: path.join(__dirname, '../devtools'),
  },

  // Validation patterns
  validation: {
    projectName: /^[a-zA-Z0-9-_]+$/,
    packageName: /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/,
    version: /^\d+\.\d+\.\d+(-[a-zA-Z0-9]+)?$/,
  },

  // UI settings
  ui: {
    spinnerInterval: 100,
    maxRetries: 3,
  },

  // Banner configuration
  banner: {
    gradient:
      '\x1B[38;2;91;192;222m📘\x1B[39m\x1B[38;2;91;192;222m \x1B[39m\x1B[38;2;91;192;222mT\x1B[39m\x1B[38;2;82;175;222my\x1B[39m\x1B[38;2;74;159;222mp\x1B[39m\x1B[38;2;66;143;210me\x1B[39m\x1B[38;2;58;128;198mS\x1B[39m\x1B[38;2;54;124;190mc\x1B[39m\x1B[38;2;52;118;180mr\x1B[39m\x1B[38;2;50;115;172mi\x1B[39m\x1B[38;2;49;120;198mp\x1B[39m\x1B[38;2;47;110;168mt\x1B[39m\x1B[38;2;45;105;160m \x1B[39m\x1B[38;2;43;100;152mE\x1B[39m\x1B[38;2;41;95;144mx\x1B[39m\x1B[38;2;39;90;136mp\x1B[39m\x1B[38;2;37;85;128mr\x1B[39m\x1B[38;2;35;80;120me\x1B[39m\x1B[38;2;33;75;112ms\x1B[39m\x1B[38;2;30;72;106ms\x1B[39m\x1B[38;2;28;70;100m \x1B[39m\x1B[38;2;26;68;96mS\x1B[39m\x1B[38;2;25;68;94mt\x1B[39m\x1B[38;2;25;69;92ma\x1B[39m\x1B[38;2;25;70;91mr\x1B[39m\x1B[38;2;25;70;150mt\x1B[39m\x1B[38;2;25;70;150me\x1B[39m\x1B[38;2;25;70;150mr\x1B[39m',
  },
};

/**
 * Environment-specific configuration
 */
export const getEnvironmentConfig = () => {
  const env = process.env.NODE_ENV || 'production';

  const envConfigs = {
    development: {
      verbose: true,
      dryRun: false,
      skipVersionCheck: false,
    },
    test: {
      verbose: false,
      dryRun: true,
      skipVersionCheck: true,
    },
    production: {
      verbose: false,
      dryRun: false,
      skipVersionCheck: false,
    },
  };

  return {
    ...CONFIG,
    env: envConfigs[env] || envConfigs.production,
  };
};
