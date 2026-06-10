import { describe, expect, it } from '@jest/globals';
import {
  applyFilter,
  parseFilterString,
  type FilterExpression,
} from '../../src/filters';
import { parseFilterString as parseFromLegacyUtils } from '../../src/utils/filters';
import type { FilterExpression as LegacyFilterExpression } from '../../src/types/filters';

describe('filter module boundaries', () => {
  it('keeps legacy parser imports compatible with the canonical module', () => {
    expect(parseFromLegacyUtils).toBe(parseFilterString);
  });

  it('parses and evaluates filters through the canonical module', () => {
    const result = parseFilterString('done = true');
    expect(result.error).toBeUndefined();

    const expression: FilterExpression = result.expression!;
    const legacyExpression: LegacyFilterExpression = expression;
    const tasks = [
      { id: 1, title: 'Open', done: false },
      { id: 2, title: 'Done', done: true },
    ];

    expect(applyFilter(tasks, legacyExpression)).toEqual([tasks[1]]);
  });
});
