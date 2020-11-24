let testSp;
function testSpecies() {
  testSp = new Species(5, 3);
  testSp.mutateAddConnection();
  testSp.mutateAddConnection();
  testSp.mutateAddConnection();
  testSp.mutateAddConnection();
  testSp.mutateAddConnection();
  testSp.mutateAddNode();
  testSp.mutateAddNode();
  testSp.mutateAddNode();
  testSp.mutateAddNode();
  return testSp;
}
class Species {
  constructor(numInputs, numOutputs) {
    this.numInputs = numInputs;
    this.inputs = [];
    this.numOutputs = numOutputs;
    this.outputs = [];
    this.genes = [];
    this.numConnections = 0; //aka innovation number
    this.connections = [];
    this.maxDepth = 2;
    this.numGenes = this.numInputs + this.numOutputs;

    //initialising basic structure
    for (let i = 0; i < this.numInputs; i++) {
      this.inputs.push(new Node(i, 0, "input"));
    }
    for (let i = 0; i < this.numOutputs; i++) {
      this.outputs.push(new Node(numInputs + i, 1, "output"));
    }
    for (let i = 0; i < this.numInputs; i++) {
      this.genes.push(this.inputs[i]);
    }
    for (let i = 0; i < this.numOutputs; i++) {
      this.genes.push(this.outputs[i]);
    }
  }
  mutate() {
    //mutation here
  }
  adjustDepth(depthLevel) {
    //add a new level at depthlevel
    //Complete
    //Not Tested
    for (let i = 0; i < this.numGenes; i++) {
      if (this.genes[i].depth >= depthLevel) {
        this.genes[i].depth++;
      }
    }
    this.maxDepth = this.genes[this.numInputs].depth; //the inputs end at index (this.numInputs-1), at index this.numInputs is the first output, outmut has the max depth
  }
  mutateAddConnection() {
    //add a connection between unconnected nodes
    //Complete
    //Not Tested
    let tries = 20;
    let newConnection = null;
    while (tries > 1) {
      let randomSourceNodeIndex = parseInt(random(0, this.numGenes - 1));
      while (this.genes[randomSourceNodeIndex].depth < 1) {
        randomSourceNodeIndex = parseInt(random(0, this.numGenes));
      }
      let randomNodeIndex = parseInt(random(0, this.numGenes - 1));
      let tryCount = 20;
      while (
        tryCount > 0 &&
        (this.genes[randomSourceNodeIndex].depth >=
          this.genes[randomNodeIndex].depth ||
          this.checkConnection(
            this.genes[randomSourceNodeIndex],
            this.genes[randomNodeIndex]
          ))
      ) {
        randomSourceNodeIndex = parseInt(random(0, this.numGenes));
        tryCount--;
      }
      if (
        this.genes[randomSourceNodeIndex].depth <
          this.genes[randomNodeIndex].depth &&
        !this.checkConnection(
          this.genes[randomSourceNodeIndex],
          this.genes[randomNodeIndex]
        )
      ) {
        //add new connection here
        newConnection = new Connection(
          this.genes[randomSourceNodeIndex],
          this.genes[randomNodeIndex],
          this.numConnections
        );
        this.connections.push(newConnection);
        this.numConnections++;
        break;
      }
      tries--;
    }
    return newConnection;
  }
  checkConnection(source, node) {
    //Complete
    //Not Tested
    for (let i = 0; i < this.numConnections; i++) {
      if (
        this.connections[i].source.id == source.id &&
        this.connections[i].node.id == node.id
      )
        return true;
    }
    return false;
  }
  updateSpecies() {
    //replace default species parameters to the best one in the species
  }
  mutateAddNode() {
    //new connection here
    //Complete
    //Not Tested
    let ret = []; //this will be returned if needed
    //ret contains the new node, and both connections
    let randomConnectionIndex = parseInt(random(0, this.numConnections - 1));
    while (!this.connections[randomConnectionIndex].enabled) {
      randomConnectionIndex = parseInt(random(0, this.numConnections - 1));
    }
    if (
      this.connections[randomConnectionIndex].node.depth -
        this.connections[randomConnectionIndex].source.depth ==
      1
    ) {
      this.adjustDepth(this.connections[randomConnectionIndex].node.depth);
      //adjust depth
    }
    let depth = parseInt(
      (this.connections[randomConnectionIndex].node.depth +
        this.connections[randomConnectionIndex].source.depth) /
        2
    );
    this.connections[randomConnectionIndex].enabled = false;
    let newGene = new Node(this.numGenes++, depth, "hidden");
    this.genes.push(newGene);
    this.connections.push(
      new Connection(
        this.connections[randomConnectionIndex].source,
        newGene,
        this.numConnections++
      )
    );
    this.connections.push(
      new Connection(
        newGene,
        this.connections[randomConnectionIndex].node,
        this.numConnections++
      )
    );
  }
}

let testOrg;
function testOrganism() {
  testSpecies();
  testOrg = new Organism(testSp);
}
class Organism {
  constructor(species) {
    this.species = species;
    this.genes = [];
    this.connections = [];
    this.evaluateOrder = [];
    this.fitness = 0;
    //let initConnections = random(1, this.species.numConnections / 2);
    let initNodes = random(1, this.species.numGenes / 2);
    if (random() > 0.5) {
      //add new mutations
      //delete some nodes
      this.mutateAddConnection();
    } else {
      //just crossover
    }
    /**
     * organism should have it's own genes, connections
     * genes and connections can be copied from parent
     */
    //initOrganism();
  }
  mutateAddConnection() {
    let connection = this.species.mutateAddConnection;
    if (connection != null) {
      this.connections.push(connection);
      //add the connections to this tree
    }
  }
  initOrganism() {
    //initialise organism here
  }
  reEvaluateOrder() {
    //re-evaluate the order of calculation here
  }
}

function activationFunctionSigmoid(d) {
  //sigmoid function -> Output is between 0 & 1
  d = Math.pow(Math.E, -d);
  d++;
  d = 1 / d;
  return d;
}

function activationFunctionTan(d) {
  return Math.tanh(d);
}
