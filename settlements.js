class Settlements {
  constructor(config) {
    this.id_counter = 0;
    this.population_size = config.population_size;
    this.remaining_population = this.population_size;
    this.map = config.map;
    this.village_population_range = config.village_population_range;
    this.city_population_range = config.city_population_range;
    this.num_cities =
      config.num_cities || Math.floor((this.population_size * 0.6) / 50000);
    this.num_villages =
      config.num_villages || Math.floor((this.population_size * 0.4) / 10000);
    this.settlements = {};
    this.highways = {};
    this.settlement_names = config.settlement_names;
    console.log("generating cities");
    this.generate();
    console.log("generating highways");
    this.connect_highways();
    console.log("creating image");
    this.img = createGraphics(this.map.canvas_size.x, this.map.canvas_size.y);
    this.generate_settlements_map();
    this.populate_cities();
  }
  populate_cities() {
    this.remaining_population = this.population_size;
    var avg_city_population = 50000;
    var avg_village_population = 5000;
    for (var i in this.settlements) {
      var settlement = this.settlements[i];
      if (settlement.type == "city") {
        settlement.population_count = avg_city_population;
        this.remaining_population -= settlement.population_count;
      } else {
        settlement.population_count = avg_village_population;
        this.remaining_population -= settlement.population_count;
      }
    }
    for (var i in this.settlements) {
      var settlement = this.settlements[i];
      if (settlement.category == "major city") {
        settlement.population_count += 10000;
        this.remaining_population -= 10000;
      } else if (settlement.category == "city") {
        settlement.population_count -= 10000;
        this.remaining_population += 10000;
      }
    }
    this.capital.population_count += this.remaining_population;
    this.remaining_population = 0;
  }
  generate_settlements_map() {
    //creates an image of the settlements to reduce load on rendering
    for (var i in this.highways) {
      var highway = this.highways[i];
      this.img.beginShape();
      this.img.noFill();
      this.img.stroke(255);
      this.img.strokeWeight(2);
      for (var j in highway.points) {
        var point = highway.points[j];
        //ellipse(point[0], point[1], 2, 2);
        this.img.curveVertex(...this.map.get_pixel(point[0], point[1]));
      }
      this.img.endShape();
      //this.img.noStroke();
      this.img.fill(255);
    }
    this.img.stroke(0);
    this.img.strokeWeight(1);
    for (var settlement in this.settlements) {
      var s = this.map.canvas_size.x / 140;
      if (this.settlements[settlement].category == "capital")
        s = this.map.canvas_size.x / 40;
      if (this.settlements[settlement].category == "major city")
        s = this.map.canvas_size.x / 60;
      if (this.settlements[settlement].category == "city")
        s = this.map.canvas_size.x / 100;
      this.img.ellipse(
        ...this.map.get_pixel(
          this.settlements[settlement].location.x,
          this.settlements[settlement].location.y
        ),
        s,
        s
      );
    }
  }

  connect_highways() {
    var tree_members = [this.capital];
    this.highlighted = this.capital;
    this.capital.visited == true;
    var remaining = [];
    for (var i in this.major_cities) {
      remaining.push(this.major_cities[i]);
    }
    while (remaining.length != 0) {
      var d = Infinity;
      var a;
      var b;
      for (var c in remaining) {
        var city = remaining[c];
        for (var dest in tree_members) {
          var destination = tree_members[dest];
          var dist =
            Math.pow(city.location.x - destination.location.x, 2) +
            Math.pow(city.location.y - destination.location.y, 2);
          if (dist < d) {
            d = dist;
            a = c;
            b = dest;
          }
        }
      }
      var new_highway = new Highway({
        source: tree_members[b],
        dest: remaining[a],
        map: this.map,
      });
      tree_members[b].road_connections.push(remaining[a]);
      remaining[a].road_connections.push(tree_members[b]);
      this.highways[tree_members[b].id + "" + remaining[a].id] = new_highway;
      tree_members.push(remaining[a]);
      remaining[a].visited = true;
      remaining.splice(a, 1);
    }
    for (var i in this.settlements) {
      if (!this.settlements[i].visited && this.settlements[i].type == "city")
        remaining.push(this.settlements[i]);
    }
    while (remaining.length != 0) {
      var d = Infinity;
      var a;
      var b;
      for (var c in remaining) {
        var city = remaining[c];
        for (var dest in tree_members) {
          var destination = tree_members[dest];
          var dist =
            Math.pow(city.location.x - destination.location.x, 2) +
            Math.pow(city.location.y - destination.location.y, 2);
          if (dist < d) {
            d = dist;
            a = c;
            b = dest;
          }
        }
      }
      var new_highway = new Highway({
        source: tree_members[b],
        dest: remaining[a],
        map: this.map,
      });
      tree_members[b].road_connections.push(remaining[a]);
      remaining[a].road_connections.push(tree_members[b]);
      this.highways[tree_members[b].id + "" + remaining[a].id] = new_highway;
      tree_members.push(remaining[a]);
      remaining[a].visited = true;
      remaining.splice(a, 1);
    }

    for (var i in this.settlements) {
      if (!this.settlements[i].visited && this.settlements[i].type == "village")
        remaining.push(this.settlements[i]);
    }
    while (remaining.length != 0) {
      var d = Infinity;
      var a;
      var b;
      for (var c in remaining) {
        var city = remaining[c];
        for (var dest in tree_members) {
          var destination = tree_members[dest];
          var dist =
            Math.pow(city.location.x - destination.location.x, 2) +
            Math.pow(city.location.y - destination.location.y, 2);
          if (dist < d) {
            d = dist;
            a = c;
            b = dest;
          }
        }
      }
      var new_highway = new Highway({
        source: tree_members[b],
        dest: remaining[a],
        map: this.map,
      });
      tree_members[b].road_connections.push(remaining[a]);
      remaining[a].road_connections.push(tree_members[b]);
      this.highways[tree_members[b].id + "" + remaining[a].id] = new_highway;
      tree_members.push(remaining[a]);
      remaining[a].visited = true;
      remaining.splice(a, 1);
    }

    /*while (!this.check_highways()) {
      var new_highway = new Highway({
        settlements: this.settlements,
        highways: this.highways,
        map: this.map,
      });
      this.highways[
        new_highway.settlement1.id + " " + new_highway.settlement2.id
      ] = new_highway;
      this.highways[
        new_highway.settlement2.id + " " + new_highway.settlement1.id
      ] = new_highway;
      new_highway.settlement1.road_connections.push(new_highway.settlement2.id);
      new_highway.settlement2.road_connections.push(new_highway.settlement1.id);
    }*/
  }
  check_highways() {
    if (Object.keys(this.highways).length == 0) {
      return false;
    } else {
      var settlements = [
        this.highways[Object.keys(this.highways)[0]].settlement1.id,
      ];
      var visited = {};
      while (settlements.length > 0) {
        var curr_settlement = settlements.splice(0, 1);
        visited[curr_settlement] = true;
        for (var i in this.settlements[curr_settlement].road_connections) {
          if (!visited[this.settlements[curr_settlement].road_connections[i]]) {
            settlements.push(
              this.settlements[curr_settlement].road_connections[i]
            );
          }
        }
      }
      //console.log(visited);
      if (Object.keys(visited).length == Object.keys(this.settlements).length) {
        return true;
      }
    }
    return false;
  }
  draw(position, zoom) {
    image(
      this.img,
      this.map.canvas_size.x / 2 - (position.x / this.map.map_scale) * zoom,
      this.map.canvas_size.y / 2 - (position.y / this.map.map_scale) * zoom,
      this.map.canvas_size.x * zoom,
      this.map.canvas_size.y * zoom
    );
    this.highlighted_settlement();
    //console.log(this.highlighted);
    fill("rgba(0, 255, 0, 0.5)");
    ellipse(
      ...this.map.get_pixel(
        this.highlighted.location.x,
        this.highlighted.location.y
      ),
      15,
      15
    );
  }
  highlighted_settlement() {
    var min_d = Infinity;
    var highlighted = null;
    for (var i in this.settlements) {
      var settlement = this.settlements[i];
      var mouse = this.map.get_location(mouseX, mouseY);
      var d =
        Math.pow(settlement.location.x - mouse[0], 2) +
        Math.pow(settlement.location.y - mouse[1], 2);
      if (d < min_d) {
        min_d = d;
        highlighted = settlement;
      }
    }
    if (this.highlighted != highlighted) {
      this.highlighted = highlighted;
    }
    document.getElementById("city_name").innerText =
      this.highlighted.name + " (" + this.highlighted.category + ")";
    document.getElementById("city_population").innerText =
      "Population : " + this.highlighted.population_count;
    //console.log(this.highlighted);
  }
  draw_highways() {
    for (var i in this.highways) {
      var highway = this.highways[i];
      beginShape();
      noFill();
      stroke(255);
      for (var j in highway.points) {
        var point = highway.points[j];
        //ellipse(point[0], point[1], 2, 2);
        curveVertex(point[0], point[1]);
      }
      endShape();
      fill(255);
    }
  }

  generate() {
    //generate cities
    //var try_counter = 0;
    /**
     * cities = 0.6
     * Select a capital city
     * Select couple of major cities 0.6
     * Select Minor Cities 0.4
     *
     * 0.4
     * Select Bigger villages 0.6
     * Select Smaller Villages 0.4
     */

    //capital city
    /*while (true) {
      var loc = (Math.sin(noise(try_counter) * 10) + 1) * 2;
      var direction = Math.floor(
        (Math.sin(noise(try_counter + 0.5) * 10) + 1) * 2
      );
      this.remaining_population -= population;
      var shore = true;
      var loc = this.map.check_co_ordinates(
        loc,
        shore,
        direction,
        "city",
        this.settlements
      );
      if (loc) {
        var city = new Settlement({
          id: this.id_counter,
          type: "Capital",
          population: 0,
          location: loc,
          settlement_names: this.settlement_names,
        });
        this.settlements[this.id_counter] = village;
        this.id_counter++;
        break;
      }
    }*/

    var try_counter = 0;
    this.major_cities = [];
    while (this.id_counter < this.num_cities + this.num_villages) {
      if (this.id_counter < this.num_cities) {
        // generate city
        var loc = Math.sin(noise(try_counter * 0.1));
        var shore = Math.sin(noise(try_counter * 0.2) * 10) < 0;
        var direction =
          (Math.sin(noise(try_counter * 0.05 + 0.25) * 360) + 1) * 2;
        var loc = this.map.check_co_ordinates(
          loc,
          shore,
          direction,
          "city",
          this.settlements
        );
        //console.log(loc);
        if (loc) {
          var city = new Settlement({
            id: this.id_counter,
            type: "city",
            category: "city",
            population_count:
              Math.floor((noise(try_counter + 1) * 2750) / 2) + 2750 / 2,
            location: loc,
            settlement_names: this.settlement_names,
          });
          this.settlements[this.id_counter] = city;
          this.major_cities.push(city);
          this.id_counter++;
        }
      } else {
        //generate a village
        var loc = (Math.sin(noise(try_counter * 300)) + 1) / 2;
        var shore = Math.sin(noise(try_counter * 2) * 360) > 0.9;
        var direction = (Math.sin(noise(try_counter * 5 + 0.25) * 360) + 1) * 2;
        var loc = this.map.check_co_ordinates(
          loc,
          shore,
          direction,
          "village",
          this.settlements
        );
        if (loc) {
          var village = new Settlement({
            id: this.id_counter,
            type: "village",
            category: "village",
            population_count: Math.floor(noise(try_counter + 1) * 275) + 275,
            location: loc,
            settlement_names: this.settlement_names,
          });
          this.settlements[this.id_counter] = village;
          this.id_counter++;
        }
      }
      try_counter++;
    }
    this.capital = this.settlements[0];

    //this.major_cities.splice(0, 1);
    this.major_cities = this.major_cities.splice(
      0,
      Math.floor(this.major_cities.length / 2)
    );
    for (var i in this.major_cities) {
      this.major_cities[i].category = "major city";
    }
    this.capital.category = "capital";
    //this.major_cities = [];
    //for (var i = 1; i < this.num_cities / 2; i++) {
    //this.settlements[i].category = "major city";
    //this.major_cities.push(this.settlements[i]);
    //}
  }
}
class Settlement {
  constructor(config) {
    this.id = config.id;
    this.type = config.type; //Village or City
    this.category = config.category;
    this.population_count = config.population_count;
    this.population = [];
    this.name = config.name || config.settlement_names.random_name(this.type);
    /*this.population_stats = {
      healthy: config.population_stats.healthy || null,
      sick: config.population_stats.sick || null,
    };
    this.airport = config.airport || false;
    this.railway = config.railway || false;
    this.num_hospitals = config.num_hospitals || 1;*/
    this.location = config.location;
    this.road_connections = [];
    //this.generate();
  }
  generate() {}
  draw() {}
  //new_location() {}
}
class CommunityNames {
  constructor() {
    this.first_names = [
      "Basker",
      "Sherlock",
      "Ever",
      "Spring",
      "Summer",
      "Mountain",
      "Lake",
      "Richmond",
      "Kazakh",
      "Happy",
      "Ocean",
      "Holy",
      "Bay",
      "Cape",
      "Royal",
    ];
    this.last_city_names = [
      "ville",
      " City",
      " Area",
      "dale",
      "view",
      "land",
      "port",
    ];
    this.last_village_names = [
      " Town",
      " Ranch",
      "ville",
      " Drive",
      "fellas",
      "lodge",
      " area",
      "field",
      "view",
      "land",
      "landing",
      " Citadel",
    ];
    this.taken_names = {};
    this.try_name_length = 2;
  }
  random_name(type) {
    var name = "";
    var miss_counter = 0;
    while (true) {
      var first_name = "";
      for (var i = 0; i < this.try_name_length - 1; i++) {
        first_name =
          first_name +
          this.first_names[Math.floor(random(this.first_names.length))];
      }
      var last_name = "";
      if (type == "city") {
        last_name =
          last_name +
          this.last_city_names[Math.floor(random(this.last_city_names.length))];
      } else {
        last_name =
          last_name +
          this.last_village_names[
            Math.floor(random(this.last_village_names.length))
          ];
      }

      if (this.taken_names[first_name + last_name]) {
        miss_counter++;
        if (miss_counter == 5) {
          this.try_name_length++;
        }
      } else {
        this.taken_names[first_name + last_name] = true;
        return first_name + last_name;
      }
    }
  }
}
class Highway {
  constructor(config) {
    //console.log(config);
    this.settlement1 = config.source;
    this.settlement2 = config.dest;
    this.step_size = 1;
    this.points = [[this.settlement1.location.x, this.settlement1.location.y]];
    while (true) {
      //for (var j = 0; j < 200; j++) {
      var d = Math.sqrt(
        Math.pow(
          this.points[this.points.length - 1][0] - this.settlement2.location.x,
          2
        ) +
          Math.pow(
            this.points[this.points.length - 1][1] -
              this.settlement2.location.y,
            2
          )
      );
      if (d < this.step_size) {
        this.points.push([
          this.settlement2.location.x,
          this.settlement2.location.y,
        ]);
        break;
      } else {
        var score = 0;
        var angle = 0;
        for (var i = 0; i < 2 * Math.PI; i += Math.PI / 12) {
          var x =
            this.points[this.points.length - 1][0] +
            this.step_size * Math.sin(i);
          var y =
            this.points[this.points.length - 1][1] +
            this.step_size * Math.cos(i);
          var new_d = Math.sqrt(
            Math.pow(x - this.settlement2.location.x, 2) +
              Math.pow(y - this.settlement2.location.y, 2)
          );
          var delta_terrain =
            Math.abs(
              config.map.get_altitude(
                this.points[this.points.length - 1][0],
                this.points[this.points.length - 1][1]
              ) - config.map.get_altitude(x, y)
            ) / 10;

          var terr_h = config.map.get_altitude(x, y);
          var delta_ground = Math.abs(terr_h - 110) / 50;
          if (terr_h < 100) {
            delta_ground = 1;
            delta_terrain = this.step_size * 0.9;
          }
          //if (delta_terrain > 5) continue;
          var curr_score = (d - new_d) / delta_terrain; //delta_ground);
          if (curr_score > score) {
            score = curr_score;
            angle = i;
          }
        }
        this.points.push([
          this.points[this.points.length - 1][0] +
            this.step_size * Math.sin(angle),
          this.points[this.points.length - 1][1] +
            this.step_size * Math.cos(angle),
        ]);
      }
    }
    /*
    this.points = [[this.settlement1.location.x, this.settlement1.location.y]];
    var nodes = [
      {
        x: Math.floor(this.settlement1.location.x),
        y: Math.floor(this.settlement1.location.y),
        score: -Math.sqrt(
          Math.pow(
            this.settlement1.location.x - this.settlement2.location.x,
            2
          ) +
            Math.pow(
              this.settlement1.location.y - this.settlement2.location.y,
              2
            )
        ),
      },
    ];
    var active_nodes = nodes[0];
    var neighbors = [
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1],
      [-1, -1],
      [-1, 0],
      [-1, 1],
    ];
    var flag = true;
    var status = {};
    status[nodes[0].x + " " + nodes[0].y] = nodes[0];
    while (flag) {
      var node = nodes[0];
      //add neighbors
      for (n in neighbors) {
        if (status[node.x + neighbors[n][0] + " " + (node.y + neighbors[n][1])])
          continue;
        var new_node = {
          x: node.x + neighbors[n][0],
          y: node.y + neighbors[n][1],
          score: 0,
        };
        if (
          new_node.x == Math.floor(this.settlement2.location.x) &&
          new_node.x == Math.floor(this.settlement2.location.x)
        ) {
          new_node.score = -Infinity;
          flag = false;
          nodes.push(new_node);
          status[new_node.x + " " + new_node.y] = new_node;
          break;
        }

        new_node.score = -Math.sqrt(
          Math.pow(new_node.x - this.settlement2.location.x, 2) +
            Math.pow(new_node.y - this.settlement2.location.y, 2)
        );
        if (neighbors[n][0] == 0 || neighbors[n][1] == 0) {
          new_node.score += 1 * this.step_size;
        } else new_node.score += this.step_size * Math.sqrt(2);
        if (config.map.inWater) {
          new_node.score += 0.5;
        } else
          new_node.score +=
            Math.abs(
              config.map.get_altitude(node.x, node.y) -
                config.map.get_altitude(new_node.x, new_node.y)
            ) / 10;
      }
      nodes.splice;
      status[node.x + " " + node.y] = node;
    }
    flag = true;
    var node =
      status[
        Math.floor(this.settlement1.x) + " " + Math.floor(this.settlement1.y)
      ];
    while (flag) {
      var min = Infinity;
      var min_node = null;
      for (n in neighbors) {
        var x = node.x + neighbors[n][0] + " " + (node.y + neighbors[n][1]);
        if (status[x] && status[x].score < min) {
          min = status[x].score;
          min_node = status[x];
        }
      }
      if (min == Infinity) break;
      this.points.push([min_node.x, min_node.y]);
    }
    this.points.push([
      this.settlement2.location.x,
      this.settlement2.location.y,
    ]);*/
    /*
    this.settlement1;
    this.settlement2;
    this.length = Infinity;
    for (var s1 in config.settlements) {
      if (
        config.settlements[s1].type == "village" &&
        config.settlements[s1].road_connections.length > 1
      )
        continue;
      for (var s2 in config.settlements) {
        if (s1 == s2) continue;
        if (config.settlements[s2].road_connections.length > 21) continue;
        var str = "";
        str += s1 + " " + s2;
        if (config.highways[str]) {
          continue;
        }
        var curr_length = Math.sqrt(
          Math.pow(
            config.settlements[s1].location.x -
              config.settlements[s2].location.x,
            2
          ) +
            Math.pow(
              config.settlements[s1].location.y -
                config.settlements[s2].location.y,
              2
            )
        );
        if (curr_length < this.length) {
          this.length = curr_length;
          this.settlement1 = config.settlements[s1];
          this.settlement2 = config.settlements[s2];
        }
      }
    }
    this.step_size = 1;
    this.points = [[this.settlement1.location.x, this.settlement1.location.y]];
    while (true) {
      //for (var j = 0; j < 200; j++) {
      var d = Math.sqrt(
        Math.pow(
          this.points[this.points.length - 1][0] - this.settlement2.location.x,
          2
        ) +
          Math.pow(
            this.points[this.points.length - 1][1] -
              this.settlement2.location.y,
            2
          )
      );
      if (d < this.step_size) {
        this.points.push([
          this.settlement2.location.x,
          this.settlement2.location.y,
        ]);
        break;
      } else {
        var score = 0;
        var angle = 0;
        for (var i = 0; i < 2 * Math.PI; i += Math.PI / 12) {
          var x =
            this.points[this.points.length - 1][0] +
            this.step_size * Math.sin(i);
          var y =
            this.points[this.points.length - 1][1] +
            this.step_size * Math.cos(i);
          var new_d = Math.sqrt(
            Math.pow(x - this.settlement2.location.x, 2) +
              Math.pow(y - this.settlement2.location.y, 2)
          );
          var delta_terrain = Math.abs(
            config.map.get_alt(
              this.points[this.points.length - 1][0],
              this.points[this.points.length - 1][1]
            ) - config.map.get_alt(x, y)
          );

          var terr_h = config.map.get_alt(x, y);
          var delta_ground = Math.abs(terr_h - 110) / 50;
          if (terr_h > 100 && terr_h < 180) {
            delta_ground = 1;
          }
          //if (delta_terrain > 5) continue;
          var curr_score = (d - new_d) / delta_terrain; //delta_ground);
          if (curr_score > score) {
            score = curr_score;
            angle = i;
          }
        }
        this.points.push([
          this.points[this.points.length - 1][0] +
            this.step_size * Math.sin(angle),
          this.points[this.points.length - 1][1] +
            this.step_size * Math.cos(angle),
        ]);
      }
    }*/
  }
}
