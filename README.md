# @shxnovel/splay

A TypeScript implementation of **Splay Tree**, a self-adjusting binary search tree with amortized O(log n) time complexity.

## Features

- Generic key type support
- Custom comparison function
- Full CRUD operations (insert, find, delete)
- Order statistics (rank, kth)
- Predecessor / successor queries
- Tree merge and join operations
- Zero runtime dependencies

## Installation

```bash
npm install @shxnovel/splay
```

Or with pnpm:

```bash
pnpm add @shxnovel/splay
```

## Quick Start

```typescript
import { SplayTree, SplayNode } from '@shxnovel/splay';

// 1. Define your node class
class MyNode extends SplayNode<number, MyNode> {
  size: number = 1;

  pushup(): void {
    this.size = 1 
      + (this.left?.size ?? 0) 
      + (this.right?.size ?? 0);
  }
}

// 2. Create tree
const tree = new SplayTree<number, MyNode>(MyNode);

// 3. Use it
tree.insert(10);
tree.insert(5);
tree.insert(15);

console.log(tree.root?.key); // 15 (last inserted, splayed to root)
console.log(tree.find(5)?.key); // 5
console.log(tree.kth(1)?.key); // 5 (1st smallest)
```

## API Reference

### SplayNode<K, Node>

Base node class. Extend it to add custom properties and implement `pushup()`.

```typescript
abstract class SplayNode<K, Node> {
  key: K;
  parent: Node | null;
  left: Node | null;
  right: Node | null;
  
  abstract pushup(): void;
}
```

### SplayTree<K, Node>

```typescript
new SplayTree<Node>(NodeCtor, compareFn?)
```

#### Methods

| Method | Description |
|--------|-------------|
| `insert(key)` | Insert a key. Splays node to root. |
| `find(key)` | Find key. Splays to root if found, otherwise splays last accessed node. |
| `findMax()` | Find maximum key. Splays to root. |
| `findMin()` | Find minimum key. Splays to root. |
| `delete(key)` | Delete a key. Returns `true` if found. |
| `rank(key)` | Get rank (1-based index) of key. Requires `size` in `pushup()`. |
| `kth(k)` | Find k-th smallest element (1-based). Splays to root. |
| `prev(key)` | Find predecessor (largest key < key). Splays to root. |
| `next(key)` | Find successor (smallest key > key). Splays to root. |
| `join(other)` | Join another tree (all keys in `other` must be larger). O(log n). |
| `merge(other)` | Merge another tree by inserting all keys. Destroys `other`. |

## Advanced Usage

### Custom Key Type

```typescript
interface Person {
  id: number;
  name: string;
}

class PersonNode extends SplayNode<Person, PersonNode> {
  size: number = 1;

  pushup(): void {
    this.size = 1 
      + (this.left?.size ?? 0) 
      + (this.right?.size ?? 0);
  }
}

const compareById = (a: Person, b: Person) => a.id - b.id;
const tree = new SplayTree<Person, PersonNode>(PersonNode, compareById);
```

### Interval Query Example

See [`src/example/timeline.ts`](./src/example/timeline.ts) and [`test/timeline.test.ts`](./test/timeline.test.ts)for a complete interval tree implementation.

## License

MIT
