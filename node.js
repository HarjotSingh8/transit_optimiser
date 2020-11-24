class Node {
  constructor(id, type, depth) {
    this.id = id;
    this.depth = depth;
    this.type = type;
    this.value = null;
  }
  getId() {
    return this.id;
  }
  setId(id) {
    this.id = id;
  }
  getType() {
    return this.type;
  }
  setType(type) {
    this.type = type;
  }
  isValueSet() {
    if (value == null) {
      return false;
    }
    return true;
  }
  getValue() {
    if (this.value != null) {
      return this.value;
    }
    return -1;
  }
  setValue(val) {
    this.value = val;
  }
  getDepth() {
    return this.depth;
  }
  setDepth(depth) {
    this.depth = depth;
  }
}
