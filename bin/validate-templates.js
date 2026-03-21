#!/usr/bin/env node

/**
 * Template integrity validation script
 */

import { validateAllTemplates, cleanTemplate } from './validators.js';
import { ValidationError } from './errors.js';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';

async function main() {
  console.log(chalk.blue.bold('\n🔍 Starting template integrity validation...\n'));

  try {
    const results = validateAllTemplates();
    const templatesWithViolations = Object.entries(results).filter(([_, result]) => !result.valid);

    if (templatesWithViolations.length === 0) {
      console.log(chalk.green('✅ All templates passed integrity validation!'));
      return;
    }

    console.log(
      chalk.yellow.bold(`⚠️  ${templatesWithViolations.length}개 템플릿에서 무결성 위반 발견:\n`),
    );

    for (const [templateName, result] of templatesWithViolations) {
      console.log(chalk.red(`❌ ${templateName}:`));
      result.violations.forEach((violation) => {
        console.log(chalk.gray(`   - ${violation}`));
      });
      console.log('');
    }

    // Ask for cleanup
    const templateDir = path.join(process.cwd(), 'templates');
    let totalRemoved = 0;

    console.log(chalk.blue.bold('🧹 Starting template cleanup...\n'));

    for (const [templateName, _] of templatesWithViolations) {
      const templatePath = path.join(templateDir, templateName);
      const removedFiles = cleanTemplate(templatePath);

      if (removedFiles.length > 0) {
        console.log(chalk.green(`✅ Removed ${removedFiles.length} files from ${templateName}:`));
        removedFiles.forEach((file) => {
          console.log(chalk.gray(`   - ${file}`));
        });
        totalRemoved += removedFiles.length;
        console.log('');
      }
    }

    if (totalRemoved > 0) {
      console.log(chalk.blue.bold(`🎉 Total ${totalRemoved} files removed.\n`));

      // Re-validate
      console.log(chalk.blue('🔄 Re-validating...\n'));
      const revalidationResults = validateAllTemplates();
      const stillViolating = Object.entries(revalidationResults).filter(
        ([_, result]) => !result.valid,
      );

      if (stillViolating.length === 0) {
        console.log(chalk.green.bold('✅ All templates now pass integrity validation!'));
      } else {
        console.log(chalk.red.bold(`❌ Still found issues in ${stillViolating.length} templates`));
        stillViolating.forEach(([name, result]) => {
          console.log(chalk.red(`  - ${name}: ${result.violations.join(', ')}`));
        });
      }
    }
  } catch (error) {
    console.error(chalk.red.bold('❌ 예상치 못한 오류 발생:'));
    console.error(error.stack || error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
