let probInherGeneIsDisabled = 75;
let probConnWeightIsMutated = 80;
let probConnWeightMutationIsUP = 90;
let probConnWeightMutationIsRandom = 10;
let probMutationWOCrossover = 25;
let probAddingNewNode = 3;
let probAddingNewConnection = 5;

let interspeciesMatingRate = 0.001;

let populationSize = 3;

class ML {
  /**
   * Initialises Brain for one creature
   *
   * @param {*} numInputs //number of inputs to the creature
   * @param {*} numOutputs //number of outputs from the creature
   */
  constructor(numInputs, numOutputs) {
    this.nodes = []; // The List of Nodes
    this.connections = []; // The List of Connections
    this.hiddenLayers = []; // The List of 2D Hidden Layers
    this.numInputs = numInputs + 1; // Number of Inputs
    this.numHiddenNodes = 0; // Number of Hidden Nodes
    this.numHiddenLayers = 0; // Number of Hidden Layers
    this.numOutputs = numOutputs; // Number of Outputs
    this.numNodes = 0; // Number of Nodes in the Neural Network
    this.numConnections = 0; // Number of Connections in the Neural Network
    this.totalDepth = 2; // Initial no hidden layers (Only Input and Output layers)
    this.fitness = 0;

    // Set up basic I/O Brain structure
    for (let i = 0; i < numInputs; i++) {
      this.nodes.push(this.createNewNode("in", 0));
    }
    this.nodes.push(this.createNewNode("in", 0)); //This is the bias
    this.nodes[this.numInputs - 1].setValue(1);
    for (let i = 0; i < numOutputs; i++) {
      this.nodes.push(this.createNewNode("out", this.totalDepth - 1));
    }
  }

  // Returns the index of the Node in this.nodes based off of the inNodeId
  // @param - nodeId: id of the Node
  // @return - index of the Node with the id nodeId, -1 if Node not found
  getNodeIndex(nodeId) {
    let i;
    let found = false;
    for (i = 0; i < this.numNodes && !found; i++) {
      if (this.nodes[i].getId() == nodeId) {
        found = true;
      }
    }
    if (!found) {
      i = -1;
    }
    return i - 1;
  }

  getNodeId(index) {
    return this.nodes[index].getId();
  }

  // Creates a new Node object
  // @return - new Node object
  createNewNode(type, depth) {
    let newNode;

    newNode = new Node(this.numNodes, type, depth);

    this.numNodes += 1;

    return newNode;
  }

  // Creates a new Connection object
  // @return - new Connection object
  createNewConnection(inNodeId, outNodeId, weight, enabled, innov) {
    let newConnection;

    newConnection = new Connection(inNodeId, outNodeId, weight, enabled, innov);
    this.numConnections += 1;

    return newConnection;
  }

  chooseRandomType() {
    let randType = Math.round(randomInt(0, 2));
    switch (randType) {
      case 0:
        return "in";
      case 1:
        return "out";
      case 2:
        return "hidden";
    }
  }

