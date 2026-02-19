/**
 * Base class for a Splay Tree Node. \
 * Users should extend this class to add custom properties and implement `pushup`.
 */
export declare abstract class SplayNode<K, Node extends SplayNode<K, Node>> {
    key: K;
    parent: Node | null;
    left: Node | null;
    right: Node | null;
    constructor(key: K);
    /**
     * Updates the node's information based on its children. \
     * This is called automatically after rotations and structural changes. \
     * Example: this.size = (this.left?.size ?? 0) + (this.right?.size ?? 0) + 1;
     */
    abstract pushup(): void;
}
/**
 * A generic Splay Tree implementation.
 */
export declare class SplayTree<K, Node extends SplayNode<K, Node>> {
    root: Node | null;
    private NodeCtor;
    private compare;
    /**
     * @param NodeCtor The constructor for the node class.
     * @param compareFn Optional comparison function. Defaults to (a, b) => a - b for numbers.
     */
    constructor(NodeCtor: new (key: K) => Node, compareFn?: (a: K, b: K) => number);
    /**
     * Helper to perform pushup on a node if it exists.
     */
    pushup(node: Node | null): void;
    /**
     * Rotates node x upwards.
     */
    rotate(x: Node): void;
    /**
     * Splays node x to the target position (root if target is null).
     */
    splay(x: Node, target?: Node | null): void;
    /**
     * Inserts a key into the tree. \
     * If the key already exists, the existing node is splayed to the root.
     */
    insert(key: K): Node;
    /**
     * Finds a key in the tree. Splays the node to root if found. \
     * If not found, splays the last accessed node to root.
     */
    find(key: K): Node | null;
    /**
     * Finds the maximum key in the tree. Splays the node to root.
     */
    findMax(): Node | null;
    /**
     * Finds the minimum key in the tree. Splays the node to root.
     */
    findMin(): Node | null;
    /**
     * Deletes a key from the tree.
     */
    delete(key: K): boolean;
    /**
     * Gets the rank of a key (number of keys strictly less than it) + 1. \
     * Assuming the user maintains a `size` property in `pushup`. \
     * Returns 0 if tree is empty. \
     * Note: This method assumes `left.size` is available. Users must implement this logic if they use rank.
     */
    rank(key: K): number;
    /**
     * Gets the k-th smallest node (1-based index). \
     * Assumes `size` property is maintained on nodes.
     */
    kth(k: number): Node | null;
    /**
     * Finds the predecessor of the given key (the largest node strictly smaller than key). \
     * Splays the found node to the root.
     */
    prev(key: K): Node | null;
    /**
     * Finds the successor of the given key (the smallest node strictly greater than key). \
     * Splays the found node to the root.
     */
    next(key: K): Node | null;
    /**
     * Joins another tree to the right of this tree. \
     * REQUIREMENT: All keys in `this` tree must be smaller than all keys in `other` tree. \
     * This operation is O(log N).
     */
    join(other: SplayTree<K, Node>): void;
    /**
     * Merges another tree into this tree. \
     * This is a general merge that inserts all nodes from `other` into `this`. \
     * Complexity: O(M log (N+M)) where M is size of other tree. \
     * Destroys the `other` tree structure.
     */
    merge(other: SplayTree<K, Node>): void;
}
