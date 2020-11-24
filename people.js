class Population {
  constructor(config) {
    this.settlements = config.settlements;
    this.name_generator = config.name_generator;
    this.create_initial_pool();
  }
  create_initial_pool() {
    console.log("creating pool");
    for (var i in this.settlements.settlements) {
      var settlement = this.settlements.settlements[i];
      for (var j = 0; j < settlement.population_count; j++) {
        settlement.population.push(
          new Person({ name: { first_name: "yolo", last_name: "yolo" } })
        );
      }
    }
  }
}
class Person {
  constructor(config) {
    this.name = {
      first_name: config.name.first_name,
      last_name: config.name.last_name,
    };
    this.relations = {
      parents: config.parents || {
        father: null,
        mother: null,
      },
      partner: config.partner || null,
      children: config.children || [],
    };
    this.address = config.address; //or find new house
    this.age = config.age || random(100);
    this.last_age_update = config.today;
    this.alive = config.alive || true;
    this.medical_conditions = config.medical_conditions || {};
    this.weight = config.weight || this.calculate_weight();
    this.current_task = "at_home";
    this.destination = null;
    this.jobs = [];
    this.hobbies = [];
  }
  calculate_weight() {
    //accurately calculate random weight(with changes)
  }
  create_medical_conditions() {
    //create semi random medical conditions
  }
  time_jump() {
    //when zoomed out or in another location, updates will be estimated for locations,
    //this mean when zooming to a location, time jumps from last updated time have to be evaluated
  }
  what_am_i_doing_right_now() {
    //evaluate what this person should be doing at this point in time
  }
}

class NameGenerator {
  constructor() {
    this.female_first_names = [
      "Amira",
      "Becca",
      "Bella",
      "Bethany",
      "Carmen",
      "Cassie",
      "Catherine",
      "Claudia",
      "Daniella",
      "Diana",
      "Edith",
      "Ellen",
      "Elsa",
      "Emmie",
      "Florence",
      "Holly",
      "Josephine",
      "Katelyn",
      "Kimberly",
      "Kyla",
      "Lana",
      "Leyla",
      "Liberty",
      "Lola",
      "Meghan",
      "Michelle",
      "Natasha",
      "Olive",
      "Poppy",
      "Sharon",
      "Savannah",
      "Shania",
      "Summer",
      "Tabitha",
      "Terry",
      "Tessa",
    ];
    this.male_first_names = ["John", "Jony"];
    this.last_names = ["Appleseed", "Ive"];
  }
  create_name(gender, parents) {
    var name = { first_name: "", last_name: "" };
    var tries = 0;
    if ((gender = "male")) {
      while (true) {
        if (tries < this.tries_threshold)
          //if attempt threshold has passed try combining names
          name.first_name += this.male_first_names[
            Math.floor(random(this.male_first_names.length))
          ];
        //try a new name
        else
          name.first_name = this.male_first_names[
            Math.floor(random(this.male_first_names.length))
          ];
        if (this.check_family(name.first_name, parents)) break; //found a non conflicting name
        tries++; //to check threshold
      }
    } else {
      while (true) {
        if (tries < this.tries_threshold)
          //if attempt threshold has passed try combining names
          name.first_name = this.female_first_names[
            Math.floor(random(this.female_first_names.length))
          ];
        //try a new name
        else
          name.first_name = this.female_first_names[
            Math.floor(random(this.female_first_names.length))
          ];
        if (this.check_family(name.first_name, parents)) break; //found a non conflicting name
        tries++; //to check threshold
      }
    }
    if (parents && parents.father) {
      name.last_name += parents.father.last_name;
    } else {
      name.last_name += this.last_names[
        Math.floor(random(this.last_names.length))
      ];
    }
    return name;
  }
  check_family(first_name, parents) {
    for (var i = 0; i < parents.father.children; i++) {
      if (parents.father.children[i].first_name == first_name) return false;
    }
    return true;
  }
}
