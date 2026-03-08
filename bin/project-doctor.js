#!/usr/bin/env node

/**
 * Project Doctor - Automatic issue fixer for projects
 */

import { checkProjectHealth, readProjectMetadata } from './project-health.js';
import { ValidationError } from './errors.js';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Fix missing dev script in package.json
 */
async function fixMissingDevScript(projectPath) {
  const pkgPath = path.join(projectPath, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  if (!pkg.scripts) {
    pkg.scripts = {};
  }

  if (!pkg.scripts.dev) {
    pkg.scripts.dev = 'nodemon';
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    return true;
  }

  return false;
}

/**
 * Fix missing build script in package.json
 */
async function fixMissingBuildScript(projectPath) {
  const pkgPath = path.join(projectPath, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  const metadata = readProjectMetadata(projectPath);
  const devtools = metadata?.devtools?.selected || [];

  if (!pkg.scripts) {
    pkg.scripts = {};
  }

  if (!pkg.scripts.build) {
    // Determine build script based on selected DevTools
    if (devtools.includes('swc')) {
      pkg.scripts.build =
        'swc src -d dist --strip-leading-paths --copy-files --delete-dir-on-start';
    } else if (devtools.includes('tsup')) {
      pkg.scripts.build = 'tsup';
    } else {
      pkg.scripts.build = 'tsc && tsc-alias';
    }

    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    return true;
  }

  return false;
}

/**
 * Create missing .env.example file
 */
async function fixMissingEnvExample(projectPath) {
  const envExamplePath = path.join(projectPath, '.env.example');

  if (!fs.existsSync(envExamplePath)) {
    const metadata = readProjectMetadata(projectPath);
    const database = metadata?.template?.database;

    let envContent = `# Server
NODE_ENV=development
PORT=3000

# CORS
CORS_ORIGIN=*
CORS_CREDENTIALS=true

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Database`;

    if (database === 'postgresql') {
      envContent += `
DATABASE_URL=postgresql://user:password@localhost:5432/dbname`;
    } else if (database === 'mongodb') {
      envContent += `
MONGODB_URL=mongodb://localhost:27017/dbname`;
    } else {
      envContent += `
# Add your database configuration here`;
    }

    envContent += `

# Logging
LOG_FORMAT=dev
LOG_DIR=../logs
`;

    fs.writeFileSync(envExamplePath, envContent);
    return true;
  }

  return false;
}

/**
 * Fix security vulnerabilities
 */
async function fixSecurityVulnerabilities(projectPath) {
  try {
    console.log(chalk.blue('   🔧 Running npm audit fix...'));
    await execAsync('npm audit fix', { cwd: projectPath });
    return true;
  } catch (error) {
    console.log(chalk.yellow(`   ⚠️  Auto-fix failed: ${error.message}`));
    return false;
  }
}

/**
 * Create missing src directory with basic structure
 */
async function fixMissingSrcDirectory(projectPath) {
  const srcPath = path.join(projectPath, 'src');

  if (!fs.existsSync(srcPath)) {
    fs.mkdirSync(srcPath, { recursive: true });

    const metadata = readProjectMetadata(projectPath);
    const template = metadata?.template?.name || 'default';

    // Create basic app structure
    const appContent = `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Express TypeScript Server is running!',
    template: '${template}',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', uptime: process.uptime() });
});

// Start server
app.listen(PORT, () => {
  console.log(\`🚀 Server is running on http://localhost:\${PORT}\`);
});

export default app;
`;

    const serverContent = `import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(\`🚀 Server started on port \${PORT}\`);
});
`;

    fs.writeFileSync(path.join(srcPath, 'app.ts'), appContent);
    fs.writeFileSync(path.join(srcPath, 'server.ts'), serverContent);

    return true;
  }

  return false;
}

/**
 * Main doctor function
 */
async function doctorProject(projectPath = process.cwd(), autoFix = false) {
  console.log(chalk.blue.bold('\n👨‍⚕️ Starting project doctor...\n'));

  try {
    // 1. 건강도 체크부터 수행
    const health = await checkProjectHealth(projectPath);

    if (health.score >= 90) {
      console.log(chalk.green('🎉 Project is very healthy! Nothing to fix.'));
      return;
    }

    const issues = health.issues.filter(
      (issue) => issue.type === 'error' || issue.type === 'warning',
    );

    if (issues.length === 0) {
      console.log(chalk.green('✅ No fixable issues found.'));
      return;
    }

    console.log(chalk.yellow(`🔍 Found ${issues.length} fixable issues:\n`));

    let fixed = 0;

    // 2. 자동 수정 가능한 문제들 처리
    for (const issue of issues) {
      console.log(chalk.blue(`🔧 Attempting to fix "${issue.message}"...`));

      let wasFixed = false;

      switch (issue.category) {
        case 'scripts':
          if (issue.message.includes('dev script')) {
            wasFixed = await fixMissingDevScript(projectPath);
          } else if (issue.message.includes('build script')) {
            wasFixed = await fixMissingBuildScript(projectPath);
          }
          break;

        case 'config':
          if (issue.message.includes('.env.example')) {
            wasFixed = await fixMissingEnvExample(projectPath);
          }
          break;

        case 'security':
          if (issue.message.includes('vulnerabilities')) {
            wasFixed = await fixSecurityVulnerabilities(projectPath);
          }
          break;

        case 'structure':
          if (issue.message.includes('src directory')) {
            wasFixed = await fixMissingSrcDirectory(projectPath);
          }
          break;

        default:
          console.log(chalk.gray(`   ⏭️  Cannot auto-fix (manual work required)`));
          continue;
      }

      if (wasFixed) {
        console.log(chalk.green(`   ✅ Fixed!`));
        fixed++;
      } else {
        console.log(chalk.yellow(`   ⚠️  Fix failed or already correct`));
      }

      console.log('');
    }

    // 3. 결과 요약
    console.log(chalk.blue.bold('📊 Fix results:'));
    console.log(chalk.gray(`   Fixed issues: ${fixed}/${issues.length}`));
    console.log(chalk.gray(`   Remaining issues: ${issues.length - fixed}`));

    if (fixed > 0) {
      console.log(chalk.green('\n🎉 Project has been improved!'));
      console.log(chalk.blue('💡 Run "npm run analyze health" to check again.'));
    }

    if (issues.length - fixed > 0) {
      console.log(chalk.yellow('\n⚠️  Some issues require manual resolution.'));
      console.log(chalk.blue('💡 Run "npm run analyze report" for detailed information.'));
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error(chalk.red.bold(`❌ ${error.message}`));
      if (error.hint) {
        console.error(chalk.yellow(`💡 ${error.hint}`));
      }
      process.exit(1);
    }

    console.error(chalk.red.bold('❌ 예상치 못한 오류 발생:'));
    console.error(error.stack || error.message);
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const autoFix = args.includes('--auto') || args.includes('-a');

  if (args.includes('--help') || args.includes('-h')) {
    console.log(chalk.blue.bold('\nProject Doctor Tool\n'));
    console.log('Usage: npm run project-doctor [options]\n');
    console.log('Options:');
    console.log('  --auto, -a    Automatically fix issues without prompting');
    console.log('  --help, -h    Show this help message\n');
    console.log('Example:');
    console.log('  npm run project-doctor        # Interactive fixing');
    console.log('  npm run project-doctor --auto # Auto-fix all possible issues');
    return;
  }

  await doctorProject(process.cwd(), autoFix);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
