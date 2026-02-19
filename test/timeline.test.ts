import { describe, it, expect } from 'vitest';
import { SplayTree } from '../src/splay';
import { TimelineNode, Interval, queryIntervals } from '../src/example/timeline';

describe('Timeline Splay Tree', () => {
  // Compare by L, then R, then ID to handle duplicates/overlaps uniquely
  const compare = (a: Interval, b: Interval) => {
    if (a.l !== b.l) return a.l - b.l;
    if (a.r !== b.r) return a.r - b.r;
    return a.id - b.id;
  };

  const tree = new SplayTree<Interval, TimelineNode>(TimelineNode, compare);

  it('should find all overlapping intervals correctly', () => {
    const intervals = [
      { l: 1, r: 5, id: 1 },
      { l: 2, r: 8, id: 2 },
      { l: 10, r: 15, id: 3 },
      { l: 6, r: 10, id: 4 },
      { l: 4, r: 4, id: 5 }, // point interval
      { l: 1, r: 100, id: 6 }, // long interval
    ];

    // Insert all
    intervals.forEach(i => tree.insert(i));

    // Test query at t = 4
    const result4 = queryIntervals(tree, 4);
    const ids4 = result4.map(i => i.id).sort((a, b) => a - b);
    expect(ids4).toEqual([1, 2, 5, 6]);

    // Test query at t = 9
    const result9 = queryIntervals(tree, 9);
    const ids9 = result9.map(i => i.id).sort((a, b) => a - b);
    expect(ids9).toEqual([4, 6]);

    // Test query at t = 0
    const result0 = queryIntervals(tree, 0);
    expect(result0).toEqual([]);

    // Test query at t = 200
    const result200 = queryIntervals(tree, 200);
    expect(result200).toEqual([]);
  });
});
