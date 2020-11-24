let updating = false;
class Map {
  constructor(config) {
    this.canvas_size = config.canvas_size;
    this.map_scale = config.map_scale || 1; // map scale =
    this.location = config.location;
    this.zoom = config.zoom;
    this.img = createImage(this.canvas_size.x, this.canvas_size.y);
    this.terrain_types = [
      {
        name: "Deep Sea",
        max: 80,
        func: (n) => {
          return [0, 105, 148];
        },
      },
      {
        name: "Shallows",
        max: 100,
        func: (n) => {
          return [
            (59 * n) / 80 - (n % 10),
            (179 * n) / 80 - (n % 10),
            (200 * n) / 80 - (n % 10),
          ];
        },
      },
      {
        name: "Coast/Beach",
        max: 120,
        func: (n) => {
          return [
            (194 * n) / 100 - (n % 5),
            (178 * n) / 100 - (n % 5),
            (128 * n) / 100 - (n % 5),
          ];
        },
      },
      {
        name: "Plains",
        max: 150,
        func: (n) => {
          return [
            (96 * n) / 120 - (n % 10),
            (128 * n) / 120 - (n % 10),
            (56 * n) / 120 - (n % 10),
          ];
        },
      },
      {
        name: "Forest",
        max: 180,
        func: (n) => {
          return [
            (1 * n) / 150 - (n % 10),
            (68 * n) / 150 - (n % 10),
            (33 * n) / 150 - (n % 10),
          ];
        },
      },
      {
        name: "Mountains",
        max: 200,
        func: (n) => {
          return [
            (90 * n) / 180 - (n % 10),
            (77 * n) / 180 - (n % 10),
            (65 * n) / 180 - (n % 10),
          ];
        },
      },
      {
        name: "Snow",
        max: Infinity,
        func: (n) => {
          return [n - (n % 10), n - (n % 10), n - (n % 10)];
        },
      },
    ];
    console.log(config);
    let index;
    this.height = [];
    this.img.loadPixels();
    for (let i = 0; i < this.canvas_size.x; i++) {
      this.height[i] = [];
      for (let j = 0; j < this.canvas_size.y; j++) {
        index = 4 * (j * this.canvas_size.x + i);
        var x = i * this.map_scale;
        var y = j * this.map_scale;
        var n = this.get_altitude(x, y);

        this.height[i][j] = n;
        for (var terrain in this.terrain_types) {
          if (n < this.terrain_types[terrain].max) {
            var terr = this.terrain_types[terrain].func(n);
            this.img.pixels[index] = terr[0];
            this.img.pixels[index + 1] = terr[1];
            this.img.pixels[index + 2] = terr[2];
            break;
          }
        }
        this.img.pixels[index + 3] = 255;
        if (n < 100) this.img.pixels[index + 3] = n;
      }
    }
    this.img.updatePixels();
    console.log("yes");
  }
  get_pixel(x, y) {
    let scale = this.map_scale / this.zoom;
    var i = x / scale - this.location.x / scale + this.canvas_size.x / 2;
    var j = y / scale - this.location.y / scale + this.canvas_size.y / 2;
    return [i, j];
    //let x = i * scale + position.x - (this.canvas_size.x * scale) / 2;
    //let y = j * scale + position.y - (this.canvas_size.y * scale) / 2;
  }
  get_location(i, j) {
    let scale = this.map_scale / this.zoom;
    //var i = x / scale - this.location.x / scale + this.canvas_size.x / 2;
    var x = (i + this.location.x / scale - this.canvas_size.x / 2) * scale;
    var y = (j + this.location.y / scale - this.canvas_size.y / 2) * scale;
    //var j = y / scale - this.location.y / scale + this.canvas_size.y / 2;
    return [x, y];
  }
  get_altitude(x, y) {
    x = x / this.map_scale;
    y = y / this.map_scale;
    var n = noise((x * this.map_scale) / 90, (y * this.map_scale) / 90) * 255;
    let falloff =
      600 *
        (((x - this.canvas_size.x / 2) * (x - this.canvas_size.x / 2)) /
          (this.canvas_size.x * this.canvas_size.x) +
          ((y - this.canvas_size.y / 2) * (y - this.canvas_size.y / 2)) /
            (this.canvas_size.y * this.canvas_size.y)) -
      50;
    n -= falloff;
    return n;
  }
  draw_map(location, zoom) {
    this.location = location;
    this.zoom = zoom;
    image(
      this.img,

      this.canvas_size.x / 2 - (location.x / this.map_scale) * zoom,

      this.canvas_size.y / 2 - (location.y / this.map_scale) * zoom,
      this.canvas_size.x * zoom,
      this.canvas_size.y * zoom
    );
  }
  inWater(pos) {
    var alt = this.get_altitude(pos.x, pos.y);
    if (
      alt > 100 &&
      ((pos.x + 10 > width && alt > 100) ||
        (pos.x - 10 >= 0 && alt > 100) ||
        (pos.y + 10 < height && alt > 100) ||
        (pos.y - 10 >= 0 && alt > 100))
    )
      return false;

    return true;
  }
  get_alt(x, y) {
    return this.height[Math.floor(x)][Math.floor(y)];
  }
  check_co_ordinates(a, shore, direction, type, settlements) {
    //console.log(direction);

    var x;
    var y;
    var margin = 50;
    var step_size = 5;
    if (shore) {
      //find location on shore
      if (Math.floor(direction) == 0) {
        //top
        x = Math.floor(this.map_scale * this.canvas_size.x * a) * 5;
        y = margin;
        while (
          y < this.map_scale * this.canvas_size.y - margin - step_size &&
          this.inWater({ x: x, y: y })
        )
          y += 5;
      } else if (Math.floor(direction) == 1) {
        //left
        x = margin;
        y = Math.floor((this.map_scale * this.canvas_size.y * a) / 5) * 5;
        while (
          x < this.map_scale * this.canvas_size.x - margin - step_size &&
          this.inWater({ x: x, y: y })
        )
          x += 5;
      } else if (Math.floor(direction) == 2) {
        //bottom
        x = Math.floor((width * a) / 5) * 5;
        y = this.map_scale * this.canvas_size.y - margin - step_size;
        while (y > margin && this.inWater({ x: x, y: y })) y -= 5;
      } else if (Math.floor(direction) == 3) {
        //right
        x = this.map_scale * this.canvas_size.x - margin - step_size;
        y = Math.floor((height * a) / 5) * 5;
        while (x > margin && this.inWater({ x: x, y: y })) x -= 5;
      }
    } else {
      if (Math.floor(direction) == 0) {
        //top
        x = Math.floor(this.map_scale * this.canvas_size.x * a);
        y =
          (this.canvas_size.y * this.map_scale) / 4 +
          this.map_scale * this.canvas_size.y * noise(a + direction);
        //while (y < height && this.inWater({ x: x, y: y })) y += 5;
      } else if (Math.floor(direction) == 1) {
        //left
        x =
          (this.canvas_size.x * this.map_scale) / 4 +
          this.map_scale * this.canvas_size.x * noise(a + direction);
        y = Math.floor(this.map_scale * this.canvas_size.y * a);
        //while (x < width && this.inWater({ x: x, y: y })) x += 5;
      } else if (Math.floor(direction) == 2) {
        //bottom
        x = Math.floor(this.map_scale * this.canvas_size.x * a);
        y =
          (3 * this.canvas_size.y * this.map_scale) / 4 -
          this.map_scale * this.canvas_size.y * noise(a + direction);
        //while (y > 0 && this.inWater({ x: x, y: y })) y -= 5;
      } else if (Math.floor(direction) == 3) {
        //right
        x =
          (3 * this.canvas_size.x * this * this.map_scale) / 4 -
          this.map_scale * this.canvas_size.x * noise(a + direction);
        y = Math.floor(this.map_scale * this.canvas_size.y * a);
        //while (x > 0 && this.inWater({ x: x, y: y })) x -= 5;
      }
      x = this.map_scale * this.canvas_size.x * noise(direction * 100);
      y = this.map_scale * this.canvas_size.x * noise(a * 100);
      //Math.floor(this.map_scale * this.canvas_size.y * a);
      //find location somewhere in the middle
    }

    if (
      this.inWater({
        x: x,
        y: y,
      })
    )
      return false;
    //console.log([x, this.canvas_size.x * this.map_scale - margin - step_size]);
    if (
      x > margin &&
      x < this.canvas_size.x * this.map_scale - margin - step_size &&
      y > margin &&
      y < this.canvas_size.y * this.map_scale - margin - step_size
    ) {
      var flag = true;
      //console.log(settlements);
      for (var settlement in [...Object.keys(settlements)]) {
        //console.log(settlement);
        if (
          (settlements[settlement].location.x - x) *
            (settlements[settlement].location.x - x) +
            (settlements[settlement].location.y - y) *
              (settlements[settlement].location.y - y) <
          ((this.canvas_size.x * this.canvas_size.x +
            this.canvas_size.y * this.canvas_size.y) *
            this.map_scale *
            this.map_scale) /
            (this.canvas_size.x * 10)
        ) {
          flag = false;
          break;
        }
      }
      if (flag == true) return { x: x, y: y };
    }
    return false;
  }
}

