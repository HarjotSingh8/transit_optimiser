let humans = [];
let humanML = null;
function drawCreatures() {
  for (let i = 0; i < humans.length; i++) {
    humans[i].update();
  }
}
class Life {
  constructor() {
    /*
     * every organism must have these properties
     * this.strength
     * this.maxHealth
     * this.currentHealth
     * this.maxFood
     * this.currentFood
     * this.speed
     * this.runSpeed
     * this.perception
     * this.endurance
     * this.swimmable
     * this.maxStamina
     * this.currentStamina
     * this.maxWater
     * this.currentWater
     * this.foodType
     * this.gender
     * this.score
     * this.seaCreature
     */
  }
  update() {
    this.checkSwimming();
    this.regenStamina(0.25);
    this.reduceFood(0.01);
    this.movement();
    //this.checkWaterAvailibility();
    //this.checkFoodAvailability();
    this.draw();
  }
  draw() {
    //draw the organism here
    fill(this.r, this.g, this.b);
    ellipse(this.pos.x, this.pos.y, 2, 2);
  }
  debugInfo() {
    //show debug info here
    stroke(255);
    line(this.pos.x, this.pos.y, this.pos.x + this.stamina, this.pos.y);
    line(this.pos.x, this.pos.y, this.pos.x, this.pos.y + this.food);
    noStroke();
  }
  movement() {
    //movement handled here
    let arr = [];
    for (let i = 0; i < 200; i++) {
      arr.push(random(0, 2));
    }
    //arr.push(1);
    var output = this.ml.think(arr);
    //console.log(output);
    this.pos.x -= output[0];
    this.pos.y -= output[1];
    this.pos.x += output[2];
    this.pos.y += output[3];
    if (this.pos.x < 10) {
      this.pos.x = 10;
      //decreaseFitness();
    }
    if (this.pos.x > canvasW - 10) {
      this.pos.x = canvasW - 10;
    }
    if (this.pos.y < 10) {
      this.pos.y = 10;
      //decreaseFitness();
    }
    if (this.pos.y > canvasH - 10) {
      this.pos.y = canvasH - 10;
    }
  }
  checkFoodAvailability() {}
  reduceFood(val) {
    this.food -= val;
    if (this.food < 0) {
      //dead
      this.food = 0;
    }
  }
  checkSwimming() {
    //checking if it'll stay alive in (or in cases of fishes outside) water
    if (worldMap.inWater(this.pos)) {
      if (!this.seaCreature) {
        this.reduceStamina(0.3);
      }
    }
  }
  checkStaminaAvailability() {
    if (this.staminaRegenCooldownFlag) return false;
    if (this.stamina < 0) {
      this.stamina = 0;
      this.staminaRegenCooldownFlag = true;
      this.staminaRegenCooldownCounter = 60;
      return false;
    }
    return true;
  }
  reduceStamina(val) {
    if (this.checkStaminaAvailability()) {
      this.stamina -= val;
      this.reduceFood(0.01 * val);
    }
  }
  regenStamina(val) {
    if (this.stamina < this.maxStamina && !this.staminaRegenCooldownFlag)
      this.stamina += val;
    if (this.staminaRegenCooldownFlag) {
      if (this.stamina > this.maxStamina / 4)
        this.staminaRegenCooldownFlag = false;
      if (this.staminaRegenCooldownCounter < 0) this.stamina += val;
      else this.staminaRegenCooldownCounter--;
    }
  }
  checkLife() {
    //kill if Food, Water, Health is finished
  }
  copy() {
    //copy the organism
  }
  updateBox() {
    //update current location (which box is the organism in)
  }
}

class Human extends Life {
  constructor() {
    super();
    this.type = "Human";
    this.r = 0;
    this.g = 255;
    this.b = 0;
    this.pos = createVector(random(10, canvasW - 10), random(10, canvasH - 10));
    this.score = 0;
    this.perception = 10;
    this.strength = random(50, 100);
    this.maxHealth = random(75, 100);
    this.staminaRegenCooldownFlag = false;
    this.staminaRegenCoolDownCounter = 60;
    if (random() > 0.5) {
      this.gender = "male";
    } else {
      this.gender = "female";
    }
    this.maxFood = random(75, 100);
    this.food = this.maxFood;
    this.maxWater = random(75, 100);
    this.water = this.maxWater;
    this.maxStamina = random(75, 100);
    this.stamina = this.maxStamina;
    if (random() > 0.25) {
      this.swimmable = true;
    } else {
      this.swimmable = false;
    }
    this.speed = random(5, 10);
    this.runSpeed = random(25, 35);
    this.foodType = ["Vegetation", "Herbivores", "fishSmall"];
    this.seaCreature = false;
  }
}

class Zombie extends Life {
  constructor() {
    this.type = "Zombie";
    this.score = 0;
    this.perception = 5;
    this.strength = random(50, 100);
    this.maxHealth = random(75, 100);
    if (random() > 0.5) {
      this.gender = male;
    } else {
      this.gender = female;
    }
    this.maxFood = random(75, 100);
    this.maxWater = random(75, 100);
    this.maxStamina = random(75, 100);
    if (random() > 0.25) {
      this.swimmable = true;
    } else {
      this.swimmable = false;
    }
    this.speed = random(5, 10);
    this.runSpeed = random(25, 35);
    this.foodType = ["Human", "Carnivores", "Herbivores"];
    this.seaCreature = false;
  }
}

class Deer extends Life {
  constructor() {
    this.type = "Herbivores";
    this.score = 0;
    this.perception = 7;
    this.strength = random(50, 100);
    this.maxHealth = random(75, 100);
    if (random() > 0.5) {
      this.gender = male;
    } else {
      this.gender = female;
    }
    this.maxFood = random(75, 100);
    this.maxWater = random(75, 100);
    this.maxStamina = random(75, 100);
    if (random() > 0.25) {
      this.swimmable = true;
    } else {
      this.swimmable = false;
    }
    this.speed = random(5, 10);
    this.runSpeed = random(40, 60);
    this.foodType = ["Vegetation"];
    this.seaCreature = false;
  }
}

class FishSmall extends Life {
  constructor() {
    this.type = "fishSmall";
    this.score = 0;
    this.perception = 7;
    this.strength = random(50, 100);
    this.maxHealth = random(75, 100);
    if (random() > 0.5) {
      this.gender = male;
    } else {
      this.gender = female;
    }
    this.maxFood = random(75, 100);
    this.maxWater = random(75, 100);
    this.maxStamina = random(75, 100);
    if (random() > 0.25) {
      this.swimmable = true;
    } else {
      this.swimmable = false;
    }
    this.speed = random(5, 10);
    this.runSpeed = random(40, 60);
    this.foodType = ["Vegetation"];
    this.seaCreature = true;
  }
}

function initialSpawning() {
  /**
   * inputs -> posx,posy,
   */
  humanML = new Species(200, 5, 100);
  for (let i = 0; i < 100; i++) {
    humans.push(new Human());
    humans[i].ml = humanML.ml[i];
  }
}
