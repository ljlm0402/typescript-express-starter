/**
 * DevTools 설정 병합 시스템
 * Phase 3 - 빌드/테스트 도구 최적화
 */

import fs from 'fs';
import path from 'path';

/**
 * 깊은 객체 병합 함수
 * @param {object} target - 대상 객체
 * @param {...object} sources - 병합할 소스 객체들
 * @returns {object} 병합된 객체
 */
function deepMerge(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

/**
 * 객체 여부 확인 함수
 * @param {any} item - 확인할 항목
 * @returns {boolean} 객체 여부
 */
function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * 설정 파일을 읽는 함수 (개선된 버전)
 * @param {string} configPath - 설정 파일 경로
 * @returns {object|null} 파싱된 설정 객체 또는 null
 */
function readConfig(configPath) {
  try {
    const fullPath = path.resolve(configPath);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const ext = path.extname(fullPath);
    const content = fs.readFileSync(fullPath, 'utf8');

    switch (ext) {
      case '.json':
        return JSON.parse(content);

      case '.js':
      case '.mjs':
        // 동적 import로 ES 모듈 지원
        delete require.cache[fullPath];
        return require(fullPath);

      case '.ts':
        // TypeScript 파일의 경우 빌드된 JS 파일을 찾아 사용
        const jsPath = fullPath.replace('.ts', '.js');
        if (fs.existsSync(jsPath)) {
          delete require.cache[jsPath];
          return require(jsPath);
        }
        throw new Error(`TypeScript config found but no compiled JS file: ${jsPath}`);

      case '.swcrc':
      case '.babelrc':
        return JSON.parse(content);

      default:
        // 확장자가 없거나 인식되지 않는 경우 JSON으로 시도
        try {
          return JSON.parse(content);
        } catch {
          // JSON이 아닌 경우 문자열로 반환
          return { content };
        }
    }
  } catch (error) {
    console.warn(`Failed to read config file ${configPath}:`, error.message);
    return null;
  }
}

/**
 * 도구별 계층화된 설정을 병합하는 함수 (개선된 버전)
 * @param {string} tool - 도구 이름 (swc, tsup, jest, vitest 등)
 * @param {string} template - 템플릿 이름
 * @returns {object} 병합된 설정 객체
 */
export function mergeConfigs(tool, template) {
  const devtoolsPath = path.join(process.cwd(), 'devtools');

  // 1. 기본 설정 읽기
  const basePath = path.join(devtoolsPath, getToolPath(tool), 'base', `base.${getConfigExtension(tool)}`);
  const baseConfig = readConfig(basePath) || {};

  // 2. 템플릿별 설정 읽기
  const templatePath = path.join(devtoolsPath, getToolPath(tool), template, `${template}.${getConfigExtension(tool)}`);
  const templateConfig = readConfig(templatePath) || {};

  // 3. 오버라이드 설정 읽기
  const ormName = template.split('-')[0];
  const overridePath = path.join(devtoolsPath, getToolPath(tool), 'overrides', `${ormName}.${getConfigExtension(tool)}`);
  const overrideConfig = readConfig(overridePath) || {};

  // 4. ORM별 공통 설정 읽기 (해당하는 경우)
  const ormPath = path.join(devtoolsPath, getToolPath(tool), 'orm-templates', `${ormName}.${getConfigExtension(tool)}`);
  const ormConfig = readConfig(ormPath) || {};

  // 설정 병합: base → template → orm → override 순서
  const mergedConfig = deepMerge({}, baseConfig, templateConfig, ormConfig, overrideConfig);

  // 설정 후처리 (도구별 특화)
  return postProcessConfig(tool, template, mergedConfig);
}

/**
 * 도구별 설정 후처리 함수
 * @param {string} tool - 도구 이름
 * @param {string} template - 템플릿 이름
 * @param {object} config - 병합된 설정
 * @returns {object} 후처리된 설정
 */
function postProcessConfig(tool, template, config) {
  switch (tool) {
    case 'swc':
      return postProcessSwcConfig(template, config);
    case 'tsup':
      return postProcessTsupConfig(template, config);
    case 'jest':
      return postProcessJestConfig(template, config);
    case 'vitest':
      return postProcessVitestConfig(template, config);
    default:
      return config;
  }
}

/**
 * SWC 설정 후처리
 */
function postProcessSwcConfig(template, config) {
  // 템플릿별 최적화 적용
  if (template.includes('mongodb')) {
    config.jsc.loose = true; // MongoDB는 loose 모드 활용
  }

  if (template.includes('prisma')) {
    config.exclude = config.exclude || [];
    if (!config.exclude.includes('prisma/migrations/**/*')) {
      config.exclude.push('prisma/migrations/**/*');
    }
  }

  return config;
}

/**
 * TSUP 설정 후처리
 */
function postProcessTsupConfig(template, config) {
  // ORM별 외부 의존성 설정
  const ormName = template.split('-')[0];
  const ormExternals = {
    'prisma': ['@prisma/client'],
    'drizzle': ['drizzle-orm', 'drizzle-kit'],
    'typeorm': ['typeorm', 'reflect-metadata'],
    'mikroorm': ['@mikro-orm/core', 'reflect-metadata'],
    'mongoose': ['mongoose']
  };

  if (ormExternals[ormName]) {
    config.external = [...(config.external || []), ...ormExternals[ormName]];
  }

  return config;
}

/**
 * Jest 설정 후처리
 */
function postProcessJestConfig(template, config) {
  // 템플릿별 테스트 환경 설정
  const ormName = template.split('-')[0];

  if (['typeorm', 'mikroorm'].includes(ormName)) {
    config.testTimeout = config.testTimeout || 30000; // Decorator 처리 시간
  } else if (['drizzle', 'prisma'].includes(ormName)) {
    config.testTimeout = config.testTimeout || 20000;
  }

  return config;
}

/**
 * Vitest 설정 후처리
 */
function postProcessVitestConfig(template, config) {
  // 템플릿별 성능 최적화
  const ormName = template.split('-')[0];

  // TypeORM은 싱글스레드, 나머지는 멀티스레드
  if (ormName === 'typeorm') {
    config.test = config.test || {};
    config.test.poolOptions = config.test.poolOptions || {};
    config.test.poolOptions.threads = { singleThread: true, isolate: true };
  }

  return config;
}
    console.warn(`Warning: Could not read config file ${configPath}:`, error.message);
    return {};
  }
}

