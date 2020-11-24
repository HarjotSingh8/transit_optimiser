/**
 * This class contains connections between nodes
 */
class Connection {
  constructor(inNodeId, outNodeId, innovationNumber, weight) {
    this.inNodeId = inNodeId;
    this.outNodeId = outNodeId;
    this.weight = weight;
    this.enabled = true;
    this.innovationNumber = innovationNumber;
  }
  getInNodeId() {
    return this.inNodeId;
  }
  setInNodeId(nodeId) {
    this.inNodeId = nodeId;
  }
  getOutNodeId() {
    return this.outNodeId;
  }
  setOutNodeId(nodeId) {
    this.outNodeId = nodeId;
  }
  getWeight() {
    return this.weight;
  }
  setWeight(weight) {
    this.weight = weight;
  }
  isEnabled() {
    return this.enabled;
  }
  setEnabled(enabled) {
    this.enabled = enabled;
  }
  getInnovationNumber() {
    return this.innovationNumber;
  }
  setInnovationNumber(innovationNumber) {
    this.innovationNumber = innovationNumber;
  }
  copy() {
    //copy this connection
    let ret = new Connection(
      this.inNodeId,
      this.outNodeId,
      this.innovationNumber,
      this.weight
    );
  }
  toString() {
    //convert this connection to string to be saved
  }
}