  adjustNodesForDepth(depthLevel) {
    for (let i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].getDepth() >= depthLevel) {
        this.nodes[i].setDepth(this.nodes[i].getDepth() + 1);
        //this.nodes[i].setPosition(-1, -1);
      }
    }
    this.totalDepth += 1;
    this.numHiddenLayers += 1;
  }

  getNodesInLayer(layerNumber) {
    let nodesInLayer = [];
    for (let i = 0; i < this.nodes.length; i++) {
      //console.log(this.nodes[i].getDepth());
      if (this.nodes[i].getDepth() == layerNumber) {
        nodesInLayer.push(this.nodes[i].getId());
      }
    }
    return nodesInLayer;
  }

  setInnovationNumber(connectionIndex, innovationNumber) {
    this.connections[connectionIndex].setInnovationNumber(innovationNumber);
  }

  getConnection(connectionIndex) {
    return this.connections[connectionIndex];
  }

  mutateAddNode() {
    let randIndex = randomInt(0, this.numConnections - 1);
    //console.log(randIndex);
    while (!this.connections[randIndex].isEnabled()) {
      randIndex = randomInt(0, this.numConnections - 1);
    }

    let inNodeId = this.connections[randIndex].getInNodeId();
    let outNodeId = this.connections[randIndex].getOutNodeId();
    let connectionWeight = this.connections[randIndex].getWeight();
    let newNodeDepth, inNodeDepth, outNodeDepth;
    let isNewDepth;
    if (this.totalDepth == 2) {
      newNodeDepth = 1;
      isNewDepth = true;
    } else {
      inNodeDepth = this.nodes[this.getNodeIndex(inNodeId)].getDepth();
      outNodeDepth = this.nodes[this.getNodeIndex(outNodeId)].getDepth();
      if (outNodeDepth - inNodeDepth == 1) {
        // 1 Layer length, new depth
        isNewDepth = true;
        newNodeDepth = outNodeDepth; // inNode -> newNode -> outNode
      } else {
        isNewDepth = false;
        newNodeDepth = randomInt(inNodeDepth + 1, outNodeDepth - 1);
      }
    }
    if (isNewDepth) {
      this.adjustNodesForDepth(newNodeDepth);
    }

    this.nodes.push(this.createNewNode("hidden", newNodeDepth));
    let newNodeId = this.nodes[this.nodes.length - 1].getId();
    this.connections[randIndex].setEnabled(false);

    let enabled = true;

    this.connections.push(
      this.createNewConnection(inNodeId, newNodeId, 1, enabled, -1)
    );
    this.connections.push(
      this.createNewConnection(
        newNodeId,
        outNodeId,
        connectionWeight,
        enabled,
        -1
      )
    );

    return [this.numConnections - 2, this.numConnections - 1];
  }

  mutateAddConnection() {
    let inNodeIndex, outNodeIndex, inNodeId, outNodeId, weight, enabled;
    let selectNewNodes = true;
    while (selectNewNodes) {
      let inNodeType = this.chooseRandomType();
      while (
        inNodeType == "out" ||
        (inNodeType == "hidden" && this.totalDepth == 2)
      ) {
        inNodeType = this.chooseRandomType();
      }
      let outNodeType = this.chooseRandomType();
      while (
        outNodeType == "in" ||
        (outNodeType == "hidden" && this.totalDepth == 2)
      ) {
        outNodeType = this.chooseRandomType();
      }
      //console.log(inNodeType + ", "  + outNodeType);

      if (inNodeType == "in") {
        inNodeIndex = randomInt(0, this.numInputs - 1);
      } else {
        inNodeIndex = randomInt(
          this.numInputs + this.numOutputs,
          this.numNodes - 1
        );
      }
      // console.log(this.numInputs + this.numOutputs);
      // console.log(this.numNodes);
      if (outNodeType == "out") {
        outNodeIndex = randomInt(
          this.numInputs,
          this.numInputs + this.numOutputs - 1
        );
      } else {
        outNodeIndex = randomInt(
          this.numInputs + this.numOutputs,
          this.numNodes - 1
        );
      }

      if (this.nodes[inNodeIndex].getId() == this.nodes[outNodeIndex].getId()) {
        continue;
      }

      if (
        this.nodes[outNodeIndex].getDepth() ==
        this.nodes[inNodeIndex].getDepth()
      ) {
        continue;
      }

      //console.log(randInt(0,1));

      if (
        this.nodes[outNodeIndex].getDepth() < this.nodes[inNodeIndex].getDepth()
      ) {
        let temp = outNodeIndex;
        outNodeIndex = inNodeIndex;
        inNodeIndex = temp;
      }

      selectNewNodes = false;
      for (let i = 0; i < this.connections.length; i++) {
        // Traverse connections to see if it Already exists
        if (
          this.connections[i].getInNodeId() == this.nodes[inNodeIndex].getId()
        ) {
          if (
            this.connections[i].getOutNodeId() ==
            this.nodes[outNodeIndex].getId()
          ) {
            selectNewNodes = true;
          }
        }
      }
    }

    inNodeId = this.getNodeId(inNodeIndex);
    outNodeId = this.getNodeId(outNodeIndex);

    weight = randomFloat(-1, 1);
    //enabled = randBool();
    enabled = true;

    this.connections.push(
      this.createNewConnection(inNodeId, outNodeId, weight, enabled, -1)
    );
    return this.numConnections - 1;
  }

  mutateConnection(connectionIndex) {
    let weight = this.connections[connectionIndex].getWeight();
    let uniformPerturbed = getProbability(90);
    if (uniformPerturbed) {
    }
    this.connections[connectionIndex].setWeight();
  }

  getInNodes(nodeId) {
    let inNodes = [];
    for (let i = 0; i < this.connections.length; i++) {
      let conn = this.connections[i];
      if (conn.getOutNodeId() == nodeId) {
        inNodes.push([conn.getInNodeId(), conn.getWeight()]);
      }
    }
    return inNodes;
  }

  sigmoid(value) {
    return 1 / (1 + Math.exp(-4.9 * value));
  }

  activate(value) {
    return this.sigmoid(value);
  }

  feedForward(inputs) {
    for (let i = 0; i < inputs.length; i++) {
      this.nodes[i].setValue(inputs[i]);
    }
    //console.log(this.nodes);
    for (let i = 1; i < this.numHiddenLayers + 2; i++) {
      let layerNodes = this.getNodesInLayer(i);
      for (let j = 0; j < layerNodes.length; j++) {
        let nodeId = layerNodes[j];
        let inNodes = this.getInNodes(nodeId);
        let output = 0;
        for (let j = 0; j < inNodes.length; j++) {
          let inNodeId = inNodes[j][0];
          let weight = inNodes[j][1];
          let inNode = this.nodes[this.getNodeIndex(inNodeId)];
          output += inNode.getValue() * weight;
        }
        if (inNodes.length != 0) {
          output = this.activate(output);
        }

        this.nodes[this.getNodeIndex(nodeId)].setValue(output);
      }
    }
  }

  think(inputs) {
    this.feedForward(inputs);
    let outputs = [];
    for (let i = this.numInputs; i < this.numInputs + this.numOutputs; i++) {
      outputs.push(this.nodes[i].getValue());
    }

    return outputs;
  }

  setFitness(fitnes) {
    this.fitness = fitness;
  }
}
