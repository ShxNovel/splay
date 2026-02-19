
import { describe, it, expect } from 'vitest';
import { SplayNode, SplayTree } from '../src/splay';

class MyNode extends SplayNode<number, MyNode> {
  size: number = 1;

  pushup(): void {
    this.size = 1 + (this.left ? this.left.size : 0) + (this.right ? this.right.size : 0);
  }
}

describe('SplayTree', () => {
  it('should insert and splay correctly', () => {
    const tree = new SplayTree<number, MyNode>(MyNode);
    tree.insert(10);
    expect(tree.root?.key).toBe(10);
    expect((tree.root as any).size).toBe(1);

    tree.insert(5);
    expect(tree.root?.key).toBe(5);
    expect((tree.root as any).size).toBe(2);
    // 5 < 10, then 10 is right child of 5
    expect(tree.root?.right?.key).toBe(10);

    tree.insert(15);
    expect(tree.root?.key).toBe(15);
    expect((tree.root as any).size).toBe(3);
  });

  it('should find and splay correctly', () => {
    const tree = new SplayTree<number, MyNode>(MyNode);
    tree.insert(10);
    tree.insert(5);
    tree.insert(15);

    const found = tree.find(5);
    expect(found?.key).toBe(5);
    expect(tree.root?.key).toBe(5);

    const notFound = tree.find(99);
    expect(notFound).toBeNull();
    expect(tree.root?.key).toBe(15);
  });

  it('should calculate rank correctly', () => {
    const tree = new SplayTree<number, MyNode>(MyNode);
    [10, 5, 15, 2, 20].forEach(k => tree.insert(k));
    // Sorted: 2, 5, 10, 15, 20

    expect(tree.rank(2)).toBe(1);
    expect(tree.rank(5)).toBe(2);
    expect(tree.rank(10)).toBe(3);
    expect(tree.rank(15)).toBe(4);
    expect(tree.rank(20)).toBe(5);
  });

  it('should find kth element correctly', () => {
    const tree = new SplayTree<number, MyNode>(MyNode);
    [10, 5, 15, 2, 20].forEach(k => tree.insert(k));

    expect(tree.kth(1)?.key).toBe(2);
    expect(tree.kth(2)?.key).toBe(5);
    expect(tree.kth(3)?.key).toBe(10);
    expect(tree.kth(4)?.key).toBe(15);
    expect(tree.kth(5)?.key).toBe(20);
    expect(tree.kth(6)).toBeNull();
  });

  it('should delete correctly', () => {
    const tree = new SplayTree<number, MyNode>(MyNode);
    [10, 5, 15].forEach(k => tree.insert(k));

    // Delete 5
    expect(tree.delete(5)).toBe(true);
    expect(tree.find(5)).toBeNull();

    // 10, 15
    expect(tree.rank(10)).toBe(1);
    expect(tree.rank(15)).toBe(2);

    // Delete remaining
    expect(tree.delete(10)).toBe(true);
    expect(tree.delete(15)).toBe(true);
    expect(tree.root).toBeNull();
  });

  it('should find predecessor and successor correctly', () => {
    const tree = new SplayTree<number, MyNode>(MyNode);
    [10, 5, 15, 2, 8].forEach(k => tree.insert(k));
    // Sorted: 2, 5, 8, 10, 15

    expect(tree.prev(8)?.key).toBe(5);
    expect(tree.prev(2)).toBeNull();
    expect(tree.prev(100)?.key).toBe(15);

    expect(tree.next(8)?.key).toBe(10);
    expect(tree.next(15)).toBeNull();
    expect(tree.next(0)?.key).toBe(2);
  });

  it('should join two trees correctly', () => {
    const tree1 = new SplayTree<number, MyNode>(MyNode);
    const tree2 = new SplayTree<number, MyNode>(MyNode);
    
    [1, 3, 5].forEach(k => tree1.insert(k));
    [10, 12, 14].forEach(k => tree2.insert(k));

    tree1.join(tree2);

    expect((tree1.root as any).size).toBe(6);
    expect(tree1.find(1)).not.toBeNull();
    expect(tree1.find(14)).not.toBeNull();
    expect(tree2.root).toBeNull(); // Ownership transferred
  });

  it('should merge two trees correctly', () => {
    const tree1 = new SplayTree<number, MyNode>(MyNode);
    const tree2 = new SplayTree<number, MyNode>(MyNode);
    
    [1, 10, 5].forEach(k => tree1.insert(k));
    [3, 8, 12].forEach(k => tree2.insert(k));

    tree1.merge(tree2);

    // Should contain all elements: 1, 3, 5, 8, 10, 12
    expect((tree1.root as any).size).toBe(6);
    expect(tree1.kth(1)?.key).toBe(1);
    expect(tree1.kth(2)?.key).toBe(3);
    expect(tree1.kth(4)?.key).toBe(8);
    expect(tree1.kth(6)?.key).toBe(12);
  });
});
