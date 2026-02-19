// src/example/timeline.ts

import { SplayNode, SplayTree } from '../splay';

export interface Interval {
  l: number;
  r: number;
  id: number;
  callback?: () => void;
}

export class TimelineNode extends SplayNode<Interval, TimelineNode> {
  maxR: number;

  constructor(key: Interval) {
    super(key);
    this.maxR = key.r;
  }

  pushup(): void {
    let m = this.key.r;
    if (this.left) m = Math.max(m, this.left.maxR);
    if (this.right) m = Math.max(m, this.right.maxR);
    this.maxR = m;
  }
}

/**
 * Finds all intervals that contain the time `t` (l <= t <= r).
 * Optimized to only visit relevant nodes.
 * Splays the last accessed node to maintain amortized complexity.
 */
export function queryIntervals(tree: SplayTree<Interval, TimelineNode>, t: number): Interval[] {
  const result: Interval[] = [];
  let lastVisited: TimelineNode | null = null;

  function query(node: TimelineNode | null) {
    if (!node) return;
    lastVisited = node;

    // Pruning 1: If subtree's max R is less than t, no interval here can cover t.
    if (node.maxR < t) return;

    // Pruning 2: If current node's L is greater than t, then ALL nodes in the right subtree
    // have L > node.l > t. So they cannot contain t.
    // Only search left.
    if (node.key.l > t) {
      query(node.left);
      return;
    }

    // If node.key.l <= t:

    // Check current node
    if (node.key.r >= t) {
      result.push(node.key);
    }

    // Search left (always candidates for l <= t, maxR check will handle the rest)
    query(node.left);

    // Search right (candidates where l <= t might exist)
    query(node.right);
  }

  query(tree.root);

  if (lastVisited) {
    tree.splay(lastVisited);
  }

  return result;
}
