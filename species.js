function testSpecies() {
  let species = new Species(20, 5);
  return species;
}

class Species {
  constructor(numInputs, numOutputs, pop) {
    this.ml = [];
    this.innovations = [];
    var populationSize = populationSize;
    if (pop != null) populationSize = pop;
    for (let i = 0; i < populationSize; i++) {
      this.ml.push(new ML(numInputs, numOutputs));
      let numInitConnections = randomInt(1, 3);
      let numInitHiddenNodes = randomInt(0, 1);
      for (let j = 0; j < numInitConnections; j++) {
        this.ml[i].mutateAddConnection();
        let innovationNumber = this.getInnovationNumber(
          this.ml[i].getConnection(j)
        );
        this.ml[i].setInnovationNumber(j, innovationNumber);
      }
      for (let j = 0; j < numInitHiddenNodes; j++) {
        let indices = this.ml[i].mutateAddNode();
        let firstConnInnovationNumber = this.getInnovationNumber(
          this.ml[i].getConnection(indices[0])
        );
        let secondConnInnovationNumber = this.getInnovationNumber(
          this.ml[i].getConnection(indices[1])
        );
        this.ml[i].setInnovationNumber(indices[0], firstConnInnovationNumber);
        this.ml[i].setInnovationNumber(indices[1], secondConnInnovationNumber);
      }
    }
  }

  getInnovationNumber(connection) {
    let isNew = true;
    let innovationNumber = this.innovations.length + 1;
    for (let i = 0; i < this.innovations.length; i++) {
      if (
        this.innovations[i].getInNodeId() == connection.getInNodeId() &&
        this.innovations[i].getOutNodeId() == connection.getOutNodeId()
      ) {
        innovationNumber = i + 1;
        isNew = false;
      }
    }
    if (isNew) {
      this.innovations.push(connection);
    }
    return innovationNumber;
  }
}
