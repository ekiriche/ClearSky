import { describe, it, expect } from 'vitest';
import { upsertHistoryItem } from './historyUtils';
import type { HistoryItem } from '../types';

const item = (city: string, searchedAt = 1000): HistoryItem => ({ city, searchedAt });

describe('upsertHistoryItem', () => {
  it('prepends new item when no match exists', () => {
    const history = [item('Paris'), item('Tokyo')];
    const result = upsertHistoryItem(history, item('London', 2000));
    expect(result).toEqual([item('London', 2000), item('Paris'), item('Tokyo')]);
  });

  it('removes exact case match and prepends new item', () => {
    const history = [item('Paris'), item('London', 1000), item('Tokyo')];
    const result = upsertHistoryItem(history, item('London', 2000));
    expect(result).toEqual([item('London', 2000), item('Paris'), item('Tokyo')]);
  });

  it('removes case-insensitive match and prepends new item', () => {
    const history = [item('Paris'), item('london', 1000), item('Tokyo')];
    const result = upsertHistoryItem(history, item('London', 2000));
    expect(result).toEqual([item('London', 2000), item('Paris'), item('Tokyo')]);
  });

  it('handles match at index 0', () => {
    const history = [item('London', 1000), item('Paris'), item('Tokyo')];
    const result = upsertHistoryItem(history, item('London', 2000));
    expect(result).toEqual([item('London', 2000), item('Paris'), item('Tokyo')]);
  });

  it('handles match at last index', () => {
    const history = [item('Paris'), item('Tokyo'), item('London', 1000)];
    const result = upsertHistoryItem(history, item('London', 2000));
    expect(result).toEqual([item('London', 2000), item('Paris'), item('Tokyo')]);
  });

  it('does not mutate the original history array', () => {
    const history = [item('Paris'), item('Tokyo')];
    const original = [...history];
    upsertHistoryItem(history, item('London', 2000));
    expect(history).toEqual(original);
  });

  it('works with empty history', () => {
    const result = upsertHistoryItem([], item('London', 2000));
    expect(result).toEqual([item('London', 2000)]);
  });
});
