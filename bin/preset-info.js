#!/usr/bin/env node

/**
 * DevTools presets information viewer
 */

import { PRESETS, BENCHMARKS, calculatePresetPerformance } from './presets.js';
import chalk from 'chalk';

function displayPresetInfo() {
  console.log(chalk.blue.bold('\n📦 Available DevTools Presets\n'));

  Object.entries(PRESETS).forEach(([key, preset]) => {
    console.log(chalk.green.bold(`${preset.name}`));
    console.log(chalk.gray(`  ${preset.description}`));
    console.log(chalk.yellow('  Included tools:'));

    Object.entries(preset.defaultTools).forEach(([category, tool]) => {
      console.log(chalk.gray(`    ${category}: ${tool}`));
    });

    console.log('');
  });
}

function displayBenchmarks() {
  console.log(chalk.blue.bold('\n⚡ Performance Benchmarks\n'));

  Object.entries(BENCHMARKS).forEach(([template, tools]) => {
    console.log(chalk.green.bold(`Template: ${template}`));

    Object.entries(tools).forEach(([tool, benchmark]) => {
      console.log(chalk.yellow(`  ${tool}:`));
      console.log(
        chalk.gray(
          `    Build time: ${benchmark.buildTime || benchmark.testTime || benchmark.lintTime || 'N/A'}`,
        ),
      );
      console.log(chalk.gray(`    Improvement: ${benchmark.improvement}`));
      console.log(chalk.gray(`    ${benchmark.description}`));
    });

    console.log('');
  });
}

function main() {
  const args = process.argv.slice(2);

  if (args.includes('--benchmarks') || args.includes('-b')) {
    displayBenchmarks();
  } else if (args.includes('--help') || args.includes('-h')) {
    console.log(chalk.blue.bold('\nDevTools Presets Information\n'));
    console.log('Usage: node bin/preset-info.js [options]\n');
    console.log('Options:');
    console.log('  --benchmarks, -b    Show performance benchmarks');
    console.log('  --help, -h          Show this help message\n');
  } else {
    displayPresetInfo();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
