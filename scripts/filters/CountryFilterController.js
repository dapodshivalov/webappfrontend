class CountryFilterController{

    constructor() {
        this.name = "idCountry";
        this.countries = {};
        this.regions = {};
        this.continents = {};
        this.relations = {
            continents: {},
            regions: {},
        };

        this.continentFilter = $("#continentFilter");
        this.regionFilter = $("#regionFilter");
        this.countryFilter = $("#countryFilter");
    }

    set(data) {        

        for (let i = 0; i < data["countries"].length; i++) {
            const el = data["countries"][i];
            this.countries[el.id] = {
                name: el.value,
                isAvailable: true,
                isPicked: false
            };
        }
        this.buildCountryFilter();
        

        for (let i = 0; i < data["regions"].length; i++) {
            const el = data["regions"][i];
            this.regions[el.id] = {
                name: el.value,
                isAvailable: true,
                isPicked: false
            };
        }
        this.buildRegionFilter();

        let that = this;
        this.continentFilter.multiselect({
            nonSelectedText: 'All Continent',
            maxHeight: 300,
            buttonWidth: '200px',
            onChange: function(element, checked) {
                that.pickContinent(element.val());
            }
        });

        let continentOptions = [];

        for (let i = 0; i < data["continents"].length; i++) {
            const el = data["continents"][i];
            this.continents[el.id] = {
                name: el.value,
                isAvailable: true,
                isPicked: false
            };
        }

        that = this;
        let keys = Object.keys(this["continents"]).sort(function(a, b) {
            return (that["continents"][a].name < that["continents"][b].name ? -1 : 1);
        });
        
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const el = this["continents"][key];
            continentOptions.push({
                label: el.name, title: el.name, value: key
            })
        }
        this.continentFilter.multiselect('dataprovider', continentOptions);

        data["relations"].forEach(el => {
            let continent = el.idContinent;
            let region = el.idRegion;
            let country = el.idCountry;

            if (!this.relations.continents.hasOwnProperty(continent)) {
                this.relations.continents[continent] = [];
            }
            this.relations.continents[continent].push(region);

            if (!this.relations.regions.hasOwnProperty(region)) {
                this.relations.regions[region] = [];
            }
            this.relations.regions[region].push(country);
        });
    }

    pickContinent(id) {
        this["continents"][id].isPicked = !this["continents"][id].isPicked;
        let continents = [];
        for (const id in this["continents"]) {
            if (this["continents"].hasOwnProperty(id)) {
                const element = this["continents"][id];
                if (element.isPicked) {
                    continents.push(id);
                }
            }
        }

        let regions = [];
        continents.forEach(el => {
            regions = regions.concat(this["relations"]["continents"][el]);
        });

        this.makeAvailable("regions", regions);

        this.buildRegionFilter(true);

        let countries = [];
        regions.forEach(el => {
            countries = countries.concat(this["relations"]["regions"][el]);
        });

        this.makeAvailable("countries", countries);
        this.buildCountryFilter(true);
    }

    pickRegion(id) {
        this["regions"][id].isPicked = !this["regions"][id].isPicked;
        let regions = [];
        for (const id in this["regions"]) {
            if (this["regions"].hasOwnProperty(id)) {
                const element = this["regions"][id];
                if (element.isPicked) {
                    regions.push(id);
                }
            }
        }

        let countries = [];
        regions.forEach(el => {
            countries = countries.concat(this["relations"]["regions"][el]);
        });

        this.makeAvailable("countries", countries);
        this.buildCountryFilter(true);
    }
    
    makeAvailable(key, list) {
        if (list.length == 0) {
            for (const id in this[key]) {
                if (this[key].hasOwnProperty(id)) {
                    const el = this[key][id];
                    el.isAvailable = true;
                    el.isPicked = false;
                }
            }
            return;
        }

        for (const id in this[key]) {
            if (this[key].hasOwnProperty(id)) {
                const el = this[key][id];
                el.isAvailable = false;
                el.isPicked = false;
            }
        }

        for (let i = 0; i < list.length; i++) {
            const el = list[i];
            this[key][el].isAvailable = true;
        }
    }

    buildRegionFilter(rebuild=false) {
        if (!rebuild) {
            
            let that = this;
            this.regionFilter.multiselect({
                nonSelectedText: 'All Region',
                maxHeight: 300,
                buttonWidth: '200px',
                onChange: function(element, checked) {
                    that.pickRegion(element.val());
                }
            });

        } 

        let regionOptions = [];
        
        let that = this;
        let keys = Object.keys(this["regions"]).sort(function(a, b) {
            return (that["regions"][a].name < that["regions"][b].name ? -1 : 1);
        });
        
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const el = this["regions"][key];
            if (el.isAvailable) {
                if (el.isPicked) {
                    regionOptions.push({
                        label: el.name, title: el.name, value: key, selected: true
                    })
                } else {
                    regionOptions.push({
                        label: el.name, title: el.name, value: key
                    })
                }
            }
        }
        this.regionFilter.multiselect('dataprovider', regionOptions);

        if (rebuild) {
            this.regionFilter.multiselect('rebuild');
        }
    }

    buildCountryFilter(rebuild=false) {
        if (!rebuild) {
            
            let that = this;
            this.countryFilter.multiselect({
                nonSelectedText: 'All Country',
                maxHeight: 300,
                buttonWidth: '200px',
                onChange: function(element, checked) {
                    that.countries[element.val()].isPicked = checked;
                }
            });

        } 

        let countriesOptions = [];

        let that = this;
        let keys = Object.keys(this["countries"]).sort(function(a, b) {
            return (that["countries"][a].name < that["countries"][b].name ? -1 : 1);
        });
        
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const el = this["countries"][key];
            if (el.isAvailable) {
                if (el.isPicked) {
                    countriesOptions.push({
                        label: el.name, title: el.name, value: key, selected: true
                    })
                } else {
                    countriesOptions.push({
                        label: el.name, title: el.name, value: key
                    })
                }
            }
        }
        this.countryFilter.multiselect('dataprovider', countriesOptions);

        if (rebuild) {
            this.countryFilter.multiselect('rebuild');
        }
    }

    getSelected() {
        let pickedCountries = [];
        let availableCountries = [];
        for (const id in this["countries"]) {
            if (this["countries"].hasOwnProperty(id)) {
                const el = this["countries"][id];
                if (el.isPicked) {
                    pickedCountries.push(parseInt(id));
                }
                if (el.isAvailable) {
                    availableCountries.push(parseInt(id));
                }
            }
        }
        let allLen = Object.keys(this["countries"]).length;

        if (pickedCountries.length > 0) {
            return pickedCountries;
        }
        if (availableCountries.length == allLen) {
            return [];
        }
        return availableCountries;
    }

    getFilter() {
        let filter = null;
        let name = this.name;
        let params = this.getSelected();
        if (params.length > 0) {
            filter = {
                name: name,
                params: params
            };
        }
        return filter;
    }
}