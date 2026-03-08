#!/usr/bin/env node

/**
 * Performance Profiler - Benchmark and optimize project performance
 */

import { updateProjectMetadata, readProjectMetadata } from './project-health.js';
import { BENCHMARKS } from './presets.js';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Measure build performance
 */
async function measureBuildPerformance(projectPath) {
  console.log(chalk.blue('⏱️  Measuring build performance...'));

  const pkgPath = path.join(projectPath, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  if (!pkg.scripts || !pkg.scripts.build) {
    throw new Error('Build script not found in package.json');
  }

  const buildScript = pkg.scripts.build;
  const startTime = Date.now();

  try {
    // Clean previous build
    const distPath = path.join(projectPath, 'dist');
    if (fs.existsSync(distPath)) {
      fs.rmSync(distPath, { recursive: true, force: true });
    }

    // Run build
    await execAsync('npm run build', { cwd: projectPath });

    const endTime = Date.now();
    const buildTime = (endTime - startTime) / 1000;

    // Measure bundle size
    let bundleSize = 0;
    if (fs.existsSync(distPath)) {
      const files = fs.readdirSync(distPath, { recursive: true });
      files.forEach((file) => {
        if (typeof file === 'string') {
          const filePath = path.join(distPath, file);
          if (fs.statSync(filePath).isFile()) {
            bundleSize += fs.statSync(filePath).size;
          }
        }
      });
    }

    console.log(chalk.green(`   ✅ Build completed: ${buildTime.toFixed(2)}s`));
    console.log(chalk.gray(`   📦 Bundle size: ${(bundleSize / 1024).toFixed(2)} KB`));

    return {
      buildTime: `${buildTime.toFixed(2)}s`,
      bundleSize: `${(bundleSize / 1024).toFixed(2)} KB`,
      tool: detectBuildTool(buildScript),
    };
  } catch (error) {
    console.log(chalk.red(`   ❌ Build failed: ${error.message}`));
    throw error;
  }
}

/**
 * Measure test performance
 */
async function measureTestPerformance(projectPath) {
  console.log(chalk.blue('🧪 Measuring test performance...'));

  const pkgPath = path.join(projectPath, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  if (!pkg.scripts || (!pkg.scripts.test && !pkg.scripts['test:ci'])) {
    console.log(chalk.yellow('   ⚠️  Test script not found.'));
    return null;
  }

  const testScript = pkg.scripts['test:ci'] || pkg.scripts.test;
  const startTime = Date.now();

  try {
    // Run tests (with CI flag to avoid watch mode)
    const command = testScript.includes('jest')
      ? 'npx jest --passWithNoTests'
      : testScript.includes('vitest')
        ? 'npx vitest run --reporter=verbose'
        : 'npm run test:ci';

    const { stdout } = await execAsync(command, { cwd: projectPath });

    const endTime = Date.now();
    const testTime = (endTime - startTime) / 1000;

    // Extract test results
    const testResults = parseTestResults(stdout, testScript);

    console.log(chalk.green(`   ✅ Tests completed: ${testTime.toFixed(2)}s`));
    console.log(
      chalk.gray(`   📊 Test results: ${testResults.passed}/${testResults.total} passed`),
    );

    return {
      testTime: `${testTime.toFixed(2)}s`,
      testsTotal: testResults.total,
      testsPassed: testResults.passed,
      tool: detectTestTool(testScript),
    };
  } catch (error) {
    console.log(chalk.yellow(`   ⚠️  Test execution failed (code may have issues)`));
    return {
      testTime: 'Failed',
      testsTotal: 0,
      testsPassed: 0,
      tool: detectTestTool(testScript),
    };
  }
}

/**
 * Compare with benchmark data
 */
function compareBenchmarks(projectPath, performance) {
  const metadata = readProjectMetadata(projectPath);
  if (!metadata) return null;

  const templateName = metadata.template.name;
  const templateBenchmarks = BENCHMARKS[templateName];

  if (!templateBenchmarks) return null;

  const comparison = {};

  // Compare build performance
  if (performance.build && templateBenchmarks[performance.build.tool]) {
    const benchmark = templateBenchmarks[performance.build.tool];
    const actualTime = parseFloat(performance.build.buildTime);
    const benchmarkTime = parseFloat(benchmark.buildTime);

    comparison.build = {
      tool: performance.build.tool,
      actual: actualTime,
      benchmark: benchmarkTime,
      performance: actualTime <= benchmarkTime ? 'good' : 'poor',
      difference: (((actualTime - benchmarkTime) / benchmarkTime) * 100).toFixed(1),
    };
  }

  // Compare test performance
  if (performance.test && templateBenchmarks[performance.test.tool]) {
    const benchmark = templateBenchmarks[performance.test.tool];
    const actualTime = parseFloat(performance.test.testTime);
    const benchmarkTime = parseFloat(benchmark.testTime || benchmark.buildTime);

    comparison.test = {
      tool: performance.test.tool,
      actual: actualTime,
      benchmark: benchmarkTime,
      performance: actualTime <= benchmarkTime ? 'good' : 'poor',
      difference: (((actualTime - benchmarkTime) / benchmarkTime) * 100).toFixed(1),
    };
  }

  return comparison;
}

/**
 * Generate performance recommendations
 */
function generateRecommendations(projectPath, performance, comparison) {
  const recommendations = [];

  // Build recommendations
  if (comparison?.build?.performance === 'poor') {
    recommendations.push({
      category: 'build',
      priority: 'high',
      message: `빌드 시간이 예상보다 ${comparison.build.difference}% 느립니다`,
      action: 'SWC로 컴파일러 변경을 고려해보세요 (3x 빠른 빌드)',
    });
  }

  // Test recommendations
  if (comparison?.test?.performance === 'poor') {
    recommendations.push({
      category: 'test',
      priority: 'medium',
      message: `테스트 실행 시간이 예상보다 ${comparison.test.difference}% 느립니다`,
      action: 'Vitest로 테스트 도구 변경을 고려해보세요 (5x 빠른 테스트)',
    });
  }

  // Bundle size recommendations
  if (performance.build?.bundleSize) {
    const bundleSizeKB = parseFloat(performance.build.bundleSize);
    if (bundleSizeKB > 1000) {
      // > 1MB
      recommendations.push({
        category: 'bundle',
        priority: 'medium',
        message: `Bundle size is large (${performance.build.bundleSize})`,
        action: 'Use TSUP tree-shaking features to reduce bundle size',
      });
    }
  }

  return recommendations;
}

/**
 * Main profiler function
 */
async function profileProject(projectPath = process.cwd()) {
  console.log(chalk.blue.bold('\n⚡ Starting performance profiling...\n'));

  try {
    const performance = {};

    // 1. Build performance
    try {
      performance.build = await measureBuildPerformance(projectPath);
    } catch (error) {
      console.log(chalk.yellow(`⚠️  Build performance measurement failed: ${error.message}`));
    }

    // 2. Test performance
    try {
      performance.test = await measureTestPerformance(projectPath);
    } catch (error) {
      console.log(chalk.yellow(`⚠️  Test performance measurement failed: ${error.message}`));
    }

    // 3. Compare with benchmarks
    const comparison = compareBenchmarks(projectPath, performance);

    // 4. Generate recommendations
    const recommendations = generateRecommendations(projectPath, performance, comparison);

    // 5. Update metadata
    const performanceData = {
      buildTime: performance.build?.buildTime || null,
      testTime: performance.test?.testTime || null,
      bundleSize: performance.build?.bundleSize || null,
      lastBenchmark: new Date().toISOString(),
    };

    updateProjectMetadata(projectPath, { performance: performanceData });

    // 6. Display results
    console.log(chalk.blue.bold('\n📊 Performance results:\n'));

    if (performance.build) {
      console.log(chalk.green.bold('🔨 Build performance:'));
      console.log(chalk.gray(`   Time: ${performance.build.buildTime}`));
      console.log(chalk.gray(`   Bundle size: ${performance.build.bundleSize}`));
      console.log(chalk.gray(`   Tool: ${performance.build.tool}`));

      if (comparison?.build) {
        const perfIcon = comparison.build.performance === 'good' ? '🟢' : '🔴';
        console.log(chalk.gray(`   vs. Benchmark: ${perfIcon} ${comparison.build.difference}%`));
      }
      console.log('');
    }

    if (performance.test) {
      console.log(chalk.green.bold('🧪 Test performance:'));
      console.log(chalk.gray(`   Time: ${performance.test.testTime}`));
      console.log(
        chalk.gray(`   Passed: ${performance.test.testsPassed}/${performance.test.testsTotal}`),
      );
      console.log(chalk.gray(`   Tool: ${performance.test.tool}`));

      if (comparison?.test) {
        const perfIcon = comparison.test.performance === 'good' ? '🟢' : '🔴';
        console.log(chalk.gray(`   vs. Benchmark: ${perfIcon} ${comparison.test.difference}%`));
      }
      console.log('');
    }

    if (recommendations.length > 0) {
      console.log(chalk.yellow.bold('💡 Performance improvement recommendations:\n'));
      recommendations.forEach((rec, index) => {
        const priorityIcon = rec.priority === 'high' ? '🔴' : '🟡';
        console.log(chalk.yellow(`   ${index + 1}. ${priorityIcon} ${rec.message}`));
        console.log(chalk.blue(`      ➡️  ${rec.action}`));
        console.log('');
      });
    } else {
      console.log(chalk.green('🎉 Excellent performance! No additional optimization needed.'));
    }
  } catch (error) {
    console.error(chalk.red.bold('❌ 프로파일링 실패:'));
    console.error(error.stack || error.message);
    process.exit(1);
  }
}

/**
 * Helper functions
 */
function detectBuildTool(buildScript) {
  if (buildScript.includes('swc')) return 'swc';
  if (buildScript.includes('tsup')) return 'tsup';
  if (buildScript.includes('tsc')) return 'tsc';
  return 'unknown';
}

function detectTestTool(testScript) {
  if (testScript.includes('jest')) return 'jest';
  if (testScript.includes('vitest')) return 'vitest';
  return 'unknown';
}

function parseTestResults(output, tool) {
  const defaultResult = { total: 0, passed: 0 };

  try {
    if (tool.includes('jest')) {
      const match = output.match(/Tests:\s+(\d+)\s+passed,\s+(\d+)\s+total/);
      if (match) {
        return { passed: parseInt(match[1]), total: parseInt(match[2]) };
      }
    } else if (tool.includes('vitest')) {
      const match = output.match(/Test Files\s+\d+\s+passed[^T]*Tests\s+(\d+)\s+passed/s);
      if (match) {
        const passed = parseInt(match[1]);
        return { passed, total: passed }; // Vitest output format is different
      }
    }
  } catch (error) {
    // Ignore parsing errors
  }

  return defaultResult;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(chalk.blue.bold('\nPerformance Profiler\n'));
    console.log('Usage: npm run profile [options]\n');
    console.log('This tool measures build and test performance of your project.');
    console.log('It compares results with benchmarks and provides optimization recommendations.\n');
    console.log('Example:');
    console.log('  npm run profile    # Run full performance analysis');
    return;
  }

  await profileProject();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
