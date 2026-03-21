/**
 * Project metadata and health check system
 * Tracks project information and provides health insights
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Project metadata structure
 */
export const PROJECT_METADATA_SCHEMA = {
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  template: {
    name: '',
    version: '',
    orm: '',
    database: '',
  },
  devtools: {
    selected: [],
    preset: '',
    customizations: {},
  },
  performance: {
    buildTime: null,
    testTime: null,
    bundleSize: null,
    lastBenchmark: null,
  },
  health: {
    score: null,
    lastCheck: null,
    issues: [],
    recommendations: [],
  },
  dependencies: {
    lastUpdate: null,
    updateAvailable: {},
    securityVulnerabilities: [],
  },
};

/**
 * Create project metadata file
 */
export function createProjectMetadata(projectPath, config) {
  const metadata = {
    ...PROJECT_METADATA_SCHEMA,
    createdAt: new Date().toISOString(),
    template: {
      name: config.template,
      version: getTemplateVersion(config.template),
      orm: extractOrmFromTemplate(config.template),
      database: extractDatabaseFromTemplate(config.template),
    },
    devtools: {
      selected: config.devtools || [],
      preset: config.preset || 'custom',
      customizations: config.customizations || {},
    },
  };

  const metadataPath = path.join(projectPath, '.project-meta.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

  return metadata;
}

/**
 * Read existing project metadata
 */
export function readProjectMetadata(projectPath) {
  const metadataPath = path.join(projectPath, '.project-meta.json');

  if (!fs.existsSync(metadataPath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(metadataPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.warn('Failed to read project metadata:', error.message);
    return null;
  }
}

/**
 * Update project metadata
 */
export function updateProjectMetadata(projectPath, updates) {
  const metadata = readProjectMetadata(projectPath) || { ...PROJECT_METADATA_SCHEMA };
  const updatedMetadata = { ...metadata, ...updates };

  const metadataPath = path.join(projectPath, '.project-meta.json');
  fs.writeFileSync(metadataPath, JSON.stringify(updatedMetadata, null, 2));

  return updatedMetadata;
}

/**
 * Check project health
 */
export async function checkProjectHealth(projectPath) {
  const metadata = readProjectMetadata(projectPath);
  if (!metadata) {
    throw new Error('No project metadata found. Run from a valid project directory.');
  }

  const healthChecks = [];
  let score = 100;

  // 1. Package.json validation
  try {
    const pkgPath = path.join(projectPath, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

    if (!pkg.scripts || !pkg.scripts.dev) {
      healthChecks.push({
        type: 'warning',
        category: 'scripts',
        message: 'Missing dev script in package.json',
        recommendation: 'Add "dev": "nodemon" script',
      });
      score -= 5;
    }

    if (!pkg.scripts || !pkg.scripts.build) {
      healthChecks.push({
        type: 'warning',
        category: 'scripts',
        message: 'Missing build script in package.json',
        recommendation: 'Add build script based on your compiler choice',
      });
      score -= 5;
    }
  } catch (error) {
    healthChecks.push({
      type: 'error',
      category: 'structure',
      message: 'Invalid or missing package.json',
      recommendation: 'Ensure package.json exists and is valid JSON',
    });
    score -= 20;
  }

  // 2. TypeScript configuration
  const tsconfigPath = path.join(projectPath, 'tsconfig.json');
  if (!fs.existsSync(tsconfigPath)) {
    healthChecks.push({
      type: 'error',
      category: 'typescript',
      message: 'Missing tsconfig.json',
      recommendation: 'Add TypeScript configuration file',
    });
    score -= 15;
  }

  // 3. Source directory structure
  const srcPath = path.join(projectPath, 'src');
  if (!fs.existsSync(srcPath)) {
    healthChecks.push({
      type: 'error',
      category: 'structure',
      message: 'Missing src directory',
      recommendation: 'Create src directory with main application code',
    });
    score -= 20;
  }

  // 4. Environment configuration
  const envExamplePath = path.join(projectPath, '.env.example');
  if (!fs.existsSync(envExamplePath)) {
    healthChecks.push({
      type: 'info',
      category: 'config',
      message: 'Missing .env.example file',
      recommendation: 'Add environment variables example file',
    });
    score -= 5;
  }

  // 5. Security checks
  try {
    const { stdout } = await execAsync('npm audit --json', { cwd: projectPath });
    const auditResult = JSON.parse(stdout);

    if (auditResult.vulnerabilities && Object.keys(auditResult.vulnerabilities).length > 0) {
      const vulnCount = Object.keys(auditResult.vulnerabilities).length;
      healthChecks.push({
        type: 'warning',
        category: 'security',
        message: `${vulnCount} security vulnerabilities found`,
        recommendation: 'Run `npm audit fix` to resolve security issues',
      });
      score -= Math.min(vulnCount * 2, 20);
    }
  } catch (error) {
    // npm audit failed - not critical
  }

  // Update metadata with health check results
  const health = {
    score: Math.max(0, score),
    lastCheck: new Date().toISOString(),
    issues: healthChecks,
    recommendations: healthChecks
      .filter((check) => check.type === 'error' || check.type === 'warning')
      .map((check) => check.recommendation),
  };

  updateProjectMetadata(projectPath, { health });

  return health;
}

/**
 * Check for dependency updates
 */
export async function checkDependencyUpdates(projectPath) {
  try {
    const { stdout } = await execAsync('npm outdated --json', { cwd: projectPath });
    const outdated = JSON.parse(stdout);

    const updateAvailable = {};
    Object.entries(outdated).forEach(([pkg, info]) => {
      updateAvailable[pkg] = {
        current: info.current,
        wanted: info.wanted,
        latest: info.latest,
        type: info.type || 'dependencies',
      };
    });

    const dependencies = {
      lastUpdate: new Date().toISOString(),
      updateAvailable,
      securityVulnerabilities: [],
    };

    updateProjectMetadata(projectPath, { dependencies });

    return dependencies;
  } catch (error) {
    console.warn('Failed to check dependency updates:', error.message);
    return null;
  }
}

/**
 * Generate project report
 */
export function generateProjectReport(projectPath) {
  const metadata = readProjectMetadata(projectPath);
  if (!metadata) {
    throw new Error('No project metadata found');
  }

  const report = {
    projectInfo: {
      template: metadata.template,
      devtools: metadata.devtools,
      createdAt: metadata.createdAt,
      age: calculateProjectAge(metadata.createdAt),
    },
    health: metadata.health,
    performance: metadata.performance,
    dependencies: metadata.dependencies,
    summary: {
      healthScore: metadata.health?.score || 'Not analyzed',
      outdatedDependencies: Object.keys(metadata.dependencies?.updateAvailable || {}).length,
      securityIssues: metadata.dependencies?.securityVulnerabilities?.length || 0,
      lastHealthCheck: metadata.health?.lastCheck,
      recommendations: metadata.health?.recommendations?.slice(0, 3) || [],
    },
  };

  return report;
}

/**
 * Helper functions
 */
function getTemplateVersion(templateName) {
  // In a real implementation, this would check the template version
  return '1.0.0';
}

function extractOrmFromTemplate(templateName) {
  if (templateName.includes('prisma')) return 'prisma';
  if (templateName.includes('drizzle')) return 'drizzle';
  if (templateName.includes('mongoose')) return 'mongoose';
  if (templateName.includes('typeorm')) return 'typeorm';
  if (templateName.includes('sequelize')) return 'sequelize';
  if (templateName.includes('mikro-orm')) return 'mikro-orm';
  if (templateName.includes('knex')) return 'knex';
  return null;
}

function extractDatabaseFromTemplate(templateName) {
  if (templateName.includes('postgresql')) return 'postgresql';
  if (templateName.includes('mongodb')) return 'mongodb';
  if (templateName.includes('mysql')) return 'mysql';
  return null;
}

function calculateProjectAge(createdAt) {
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 7) return `${diffDays} days`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks`;
  return `${Math.floor(diffDays / 30)} months`;
}
