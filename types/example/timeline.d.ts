import { SplayNode, SplayTree } from '../splay';
export interface Interval {
    l: number;
    r: number;
    id: number;
    callback?: () => void;
}
export declare class TimelineNode extends SplayNode<Interval, TimelineNode> {
    maxR: number;
    constructor(key: Interval);
    pushup(): void;
}
/**
 * Finds all intervals that contain the time `t` (l <= t <= r).
 * Optimized to only visit relevant nodes.
 * Splays the last accessed node to maintain amortized complexity.
 */
export declare function queryIntervals(tree: SplayTree<Interval, TimelineNode>, t: number): Interval[];
