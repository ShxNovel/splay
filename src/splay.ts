// src/splay.ts

/**
 * Base class for a Splay Tree Node. \
 * Users should extend this class to add custom properties and implement `pushup`.
 */
export abstract class SplayNode<K, Node extends SplayNode<K, Node>> {
  key: K;
  parent: Node | null = null;
  left: Node | null = null;
  right: Node | null = null;

  constructor(key: K) {
    this.key = key;
  }

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
export class SplayTree<K, Node extends SplayNode<K, Node>> {
  root: Node | null = null;
  private NodeCtor: new (key: K) => Node;
  private compare: (a: K, b: K) => number;

  /**
   * @param NodeCtor The constructor for the node class.
   * @param compareFn Optional comparison function. Defaults to (a, b) => a - b for numbers.
   */
  constructor(
    NodeCtor: new (key: K) => Node,
    compareFn?: (a: K, b: K) => number
  ) {
    this.NodeCtor = NodeCtor;
    this.compare = compareFn || ((a: any, b: any) => (a > b ? 1 : a < b ? -1 : 0));
  }

  /**
   * Helper to perform pushup on a node if it exists.
   */
  pushup(node: Node | null) {
    if (node) node.pushup();
  }

  /**
   * Rotates node x upwards.
   */
  rotate(x: Node) {
    const y = x.parent!;
    const z = y.parent;
    const isLeft = y.left === x;

    if (z) {
      if (z.left === y) z.left = x;
      else z.right = x;
    }
    x.parent = z;

    if (isLeft) {
      y.left = x.right;
      if (y.left) y.left.parent = y;
      x.right = y;
    } else {
      y.right = x.left;
      if (y.right) y.right.parent = y;
      x.left = y;
    }
    y.parent = x;

    this.pushup(y);
    this.pushup(x);
  }

  /**
   * Splays node x to the target position (root if target is null).
   */
  splay(x: Node, target: Node | null = null) {
    while (x.parent !== target) {
      const y = x.parent!;
      const z = y.parent;
      if (z !== target) {
        // Zig-zig or Zig-zag
        if ((y.left === x) === (z!.left === y)) {
          this.rotate(y);
        } else {
          this.rotate(x);
        }
      }
      this.rotate(x);
    }
    if (target === null) {
      this.root = x;
    }
  }

  /**
   * Inserts a key into the tree. \
   * If the key already exists, the existing node is splayed to the root.
   */
  insert(key: K): Node {
    if (!this.root) {
      this.root = new this.NodeCtor(key);
      this.pushup(this.root);
      return this.root;
    }

    let curr = this.root;
    while (true) {
      const cmp = this.compare(key, curr.key);
      if (cmp === 0) {
        this.splay(curr);
        return curr;
      }
      const next = cmp < 0 ? curr.left : curr.right;
      if (!next) {
        const node = new this.NodeCtor(key);
        node.parent = curr;
        if (cmp < 0) curr.left = node;
        else curr.right = node;

        // this.pushup(curr);
        this.splay(node);
        return node;
      }
      curr = next;
    }
  }

  /**
   * Finds a key in the tree. Splays the node to root if found. \
   * If not found, splays the last accessed node to root.
   */
  find(key: K): Node | null {
    if (!this.root) return null;
    let curr: Node | null = this.root;
    let last = curr;
    while (curr) {
      last = curr;
      const cmp = this.compare(key, curr.key);
      if (cmp === 0) {
        this.splay(curr);
        return curr;
      }
      curr = cmp < 0 ? curr.left : curr.right;
    }
    this.splay(last);
    return null;
  }

  /**
   * Finds the maximum key in the tree. Splays the node to root.
   */
  findMax(): Node | null {
    if (!this.root) return null;
    let curr = this.root;
    while (curr.right) curr = curr.right;
    this.splay(curr);
    return curr;
  }

  /**
   * Finds the minimum key in the tree. Splays the node to root.
   */
  findMin(): Node | null {
    if (!this.root) return null;
    let curr = this.root;
    while (curr.left) curr = curr.left;
    this.splay(curr);
    return curr;
  }

