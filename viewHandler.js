class ViewHandler {
  constructor(config) {
    /**
     * This class will handle views, and changes in viewer states,
     * i.e.
     * A global view would be the enitre map, functionality to zoom can be added later
     * A local view would be a view of the city or village, functionality to zoom can be added later
     *
     * In Global View, stats of closest city or village will be shown
     * In Local View, stats of building or person are shown
     *
     */
    this.map_size = { x: config.map_size.x, y: config.map_size.y };
    this.view = config.view || "global"; // global / local
    this.map = new Map({}); //add map object here
    this.high_res_map = new HighResMap();
    this.map_center = { x: this.map_size.x / 2, y: this.map_size.y / 2 };
  }
  change_zoom(mult) {
    this.zoom *= mult;
    if (this.zoom > 1) {
      this.high_res_map.update({ x: width / 2, y: height / 2 }, this.zoom);
    }
  }
  draw_map() {
    if (this.zoom <= 1) {
      this.map.draw_map(this.map_size);
    } else {
      this.high_res_map.draw_map();
    }
  }
}
