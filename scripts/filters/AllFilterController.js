class AllFilterController {
    constructor() {
        this.controllers = [];
    }

    add(controller) {
        this.controllers.push(controller);
    }

    getFilters() {
        let filters = this.controllers.map(el => el.getFilter()).filter(el => el != null);
        return filters;
    }
}