class HighResMap {
  constructor(config) {
    this.canvas_size = config.canvas_size;
    this.map_scale = config.map_scale || 1;
    this.terrain_types = [
      {
        name: "Deep Sea",
        max: 80,
        func: (n) => {
          return [0, 105, 148];
        },
      },
      {
        name: "Shallows",
        max: 100,
        func: (n) => {
          return [
            (59 * n) / 80 - (n % 10),
            (179 * n) / 80 - (n % 10),
            (200 * n) / 80 - (n % 10),
          ];
        },
      },
      {
        name: "Coast/Beach",
        max: 120,
        func: (n) => {
          return [
            (194 * n) / 100 - (n % 5),
            (178 * n) / 100 - (n % 5),
            (128 * n) / 100 - (n % 5),
          ];
        },
      },
      {
        name: "Plains",
        max: 150,
        func: (n) => {
          return [
            (96 * n) / 120 - (n % 10),
            (128 * n) / 120 - (n % 10),
            (56 * n) / 120 - (n % 10),
          ];
        },
      },
      {
        name: "Forest",
        max: 180,
        func: (n) => {
          return [
            (1 * n) / 150 - (n % 10),
            (68 * n) / 150 - (n % 10),
            (33 * n) / 150 - (n % 10),
          ];
        },
      },
      {
        name: "Mountains",
        max: 200,
        func: (n) => {
          return [
            (90 * n) / 180 - (n % 10),
            (77 * n) / 180 - (n % 10),
            (65 * n) / 180 - (n % 10),
          ];
        },
      },
      {
        name: "Snow",
        max: Infinity,
        func: (n) => {
          return [n - (n % 10), n - (n % 10), n - (n % 10)];
        },
      },
    ];
    this.img = createImage(this.canvas_size.x, this.canvas_size.y);
    this.position = config.location;
    this.zoom = null;
    this.updating = true;
    this.i = 0;
  }
  update(position, zoom) {
    /*if (this.position.x != position.x || this.zoom != zoom) {
      this.i = 0;
      this.position = position;
      this.zoom = zoom;
      this.updating = true;
    }*/

    /*if (this.position.x == position.x && this.zoom == zoom) {
      return;
    }*/
    var i = 0;
    this.position = position;
    this.zoom = zoom;
    let scale = this.map_scale / zoom;
    let index;
    this.img.loadPixels();

    for (; i < this.canvas_size.x; i++) {
      //for (; i < this.i + 100 && i < this.canvas_size.x; i++) {
      for (let j = 0; j < this.canvas_size.y; j++) {
        //let x = i * scale + position.x - width / (2 * zoom);
        //let y = j * scale + position.y - width / (2 * zoom);
        let x = i * scale + position.x - (this.canvas_size.x * scale) / 2;
        let y = j * scale + position.y - (this.canvas_size.y * scale) / 2;

        /**
         * 1/4 canvas_size.x
         * position.y = canvas_size.x/2
         *
         */
        //index = 4 * (j * width + i);
        index = 4 * (j * this.canvas_size.x + i);
        var n = this.get_altitude(x, y);

        for (var terrain in this.terrain_types) {
          //console.log(terrain);
          if (n < this.terrain_types[terrain].max) {
            var terr = this.terrain_types[terrain].func(n);
            this.img.pixels[index] = terr[0];
            this.img.pixels[index + 1] = terr[1];
            this.img.pixels[index + 2] = terr[2];
            break;
          }
        }
        this.img.pixels[index + 3] = 255;
        if (n < 100) this.img.pixels[index + 3] = n;
      }
    }
    this.img.updatePixels();

    this.updating = false;
  }
  get_altitude(x, y) {
    x = x / this.map_scale;
    y = y / this.map_scale;
    var n = noise((x * this.map_scale) / 90, (y * this.map_scale) / 90) * 255;
    let falloff =
      600 *
        (((x - this.canvas_size.x / 2) * (x - this.canvas_size.x / 2)) /
          (this.canvas_size.x * this.canvas_size.x) +
          ((y - this.canvas_size.y / 2) * (y - this.canvas_size.y / 2)) /
            (this.canvas_size.y * this.canvas_size.y)) -
      50;
    n -= falloff;
    return n;
  }
  draw_map() {
    if (!this.updating)
      image(this.img, 0, 0, this.canvas_size.x, this.canvas_size.y);
  }
  inWater(pos) {
    if (this.height[Math.round(pos.x)][Math.round(pos.y)] < 95) {
      return true;
    } else return false;
  }
}

function updateZoom() {
  //updating = true;
  /*var upd = setTimeout(function () {
    highresMap.update();
  }, 100);*/
}

function terrainType(location) {}
function keyReleased() {
  if (keyCode === LEFT_ARROW) {
    mapMove.x = 0;
  } else if (keyCode === RIGHT_ARROW) {
    mapMove.x = 0;
  }
}

function newMap() {
  //worldMap = new Map();
  var newWorker = new Worker("newMap.js");
}

async function newM() {
  worldMap = new Map();
}