/**
 * 객체 깊은 병합 함수
 * @param {...object} sources - 병합할 객체들
 * @returns {object} 병합된 객체
 */
export function deepMerge(...sources) {
  if (sources.length === 0) return {};
  if (sources.length === 1) return sources[0];

  const [target, ...rest] = sources;
  const result = { ...target };

  for (const source of rest) {
    if (!source || typeof source !== 'object') continue;

    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        if (
          result[key] &&
          typeof result[key] === 'object' &&
          typeof source[key] === 'object' &&
          !Array.isArray(result[key]) &&
          !Array.isArray(source[key])
        ) {
          result[key] = deepMerge(result[key], source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }
  }

  return result;
}

/**
 * 템플릿별 설정을 병합하는 함수
 * @param {string} tool - 도구 이름 (swc, jest, vitest 등)
 * @param {string} template - 템플릿 이름
 * @returns {object} 병합된 설정
 */
export function mergeConfigs(tool, template) {
  const devtoolsPath = path.resolve(process.cwd(), 'devtools');

  // 1. 기본 설정 읽기
  let baseConfig = {};
  try {
    if (tool === 'swc') {
      baseConfig = readConfig(path.join(devtoolsPath, 'build/swc/base/base.swcrc'));
    } else if (tool === 'tsup') {
      baseConfig = readConfig(path.join(devtoolsPath, 'build/tsup/base/base.tsup.config.ts'));
    } else if (tool === 'jest') {
      baseConfig = readConfig(path.join(devtoolsPath, 'test/jest/jest.config.cjs'));
    } else if (tool === 'vitest') {
      baseConfig = readConfig(path.join(devtoolsPath, 'test/vitest/vitest.config.ts'));
    }
  } catch (error) {
    console.warn(`Warning: Could not read base config for ${tool}:`, error.message);
  }

  // 2. 템플릿별 설정 읽기
  let templateConfig = {};
  try {
    if (tool === 'swc') {
      const templatePath = path.join(devtoolsPath, `build/swc/${template}/${template}.swcrc`);
      if (fs.existsSync(templatePath)) {
        templateConfig = readConfig(templatePath);
      }
    } else if (tool === 'tsup') {
      const templatePath = path.join(devtoolsPath, `build/tsup/${template}/${template}.tsup.config.ts`);
      if (fs.existsSync(templatePath)) {
        templateConfig = readConfig(templatePath);
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not read template config for ${tool}/${template}:`, error.message);
  }

  // 3. 오버라이드 설정 읽기
  let overrideConfig = {};
  try {
    if (tool === 'swc') {
      const overridePath = path.join(devtoolsPath, `build/swc/overrides/${template}.swcrc`);
      if (fs.existsSync(overridePath)) {
        overrideConfig = readConfig(overridePath);
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not read override config for ${tool}/${template}:`, error.message);
  }

  // 4. 설정 병합
  return deepMerge(baseConfig, templateConfig, overrideConfig);
}

/**
 * 설정을 파일로 저장하는 함수
 * @param {string} filePath - 저장할 파일 경로
 * @param {object} config - 저장할 설정 객체
 * @param {string} format - 파일 형식 (json, js)
 */
export function saveConfig(filePath, config, format = 'json') {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (format === 'json') {
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
  } else if (format === 'js') {
    const content = `export default ${JSON.stringify(config, null, 2)};`;
    fs.writeFileSync(filePath, content);
  } else {
    // 문자열로 저장
    fs.writeFileSync(filePath, config.toString());
  }
}

/**
 * 모든 템플릿에 대해 특정 도구의 설정을 생성하는 함수
 * @param {string} tool - 도구 이름
 * @param {string[]} templates - 템플릿 목록
 * @returns {object} 템플릿별 설정 맵
 */
export function generateAllConfigs(tool, templates) {
  const configs = {};

  for (const template of templates) {
    try {
      configs[template] = mergeConfigs(tool, template);
    } catch (error) {
      console.error(`Error generating config for ${tool}/${template}:`, error.message);
      configs[template] = {};
    }
  }

  return configs;
}