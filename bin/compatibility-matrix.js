import { DEVTOOLS_VALUES, TEMPLATES_VALUES } from './common.js';

export const MATRIX_CATEGORIES = ['Linter', 'Compiler', 'Testing', 'Infrastructure'];

export function getCompatibilityMatrix() {
  const toolsByCategory = Object.fromEntries(
    MATRIX_CATEGORIES.map((category) => [
      category,
      DEVTOOLS_VALUES.filter((tool) => tool.category === category).map((tool) => tool.value),
    ]),
  );

  const combinations = [];
  for (const template of TEMPLATES_VALUES.filter((item) => item.active)) {
    for (const linter of toolsByCategory.Linter) {
      for (const compiler of toolsByCategory.Compiler) {
        for (const testing of toolsByCategory.Testing) {
          for (const infrastructure of toolsByCategory.Infrastructure) {
            combinations.push({
              template: template.value,
              linter,
              compiler,
              testing,
              infrastructure,
              devtools: [linter, compiler, testing, infrastructure],
            });
          }
        }
      }
    }
  }

  return combinations;
}

export function getMatrixId(combination) {
  return [
    combination.template,
    combination.linter,
    combination.compiler,
    combination.testing,
    combination.infrastructure,
  ].join('__');
}
