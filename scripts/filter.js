// class AllFilters {
//     constructor (filters) { // filters = [{"name":, "params": [{"id", "value"}, ...] }, ]
//         this.filters = [];
//         for (let index = 0; index < filters.length; index++) {
//             const elem = filters[index];
//             if (elem.name == "idYear") {
//                 continue;
//             }
//             this.filters.push(new Filter(elem.name, elem.params));
//         }
//     }

//     getAllChecked() {
//         let filters = [];
//         this.filters.forEach(elem => {
//             filters.push(elem.getAllChecked());
//         });
//         return filters;
//     }

//     static getFiltersCopy(filters) {
//         let copyFilters = [];
//         filters.forEach(elem => {
//             copyFilters.push({...elem});
//         });
//         return copyFilters;
//     }
// }

// class Filter {
//     constructor(name, params) {
//         this.name = name;
//         this.params = params;

//         this.params.sort(function(a, b) {
//             return a.id - b.id;
//         });

//         this.params.forEach(el => {
//             el.checked = false;
//         });
//     }

//     getAllChecked() {
//         return {
//             name: this.name,
//             params: this.params.filter(f => f.checked).map(el => el.id)
//         };
//     }

//     getById(id) {
//         for (let i = 0; i < this.params.length; i++) {
//             const el = this.params[i];
//             if (el.id == id) {
//                 return el;
//             }
//         }
//         return null;
//     }
// }