  /**
   * Deletes a key from the tree.
   */
  delete(key: K): boolean {
    const node = this.find(key);
    if (!node || this.compare(node.key, key) !== 0) return false;

    // After find(), node is at root
    if (!node.left) {
      this.root = node.right;
      if (this.root) this.root.parent = null;
    } else if (!node.right) {
      this.root = node.left;
      if (this.root) this.root.parent = null;
    } else {
      // Both children exist.
      // 1. Cut the right subtree
      const rightTree = node.right;
      rightTree.parent = null;

      // 2. Make left child the new root temporarily
      this.root = node.left;
      this.root.parent = null;

      // 3. Splay the maximum node in the left subtree to the root
      // This effectively makes the largest node of the left subtree the new root
      // which will have no right child, allowing us to attach the right subtree there.
      // @ts-ignore: side effect
      const maxLeft = this.findMax()!;

      // 4. Attach right subtree
      this.root.right = rightTree;
      rightTree.parent = this.root;
      this.pushup(this.root);
    }
    return true;
  }

  /**
   * Gets the rank of a key (number of keys strictly less than it) + 1. \
   * Assuming the user maintains a `size` property in `pushup`. \
   * Returns 0 if tree is empty. \
   * Note: This method assumes `left.size` is available. Users must implement this logic if they use rank.
   */
  rank(key: K): number {
    if (!this.root) return 0;
    // Find forces the key (or close to it) to root
    const node = this.find(key);
    // If exact match
    if (node && this.compare(node.key, key) === 0) {
      // Rank is size of left subtree + 1
      // We need to cast or assume 'size' exists, as counting nodes < key
      return (node.left ? (node.left as any).size : 0) + 1;
    }
    return 0; // Or handle slightly differently if key not found
  }

  /**
   * Gets the k-th smallest node (1-based index). \
   * Assumes `size` property is maintained on nodes.
   */
  kth(k: number): Node | null {
    let curr = this.root;
    while (curr) {
      const leftSize = curr.left ? (curr.left as any).size : 0;
      if (k === leftSize + 1) {
        this.splay(curr);
        return curr;
      }
      if (k <= leftSize) {
        curr = curr.left;
      } else {
        k -= leftSize + 1;
        curr = curr.right;
      }
    }
    return null;
  }

  /**
   * Finds the predecessor of the given key (the largest node strictly smaller than key). \
   * Splays the found node to the root.
   */
  prev(key: K): Node | null {
    let curr = this.root;
    let result: Node | null = null;

    while (curr) {
      if (this.compare(curr.key, key) < 0) {
        result = curr;
        curr = curr.right;
      } else {
        curr = curr.left;
      }
    }
    if (result) {
      this.splay(result);
    }
    return result;
  }

  /**
   * Finds the successor of the given key (the smallest node strictly greater than key). \
   * Splays the found node to the root.
   */
  next(key: K): Node | null {
    let curr = this.root;
    let result: Node | null = null;

    while (curr) {
      if (this.compare(curr.key, key) > 0) {
        result = curr;
        curr = curr.left;
      } else {
        curr = curr.right;
      }
    }
    if (result) {
      this.splay(result);
    }
    return result;
  }

  /**
   * Joins another tree to the right of this tree. \
   * REQUIREMENT: All keys in `this` tree must be smaller than all keys in `other` tree. \
   * This operation is O(log N).
   */
  join(other: SplayTree<K, Node>): void {
    if (!other.root) return;
    if (!this.root) {
      this.root = other.root;
      other.root = null; // Transfer ownership
      return;
    }

    // 1. Splay the maximum node of this tree to the root.
    const maxNode = this.findMax()!;
    // Now maxNode is root and has no right child (since it's max).

    // 2. Attach other tree as right child.
    maxNode.right = other.root;
    if (other.root) other.root.parent = maxNode;

    // 3. Update pushup
    this.pushup(maxNode);

    // Clear other tree root to avoid shared ownership issues
    other.root = null;
  }

  /**
   * Merges another tree into this tree. \
   * This is a general merge that inserts all nodes from `other` into `this`. \
   * Complexity: O(M log (N+M)) where M is size of other tree. \
   * Destroys the `other` tree structure.
   */
  merge(other: SplayTree<K, Node>): void {
    if (!other.root) return;

    // Helper to traverse and insert
    // We traverse `other` tree and insert its keys into `this`.
    // Since we are inserting keys, we create new nodes.
    // If we wanted to move nodes, we'd need to detach them.
    const traverse = (node: Node | null) => {
      if (!node) return;
      traverse(node.left);
      traverse(node.right);
      this.insert(node.key);
    };

    traverse(other.root);
    other.root = null;
  }
}