let updating = false;
class Map {
  constructor(config) {
    this.canvas_size = config.canvas_size;
    this.map_scale = config.map_scale || 1; // map scale =
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
    let index;
    this.height = [];
    this.img.loadPixels();

    for (let i = 0; i < this.canvas_size.x; i++) {
      this.height[i] = [];
      for (let j = 0; i < this.canvas_size.y; j++) {
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
    for (let i = 0; i < width; i++) {
      this.height[i] = [];
      for (let j = 0; j < height; j++) {
        //index = 4 * (j * width + i);
        index = 4 * (j * width + i);
        n =
          noise(
            i / (90 * this.map_scale) + offset,
            j / (90 * this.map_scale)

            //noise(i) / 100
          ) * 255;
        let falloff =
          600 *
            (((i - width / 2) * (i - width / 2)) / (width * width) +
              ((j - height / 2) * (j - height / 2)) / (height * height)) -
          50;
        n -= falloff;
        this.height[i][j] = n;
        //console.log(n);
        /*let falloff = width / 2 - i;
        if (falloff < 0) {
          falloff = -falloff;
        }
        if (falloff > width / 4) {
          falloff -= width / 4;
          falloff = (50 * falloff) / width;
          n -= falloff * falloff;
        }
        falloff = height / 2 - j;
        if (falloff < 0) {
          falloff = -falloff;
        }
        if (falloff > height / 4) {
          falloff -= height / 4;
          falloff = (50 * falloff) / height;
          n -= falloff * falloff;
        }*/
        for (var terrain in this.terrain_types) {
          //console.log(terrain);
          if (n < this.terrain_types[terrain].max) {
            var x = this.terrain_types[terrain].func(n);
            this.img.pixels[index] = x[0];
            this.img.pixels[index + 1] = x[1];
            this.img.pixels[index + 2] = x[2];
            break;
          }
        }
        /*if (n > 190) {
          //n = noise(noise(i / factor1) / factor2, noise(j / factor1) / factor2) * 255;
          img.pixels[index] = n - (n % 10) + 30;
          img.pixels[index + 1] = n - (n % 10) + 30;
          img.pixels[index + 2] = n - (n % 10) + 30;
        } else if (n <= 95 && n > 80) {
          img.pixels[index] = 59;
          img.pixels[index + 1] = 179;
          img.pixels[index + 2] = 200;
        } else if (n <= 80) {
          img.pixels[index] = 0;
          img.pixels[index + 1] = 105;
          img.pixels[index + 2] = 148;
        } else if (n > 95 && n <= 110) {
          img.pixels[index] = 194;
          img.pixels[index + 1] = 178;
          img.pixels[index + 2] = 128;
        } else if (n > 110 && n < 135) {
          img.pixels[index] = 96;
          img.pixels[index + 1] = 128;
          img.pixels[index + 2] = 56;
        } else if (n > 135 && n < 160) {
          img.pixels[index] = 1;
          img.pixels[index + 1] = 68;
          img.pixels[index + 2] = 33;
        } else {
          img.pixels[index] = 90;
          img.pixels[index + 1] = 77;
          img.pixels[index + 2] = 65;
        }*/
        /*if (n % 10 > 0 && n % 10 < 2) {
          img.pixels[index] = 0;
          img.pixels[index + 1] = 0;
          img.pixels[index + 2] = 0;
        }*/
        //img.pixels[index] = 255 - falloff;
        //img.pixels[index + 1] = 255 - falloff;
        //img.pixels[index + 2] = 255 - falloff;
        this.img.pixels[index + 3] = 255;
        if (n < 100) this.img.pixels[index + 3] = n;
        /*if (n % 10 > 0 && n % 10 <= 0.5) {
              pixels[index] = 0;
              pixels[index + 1] = 0;
              pixels[index + 2] = 0;
              pixels[index + 3] = 122;
            }*/
      }
    }
    this.img.updatePixels();
  }
  get_altitude(x, y) {
    x = x / this.map_scale;
    y = y / this.map_scale;
    var n = noise(x, y) * 255;
    let falloff =
      600 *
        (((x - width / 2) * (x - width / 2)) / (width * width) +
          ((y - height / 2) * (y - height / 2)) / (height * height)) -
      50;
    n -= falloff;
    return n;
  }
  draw_map(size) {
    image(this.img, 0, 0, size.x, size.y);
  }
  inWater(pos) {
    if (
      this.height[Math.round(pos.x)][Math.round(pos.y)] > 100 &&
      ((pos.x + 10 > width &&
        this.height[Math.round(pos.x + 10)][Math.round(pos.y)] > 100) ||
        (pos.x - 10 >= 0 &&
          this.height[Math.round(pos.x - 10)][Math.round(pos.y)] > 100) ||
        (pos.y + 10 < height &&
          this.height[Math.round(pos.x)][Math.round(pos.y + 10)] > 100) ||
        (pos.y - 10 >= 0 &&
          this.height[Math.round(pos.x)][Math.round(pos.y - 10)] > 100))
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
      if (direction == 0) {
        //top
        x = Math.floor((width * a) / 5) * 5;
        y = margin;
        while (y < height - margin - step_size && this.inWater({ x: x, y: y }))
          y += 5;
      } else if (direction == 1) {
        //left
        x = margin;
        y = Math.floor((height * a) / 5) * 5;
        while (x < width - margin - step_size && this.inWater({ x: x, y: y }))
          x += 5;
      } else if (direction == 2) {
        //bottom
        x = Math.floor((width * a) / 5) * 5;
        y = height - margin - step_size;
        while (y > margin && this.inWater({ x: x, y: y })) y -= 5;
      } else if (direction == 3) {
        //right
        x = width - margin - step_size;
        y = Math.floor((height * a) / 5) * 5;
        while (x > margin && this.inWater({ x: x, y: y })) x -= 5;
      }
    } else {
      if (direction == 0) {
        //top
        x = Math.floor((width * a) / 5) * 5;
        y = height / 4 + (height / 2) * noise(a);
        //while (y < height && this.inWater({ x: x, y: y })) y += 5;
      } else if (direction == 1) {
        //left
        x = width / 4 + (width / 2) * noise(a);
        y = Math.floor((height * a) / 5) * 5;
        //while (x < width && this.inWater({ x: x, y: y })) x += 5;
      } else if (direction == 2) {
        //bottom
        x = Math.floor((height * a) / 5) * 5;
        y = (3 * height) / 4 - (height / 2) * noise(a);
        //while (y > 0 && this.inWater({ x: x, y: y })) y -= 5;
      } else if (direction == 3) {
        //right
        x = (3 * width) / 4 - (width / 2) * noise(a);
        y = Math.floor((height * a) / 5) * 5;
        //while (x > 0 && this.inWater({ x: x, y: y })) x -= 5;
      }

      //find location somewhere in the middle
    }
    if (
      this.inWater({
        x: x,
        y: y,
      })
    )
      return false;
    if (
      x > margin &&
      x < width - margin - step_size &&
      y > margin &&
      y < width - margin - step_size
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
          (width * width + height * height) / 400
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
  constructor() {
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
    this.img = createImage(width, height);
    this.position = null;
    this.zoom = null;
  }
  update(position, zoom) {
    if (this.position == position && this.zoom == zoom) {
      return;
    }
    this.position = position;
    this.zoom = zoom;
    let index;
    this.height = [];
    this.img.loadPixels();
    for (let i = 0; i < width; i++) {
      this.height[i] = [];
      for (let j = 0; j < height; j++) {
        let x = i / zoom + position.x - width / (2 * zoom);
        let y = j / zoom + position.y - width / (2 * zoom);
        //index = 4 * (j * width + i);
        index = 4 * (j * width + i);
        n =
          noise(
            x / 90 + offset,
            y / 90
            //noise(i) / 100
          ) * 255;
        let falloff =
          600 *
            (((x - width / 2) * (x - width / 2)) / (width * width) +
              ((y - height / 2) * (y - height / 2)) / (height * height)) -
          50;
        n -= falloff;
        this.height[i][j] = n;

        for (var terrain in this.terrain_types) {
          //console.log(terrain);
          if (n < this.terrain_types[terrain].max) {
            var t = this.terrain_types[terrain].func(n);
            this.img.pixels[index] = t[0];
            this.img.pixels[index + 1] = t[1];
            this.img.pixels[index + 2] = t[2];
            break;
          }
        }

        this.img.pixels[index + 3] = 255;
        if (n < 100) this.img.pixels[index + 3] = n;
      }
    }
    this.img.updatePixels();
  }
  draw_map() {
    image(this.img, 0, 0, width, height);
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

function keyPressed() {
  if (keyCode === UP_ARROW) {
    //mapMove.y += 1;
    mapOffset.y += 1;
  }
  if (keyCode === DOWN_ARROW) {
    //mapMove.y -= 1;
    mapOffset.y -= 1;
  }
  if (keyCode === LEFT_ARROW) {
    //mapMove.x = 1;
    mapOffset.x += 1;
  }
  if (keyCode === RIGHT_ARROW) {
    //mapMove.x = -1;
    mapOffset.x -= 1;
  }
  if (key === "a") {
    mapZoom *= 2;
    simulation.change_view({ multiplier: 2 });
    /*updateZoom(function () {
      highresMap.update();
    }, 100);*/
  }
  if (key === "z") {
    mapZoom /= 2;
    simulation.change_view({ multiplier: 0.5 });
    //updateZoom();
  }
}
