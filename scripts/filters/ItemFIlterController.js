class ItemFilterController{

    constructor() {
        this.name = "idItem";
        this.items = {};
        this.chapters = {};
        this.sections = {};
        this.relations = {
            sections: {},
            chapters: {},
        };

        this.sectionFilter = $("#sectionFilter");
        this.chapterFilter = $("#chapterFilter");
        this.itemFilter = $("#itemFilter");
    }

    set(data) {        

        for (let i = 0; i < data["items"].length; i++) {
            const el = data["items"][i];
            this.items[el.id] = {
                name: el.value,
                isAvailable: true
            };
        }
        

        for (let i = 0; i < data["chapters"].length; i++) {
            const el = data["chapters"][i];
            this.chapters[el.id] = {
                name: el.value,
                isAvailable: true,
                isPicked: false
            };
        }
        this.buildChapterFilter();

        let that = this;
        this.sectionFilter.multiselect({
            nonSelectedText: 'All Section',
            maxHeight: 300,
            buttonWidth: '200px',
            onChange: function(element, checked) {
                that.pickSection(element.val());
            }
        });

        let sectionOptions = [];

        for (let i = 0; i < data["sections"].length; i++) {
            const el = data["sections"][i];
            this.sections[el.id] = {
                name: el.value,
                isAvailable: true,
                isPicked: false
            };
            sectionOptions.push({
                label: el.value, title: el.value, value: el.id
            })
        }
        this.sectionFilter.multiselect('dataprovider', sectionOptions);

        data["relations"].forEach(el => {
            let section = el.idSection;
            let chapter = el.idChapter;
            let item = el.idItem;

            if (!this.relations.sections.hasOwnProperty(section)) {
                this.relations.sections[section] = [];
            }
            this.relations.sections[section].push(chapter);

            if (!this.relations.chapters.hasOwnProperty(chapter)) {
                this.relations.chapters[chapter] = [];
            }
            this.relations.chapters[chapter].push(item);
        });
    }

    pickSection(id) {
        this["sections"][id].isPicked = !this["sections"][id].isPicked;
        let sections = [];
        for (const id in this["sections"]) {
            if (this["sections"].hasOwnProperty(id)) {
                const element = this["sections"][id];
                if (element.isPicked) {
                    sections.push(id);
                }
            }
        }

        let chapters = [];
        sections.forEach(el => {
            chapters = chapters.concat(this["relations"]["sections"][el]);
        });

        this.makeAvailable("chapters", chapters);

        this.buildChapterFilter(true);

        let items = [];
        chapters.forEach(el => {
            items = items.concat(this["relations"]["chapters"][el]);
        });

        this.makeAvailable("items", items);
    }

    pickChapter(id) {
        this["chapters"][id].isPicked = !this["chapters"][id].isPicked;
        let chapters = [];
        for (const id in this["chapters"]) {
            if (this["chapters"].hasOwnProperty(id)) {
                const element = this["chapters"][id];
                if (element.isPicked) {
                    chapters.push(id);
                }
            }
        }

        let items = [];
        chapters.forEach(el => {
            items = items.concat(this["relations"]["chapters"][el]);
        });

        this.makeAvailable("items", items);
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

    buildChapterFilter(rebuild=false) {
        if (!rebuild) {
            
            let that = this;
            this.chapterFilter.multiselect({
                nonSelectedText: 'All Chapter',
                maxHeight: 300,
                buttonWidth: '200px',
                onChange: function(element, checked) {
                    that.pickChapter(element.val());
                }
            });

        } 

        let chapterOptions = [];
        
        for (const key in this["chapters"]) {
            const el = this["chapters"][key];
            if (el.isAvailable) {
                if (el.isPicked) {
                    chapterOptions.push({
                        label: el.name, title: el.name, value: key, selected: true
                    })
                } else {
                    chapterOptions.push({
                        label: el.name, title: el.name, value: key
                    })
                }
            }
        }
        this.chapterFilter.multiselect('dataprovider', chapterOptions);

        if (rebuild) {
            this.chapterFilter.multiselect('rebuild');
        }
    }

    getSelected() {
        let pickedItems = [];
        let availableItems = [];
        for (const id in this["items"]) {
            if (this["items"].hasOwnProperty(id)) {
                const el = this["items"][id];
                if (el.isAvailable) {
                    availableItems.push(parseInt(id));
                }
            }
        }
        let allLen = Object.keys(this["items"]).length;

        if (availableItems.length == allLen) {
            return [];
        }
        return availableItems;
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