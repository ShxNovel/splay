import { SplayNode as a } from "./splay.js";
class f extends a {
  maxR;
  constructor(t) {
    super(t), this.maxR = t.r;
  }
  pushup() {
    let t = this.key.r;
    this.left && (t = Math.max(t, this.left.maxR)), this.right && (t = Math.max(t, this.right.maxR)), this.maxR = t;
  }
}
function h(s, t) {
  const l = [];
  let e = null;
  function r(i) {
    if (i && (e = i, !(i.maxR < t))) {
      if (i.key.l > t) {
        r(i.left);
        return;
      }
      i.key.r >= t && l.push(i.key), r(i.left), r(i.right);
    }
  }
  return r(s.root), e && s.splay(e), l;
}
export {
  f as TimelineNode,
  h as queryIntervals
};
