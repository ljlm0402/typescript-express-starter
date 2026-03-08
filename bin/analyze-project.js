#!/usr/bin/env node

/**
 * Project analysis and health check CLI tool
 */

import {
  checkProjectHealth,
  checkDependencyUpdates,
  generateProjectReport,
  readProjectMetadata,
} from './project-health.js';
import { ValidationError } from './errors.js';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

async function analyzeProject(templateName = null) {
  let projectPath = process.cwd();

  // 템플릿 이름이 제공되면, 해당 템플릿 폴더를 분석
  if (templateName) {
    projectPath = path.join(process.cwd(), 'templates', templateName);
    if (!fs.existsSync(projectPath)) {
      console.log(chalk.red(`❌ Template "${templateName}" not found`));
      process.exit(1);
    }
  }

  console.log(chalk.blue.bold('\n🔍 Starting project analysis...\n'));

  try {
    // 1. 프로젝트 메타데이터 확인
    const metadata = readProjectMetadata(projectPath);
    if (!metadata) {
      console.log(chalk.yellow('⚠️  Project metadata not found.'));
      console.log(
        chalk.gray('   이 프로젝트는 typescript-express-starter로 생성되지 않은 것 같습니다.\n'),
      );
      return;
    }

    console.log(chalk.green('✅ Project metadata verified'));
    console.log(chalk.gray(`   Template: ${metadata.template.name}`));
    console.log(chalk.gray(`   ORM: ${metadata.template.orm || 'None'}`));
    console.log(chalk.gray(`   Created: ${new Date(metadata.createdAt).toLocaleDateString()}`));
    console.log('');

    // 2. 건강도 체크
    console.log(chalk.blue('🏥 Checking project health...'));
    const health = await checkProjectHealth(projectPath);

    console.log(chalk.green(`✅ Health score: ${health.score}/100`));

    if (health.issues.length > 0) {
      console.log(chalk.yellow('\n⚠️  Issues found:'));
      health.issues.forEach((issue) => {
        const icon = issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : 'ℹ️';
        console.log(chalk.gray(`   ${icon} ${issue.message}`));
        console.log(chalk.blue(`      💡 ${issue.recommendation}`));
      });
    }

    // 3. 의존성 업데이트 체크
    console.log(chalk.blue('\n📦 Checking dependency updates...'));
    const dependencies = await checkDependencyUpdates(projectPath);

    if (dependencies && Object.keys(dependencies.updateAvailable).length > 0) {
      console.log(
        chalk.yellow(
          `⚠️  ${Object.keys(dependencies.updateAvailable).length}개 패키지 업데이트 가능:`,
        ),
      );
      Object.entries(dependencies.updateAvailable).forEach(([pkg, info]) => {
        console.log(chalk.gray(`   ${pkg}: ${info.current} → ${info.latest}`));
      });
      console.log(chalk.blue('\n   💡 Update: npm update'));
    } else {
      console.log(chalk.green('✅ All dependencies are up to date.'));
    }

    // 4. 요약
    console.log(chalk.blue.bold('\n📊 Summary:'));
    console.log(chalk.gray(`   Health: ${health.score}/100`));
    console.log(
      chalk.gray(
        `   문제점: ${health.issues.filter((i) => i.type === 'error' || i.type === 'warning').length}개`,
      ),
    );
    console.log(
      chalk.gray(
        `   업데이트 가능: ${dependencies ? Object.keys(dependencies.updateAvailable).length : 0}개`,
      ),
    );

    if (health.score < 80) {
      console.log(
        chalk.yellow('\n💡 프로젝트 개선을 위해 "npm run project-doctor"를 실행해보세요.'),
      );
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

async function generateReport(projectPath = process.cwd(), format = 'console') {
  try {
    const report = generateProjectReport(projectPath);

    if (format === 'json') {
      console.log(JSON.stringify(report, null, 2));
      return;
    }

    // Console format
    console.log(chalk.blue.bold('\n📋 Project Report\n'));

    console.log(chalk.green.bold('📂 Project Info:'));
    console.log(chalk.gray(`   Template: ${report.projectInfo.template.name}`));
    console.log(chalk.gray(`   ORM: ${report.projectInfo.template.orm || 'None'}`));
    console.log(
      chalk.gray(`   DevTools: ${report.projectInfo.devtools.selected.join(', ') || 'None'}`),
    );
    console.log(chalk.gray(`   Project age: ${report.projectInfo.age}`));

    console.log(chalk.green.bold('\n🏥 Health:'));
    console.log(chalk.gray(`   Score: ${report.summary.healthScore}/100`));
    console.log(
      chalk.gray(
        `   마지막 체크: ${report.summary.lastHealthCheck ? new Date(report.summary.lastHealthCheck).toLocaleString() : 'Never'}`,
      ),
    );

    if (report.summary.recommendations.length > 0) {
      console.log(chalk.green.bold('\n💡 Key recommendations:'));
      report.summary.recommendations.forEach((rec) => {
        console.log(chalk.gray(`   • ${rec}`));
      });
    }

    console.log(chalk.green.bold('\n📦 Dependencies:'));
    console.log(chalk.gray(`   Updateable: ${report.summary.outdatedDependencies} packages`));
    console.log(chalk.gray(`   Security issues: ${report.summary.securityIssues} issues`));
  } catch (error) {
    console.error(chalk.red.bold('❌ 리포트 생성 실패:'));
    console.error(error.message);
    process.exit(1);
  }
}

function showHelp() {
  console.log(chalk.blue.bold('\nProject Analysis Tool (Developer Edition)\n'));
  console.log('Usage: npm run analyze [template-name] | [command] [options]\n');
  console.log('Template Analysis (Developer Tool):');
  console.log('  <template-name>           Analyze specific template in templates/ folder');
  console.log('                            Example: npm run analyze default');
  console.log('                            Example: npm run analyze prisma-postgresql\n');
  console.log('Project Analysis:');
  console.log('  health                    Run health check on current project');
  console.log('  report                    Generate detailed project report');
  console.log('  report --json             Generate report in JSON format');
  console.log('  help                      Show this help message\n');
  console.log('Examples:');
  console.log('  npm run analyze default              # Analyze default template');
  console.log('  npm run analyze prisma-postgresql    # Analyze Prisma template');
  console.log('  npm run analyze health               # Check current project');
  console.log('  npm run analyze report               # Generate project report');
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'health';

  switch (command) {
    case 'health':
      // 두 번째 인자로 템플릿 이름 받기
      const templateName = args[1];
      await analyzeProject(templateName);
      break;
    case 'report':
      const format = args.includes('--json') ? 'json' : 'console';
      await generateReport(process.cwd(), format);
      break;
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;
    default:
      // 첨엇 인자가 템플릿 이름일 가능성 체크
      const templatesPath = path.resolve(process.cwd(), 'templates');
      const templatePath = path.join(templatesPath, command);

      if (fs.existsSync(templatePath)) {
        console.log(chalk.cyan(`Analyzing template: ${command}`));
        await analyzeProject(command);
      } else {
        console.log(chalk.red(`Unknown command: ${command}`));
        showHelp();
        process.exit(1);
      }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
