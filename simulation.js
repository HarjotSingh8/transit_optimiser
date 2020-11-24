class Simulation {
  /**
   * This class initiates all other classes
   * and handles parameters and inter class communication
   */
  constructor(config) {
    this.population_size = config.population_size || 5000000;
    this.canvas_size = config.canvas_size;
    this.map_limit = config.map_limit;
    //map_scale = km/pixel
    this.map_scale =
      this.canvas_size.x > this.canvas_size.y
        ? this.map_limit / this.canvas_size.x
        : this.map_limit / this.canvas_size.y;
    this.location = { x: this.map_limit / 2, y: this.map_limit / 2 };
    /*this.view_handler = new ViewHandler({
      map_size: this.map_size,
    });*/

    this.houses; //has to be generated
    this.transport; //has to be generated

    // Generating terrain
    this.view = config.view || "global"; // global / local
    this.view_center = {
      x: (this.map_scale * this.canvas_size.x) / 2,
      y: (this.map_scale * this.canvas_size.y) / 2,
    }; //center of the current view
    this.zoom = 1;
    console.log("yes");
    this.map = new Map({
      canvas_size: this.canvas_size,
      map_scale: this.map_scale,
      location: this.location,
      zoom: this.zoom,
    });
    this.high_res_map = new HighResMap({
      location: this.location,
      canvas_size: this.canvas_size,
      map_scale: this.map_scale,
    });
    this.focus = null;

    //generating settlements
    this.village_population_range = {
      min: config.village_population_range
        ? config.village_population_range.min
        : 50,
      max: config.village_population_range
        ? config.village_population_range.max
        : 500,
    };
    this.city_population_range = {
      min: config.city_population_range
        ? config.city_population_range.min
        : 500,
      max: config.city_population_range
        ? config.city_population_range.max
        : 5000,
    };
    console.log("creating settlements");
    this.settlement_names = new CommunityNames();
    this.settlements = new Settlements({
      population_size: this.population_size,
      map: this.map,
      village_population_range: this.village_population_range,
      city_population_range: this.city_population_range,
      num_cities: null,
      num_villages: null,
      settlement_names: this.settlement_names,
    });
    this.name_generator = new NameGenerator();
    this.population = new Population({
      settlements: this.settlements,
      name_generator: this.name_generator,
    });

    console.log("created settlements");
    this.population; //has to be generated
  }
  change_view(config) {
    if (config.multiplier) this.zoom *= config.multiplier;
    if (config.zoom) this.zoom = config.zoom;
    if (config.new_center) this.location = config.new_center;
    if (config.mapOffset) {
      this.location.x += (config.mapOffset.x * this.map_scale) / this.zoom;
      this.location.y += (config.mapOffset.y * this.map_scale) / this.zoom;
    }
    if (config.view) {
      this.view = config.view;
      this.focus = config.focus;
    }
    //if (this.zoom > 1) {
    //else {
    this.high_res_map.update(this.location, this.zoom);
    //this.settlements.generate_settlements_map(this.view_center, this.zoom);
    //}
  }
  draw_map() {
    //if (this.zoom == 1)
    //if (this.high_res_map.updating) {
    this.map.draw_map(this.location, this.zoom);
    //this.high_res_map.update();
    //}
    //if (this.zoom != 1) {
    this.high_res_map.draw_map(this.location, this.zoom);
    if (this.focus) this.draw_focus_object(this.location, this.zoom);
    //}
    this.settlements.draw(this.location, this.zoom);
  }
  draw_focus_object() {
    //draw object in focus
  }
}
