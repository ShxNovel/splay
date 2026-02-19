class o {
  key;
  parent = null;
  left = null;
  right = null;
  constructor(r) {
    this.key = r;
  }
}
class h {
  root = null;
  NodeCtor;
  compare;
  /**
   * @param NodeCtor The constructor for the node class.
   * @param compareFn Optional comparison function. Defaults to (a, b) => a - b for numbers.
   */
  constructor(r, t) {
    this.NodeCtor = r, this.compare = t || ((e, i) => e > i ? 1 : e < i ? -1 : 0);
  }
  /**
   * Helper to perform pushup on a node if it exists.
   */
  pushup(r) {
    r && r.pushup();
  }
  /**
   * Rotates node x upwards.
   */
  rotate(r) {
    const t = r.parent, e = t.parent, i = t.left === r;
    e && (e.left === t ? e.left = r : e.right = r), r.parent = e, i ? (t.left = r.right, t.left && (t.left.parent = t), r.right = t) : (t.right = r.left, t.right && (t.right.parent = t), r.left = t), t.parent = r, this.pushup(t), this.pushup(r);
  }
  /**
   * Splays node x to the target position (root if target is null).
   */
  splay(r, t = null) {
    for (; r.parent !== t; ) {
      const e = r.parent, i = e.parent;
      i !== t && (e.left === r == (i.left === e) ? this.rotate(e) : this.rotate(r)), this.rotate(r);
    }
    t === null && (this.root = r);
  }
  /**
   * Inserts a key into the tree. \
   * If the key already exists, the existing node is splayed to the root.
   */
  insert(r) {
    if (!this.root)
      return this.root = new this.NodeCtor(r), this.pushup(this.root), this.root;
    let t = this.root;
    for (; ; ) {
      const e = this.compare(r, t.key);
      if (e === 0)
        return this.splay(t), t;
      const i = e < 0 ? t.left : t.right;
      if (!i) {
        const s = new this.NodeCtor(r);
        return s.parent = t, e < 0 ? t.left = s : t.right = s, this.splay(s), s;
      }
      t = i;
    }
  }
  /**
   * Finds a key in the tree. Splays the node to root if found. \
   * If not found, splays the last accessed node to root.
   */
  find(r) {
    if (!this.root) return null;
    let t = this.root, e = t;
    for (; t; ) {
      e = t;
      const i = this.compare(r, t.key);
      if (i === 0)
        return this.splay(t), t;
      t = i < 0 ? t.left : t.right;
    }
    return this.splay(e), null;
  }
  /**
   * Finds the maximum key in the tree. Splays the node to root.
   */
  findMax() {
    if (!this.root) return null;
    let r = this.root;
    for (; r.right; ) r = r.right;
    return this.splay(r), r;
  }
  /**
   * Finds the minimum key in the tree. Splays the node to root.
   */
  findMin() {
    if (!this.root) return null;
    let r = this.root;
    for (; r.left; ) r = r.left;
    return this.splay(r), r;
  }
  /**
   * Deletes a key from the tree.
   */
  delete(r) {
    const t = this.find(r);
    if (!t || this.compare(t.key, r) !== 0) return !1;
    if (!t.left)
      this.root = t.right, this.root && (this.root.parent = null);
    else if (!t.right)
      this.root = t.left, this.root && (this.root.parent = null);
    else {
      const e = t.right;
      e.parent = null, this.root = t.left, this.root.parent = null, this.findMax(), this.root.right = e, e.parent = this.root, this.pushup(this.root);
    }
    return !0;
  }
  /**
   * Gets the rank of a key (number of keys strictly less than it) + 1. \
   * Assuming the user maintains a `size` property in `pushup`. \
   * Returns 0 if tree is empty. \
   * Note: This method assumes `left.size` is available. Users must implement this logic if they use rank.
   */
  rank(r) {
    if (!this.root) return 0;
    const t = this.find(r);
    return t && this.compare(t.key, r) === 0 ? (t.left ? t.left.size : 0) + 1 : 0;
  }
  /**
   * Gets the k-th smallest node (1-based index). \
   * Assumes `size` property is maintained on nodes.
   */
  kth(r) {
    let t = this.root;
    for (; t; ) {
      const e = t.left ? t.left.size : 0;
      if (r === e + 1)
        return this.splay(t), t;
      r <= e ? t = t.left : (r -= e + 1, t = t.right);
    }
    return null;
  }
  /**
   * Finds the predecessor of the given key (the largest node strictly smaller than key). \
   * Splays the found node to the root.
   */
  prev(r) {
    let t = this.root, e = null;
    for (; t; )
      this.compare(t.key, r) < 0 ? (e = t, t = t.right) : t = t.left;
    return e && this.splay(e), e;
  }
  /**
   * Finds the successor of the given key (the smallest node strictly greater than key). \
   * Splays the found node to the root.
   */
  next(r) {
    let t = this.root, e = null;
    for (; t; )
      this.compare(t.key, r) > 0 ? (e = t, t = t.left) : t = t.right;
    return e && this.splay(e), e;
  }
  /**
   * Joins another tree to the right of this tree. \
   * REQUIREMENT: All keys in `this` tree must be smaller than all keys in `other` tree. \
   * This operation is O(log N).
   */
  join(r) {
    if (!r.root) return;
    if (!this.root) {
      this.root = r.root, r.root = null;
      return;
    }
    const t = this.findMax();
    t.right = r.root, r.root && (r.root.parent = t), this.pushup(t), r.root = null;
  }
  /**
   * Merges another tree into this tree. \
   * This is a general merge that inserts all nodes from `other` into `this`. \
   * Complexity: O(M log (N+M)) where M is size of other tree. \
   * Destroys the `other` tree structure.
   */
  merge(r) {
    if (!r.root) return;
    const t = (e) => {
      e && (t(e.left), t(e.right), this.insert(e.key));
    };
    t(r.root), r.root = null;
  }
}
export {
  o as SplayNode,
  h as SplayTree
};
