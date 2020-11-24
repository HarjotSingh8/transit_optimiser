class Building {
  constructor(config) {
    this.type = config.type;
    /* [ house, shop, mall, office, industry, hotel, restaurant,
     *   school, university, leisure, tourism, religious ]
     *
     * hotels, restaurants, malls, tourism, religious will attract high tourism
     * leisure, shops will attract comaratively lower tourism
     *
     * leisure, shops, malls, religious will attract high local population
     * tourism will attract comparatively lower local population
     *
     * schools will attract nearby students, colleges migh attract more students
     *
     * medical(hospitals, clinics) will attend patients
     * (general patients, sick from other diseases than the center of our project
     *  will also need beds, doctors and nurses)
     *
     * uneducated ppulation migh hoard,
     * thus cause high concentration at times of panic
     */
    this.capacity = config.capacity || this.random_capacity();
    this.street = config.street;
    this.co_ordinates = config.co_ordinates;
    this.residents = config.residents || {};
    //for houses & hotels, people currently living here
    this.schedule = {};

    /**
     * could use vague times like morning, afternoon, evening, night
     * or could use hour ranges
     *
     * vague times would be more efficient, cause then it can be a dictionary
     * rather than ranges which would be more expensive to search
     *
     * at what times are scheduled people supposed to be here
     * e.g. for a house, working people and students would leave in the morning
     * in evening would return
     *
     * or for an office, employees would enter in the morning, leave in the evening
     */
  }
}
