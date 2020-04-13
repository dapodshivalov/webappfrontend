function print(object) {
    console.log(object);
}

$( document ).ready(function() {
    main();
});

let curCurrency = "Million Dirhams";

function currentCurrency(value) {
    switch (curCurrency) {
        case "Million Dirhams":
          return value;
        case "Billion Dirhams":
            return value / 1000;
        case "Million USD":
          return value * 0.27;
        case "Billion USD":
            return value / 1000 * 0.27;
        default:
          alert( "Нет таких значений" );
      }
}

function fixed(a, num) {
    let tmp = a.toString();
    let ind = 0;
    for (ind = 0; ind < tmp.length; ind++) {
        if (tmp[ind] == '.') {
            break;
        }
    }
    let res = tmp.slice(0, ind);
    if (a < 0 && res.length >= 3 || a > 0 && res.length >= 2) {
        return res;
    }
    if (Math.abs(a - parseInt(res)) < 0.000001) {
        return res;
    }
    res += '.';
    let str = Math.abs(a - parseInt(res)).toString();
    let wasNonZero = false;
    for (let i = 2; i < str.length; i++) {
        const c = str[i];
        res = res + c; 
        if (parseInt(c) > 0) {
            wasNonZero = true;
        }
        if (wasNonZero) {
            num --;
        }
        if (num == 0) {
            break;
        }
    }
    return res;
}

function main() {

    let filters;

    let tmpFilters = [
        {
            name: "idYear", 
            params: [18]
        }
    ];

    let tmpFiltersYears = [
        // {
        //     name: "idYear", 
        //     params: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
        // }
    ];

    console.log( "ready!" );

    let countryDrawController;
    let yearsRangeDrawController = new YearsRangeDrawController()

    let allFilterController = new AllFilterController();

    let countryFilterController = new CountryFilterController();
    let itemFilterController = new ItemFilterController();
    let tradeCategoryFilterController = new TradeCategoryFilterController();
    let tradeTypeFilterController = new TradeTypeFilterController();
    let yearFilterController = new YearFilterController(onYearChanged);
    let yearsRangeFilterController = new YearsRangeFilterController(onYearsRangeChanged);
    let currencyFilterController = new CurrencyFilterController(onCurrencyChanged);
    currencyFilterController.set();
    yearsRangeDrawController.setYears([15, 16, 17, 18]);
    yearsRangeDrawController.setSlider(yearsRangeFilterController);
    $.ajax({
        type: 'Get',
        url: "http://localhost:8080/api/countryfilter",
        dataType: 'json',
        'success': function( response ) {
            print(response);
            countryFilterController.set(response);
            allFilterController.add(countryFilterController);
            print(allFilterController.getFilters());
            countryDrawController = new CountryDrawController(response["countries"]);
            countryDrawController.load(tmpFilters);
            yearsRangeDrawController.load(tmpFiltersYears);
        }
    });

    $.ajax({
        type: 'Get',
        url: "http://localhost:8080/api/itemfilter",
        dataType: 'json',
        'success': function( response ) {
            print(response);
            itemFilterController.set(response);
            allFilterController.add(itemFilterController);
        }
    });

    $.ajax({
        type: 'Get',
        url: "http://localhost:8080/api/tradecategoryfilter",
        dataType: 'json',
        'success': function( response ) {
            print(response);
            tradeCategoryFilterController.set(response);
            allFilterController.add(tradeCategoryFilterController);
        }
    });

    $.ajax({
        type: 'Get',
        url: "http://localhost:8080/api/tradetypefilter",
        dataType: 'json',
        'success': function( response ) {
            print(response);
            tradeTypeFilterController.set(response);
            allFilterController.add(tradeTypeFilterController);
        }
    });

    $.ajax({
        type: 'Get',
        url: "http://localhost:8080/api/yearfilter",
        dataType: 'json',
        'success': function( response ) {
            print(response);
            yearFilterController.set(response);
            yearsRangeFilterController.set(response);
        }
    });


    $('.applyButtonDiv').on('click', function() {
        // let doc = new jsPDF();
        // doc.fromHTML($("body")[0]);
        // doc.save();
        // getData(filters.getAllChecked(), filters.filters);
        currencyFilterController.update();
        let filters = allFilterController.getFilters();
        let filtersYears = allFilterController.getFilters();
        filters.push(yearFilterController.getFilter());
        // filtersYears.push(yearsRangeFilterController.getFilter());
        // print(filters);
        // print(filtersYears);
        countryDrawController.load(filters);
        print(yearsRangeFilterController.updateMinMax);
        yearsRangeDrawController.load(filtersYears);
    });

    function onCurrencyChanged() {
        currencyFilterController.update();
        countryDrawController.drawAll();
        yearsRangeDrawController.drawAll();
    }

    function onYearChanged() {
        let filters = allFilterController.getFilters();
        filters.push(yearFilterController.getFilter());
        countryDrawController.load(filters);
    }

    function onYearsRangeChanged() {
        // let filtersYears = allFilterController.getFilters();
        // filtersYears.push(yearsRangeFilterController.getFilter());
        yearsRangeDrawController.setYears(yearsRangeFilterController.getSelected());
        yearsRangeDrawController.drawAll()
        // yearsRangeDrawController.load(filtersYears);
    }
}

// function getData(filters, names) {

//     let copyFilters = AllFilters.getFiltersCopy(filters);
//     let copyFilters1 = AllFilters.getFiltersCopy(filters);
//     copyFilters.push({
//         name: "idYear", 
//         params: [18]
//     });

//     $.ajax({
//         headers: { 
//             'Accept': 'application/json',
//             'Content-Type': 'application/json' 
//         },
//         type: 'POST',
//         contentType: 'application/json',
//         url: "http://localhost:8080/api/search",
//         data: JSON.stringify(copyFilters),
//         dataType: 'json',
//         'success': function( response ) {
//             print(response);
//             print(getFilterByName(names, "idCountry"));
//             let countryG = new CountryGraph(response, getFilterByName(names, "idCountry"));
//             print("here");
//             countryG.drawMapCountry();
//             countryG.drawTopCountries(5);

//             let itemG = new ItemGraph(response, getFilterByName(names, "idItem"));
//             print("here");
//             itemG.drawTopItems(5);

//             copyFilters.pop();
//             copyFilters.push({
//                 name: "idYear", 
//                 params: [17]
//             });

//             $.ajax({
//                 headers: { 
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json' 
//                 },
//                 type: 'POST',
//                 contentType: 'application/json',
//                 url: "http://localhost:8080/api/search",
//                 data: JSON.stringify(copyFilters),
//                 dataType: 'json',
//                 'success': function( response1 ) {
                    
//                     let countryGrowth = new CountryGrowthGraph(response, response1, getFilterByName(names, "idCountry"));
//                     countryGrowth.drawGrowthCountryTable(10);
//                 }
//             });
//         }
//     });

//     let year = [15, 16, 17, 18]

//     copyFilters1.push({
//         name: "idYear", 
//         params: year
//     });
    
//     $.ajax({
//         headers: { 
//             'Accept': 'application/json',
//             'Content-Type': 'application/json' 
//         },
//         type: 'POST',
//         contentType: 'application/json',
//         url: "http://localhost:8080/api/search",
//         data: JSON.stringify(copyFilters1),
//         dataType: 'json',
//         'success': function( response ) {
//             print(response);
//             let yearsGraph = new YearsGraph(response);
//             yearsGraph.drawValueByYear();
//             yearsGraph.drawBalanceData();
//             yearsGraph.drawGrowthRateByYears();
//         }
//     });


// }

// function getFilterByName(filters, name) {
//     for (let i = 0; i < filters.length; i++) {
//         const el = filters[i];
//         if (el.name == name) {
//             return el
//         }
//     }
//     return null
// }

// class CountryGraph {

//     constructor( data, countryName) {
//         this.country = {}
//         this.country3 = {}
//         this.countryName = countryName
//         print(countryName)

//         data.forEach(el => {
//             if (!this.country.hasOwnProperty(el.idCountry)) {
//                 this.country[el.idCountry] = 0
//             }
//             this.country[el.idCountry] += el.value

//             if (!this.country3.hasOwnProperty(el.idCountry)) {
//                 this.country3[el.idCountry] = {
//                     0: 0,
//                     1: 0,
//                     2: 0
//                 }
//             }
//             this.country3[el.idCountry][el.idTradeType] += el.value
//         });

//         print(this.country)
//         print(this.country3)
//     }

//     drawMapCountry() {
//         let topCountriesDiv = $("#mapcountry")[0];
    
//         // print(response)
    
//         let trace = {
//             type: 'choropleth',
//             locationmode: 'country names',
//             locations: [],
//             z: [],
//             text: [],
//             // autocolorscale: true,
//             // zmin: 1000000,
//             // zmax: 200000000,
//             // colorscale: [
//             //     [0, 'rgb(242,240,247)'], [0.2, 'rgb(158,154,200)'],[0.6, 'rgb(117,107,177)'],
//             //     [0.8, 'rgb(117,107,177)'], [1, 'rgb(84,39,143)']
//             // ],
//             colorscale: [
//                 [0, 'rgb(158,154,200)'],
//                 [0.3, 'rgb(117,107,177)'], [0.6, 'rgb(84,39,143)'],
//                 [1, 'rgb(64,19,123)']
//             ],
//             colorbar: {
//                 title: 'Trade Value',
//                 thickness: 0.2
//             },
//         };
    
//         for (let el in this.country) {
//             let name = this.countryName.getById(el).value
//             let value = this.country[el]
//             trace.locations.push(name);
//             trace.z.push(value);
//             // trace.text.push(name + " " + value.toString());
//         }
    
//         let data = [trace];
    
//         let config = {responsive: true};
    
//         let layout = {
//             geo: {
//                 projection: {
//                     type: 'robinson'
//                 }
//             },
//             showlegend: false,
//             margin: {
//                 l: 50,
//                 r: 50,
//                 b: 50,
//                 t: 50,
//             },
//         };
    
//         Plotly.newPlot(topCountriesDiv, data, layout, config);
//     }

//     drawTopCountries(numberOfTop) {
//         let topCountriesDiv = $("#topcountries")[0];
    
//         let traceImports = {
//             x: [],
//             y: [],
//             name: "Import",
//             type: "bar",
//             orientation: 'h',
//             marker: {
//                 color: "#003f5c"
//             }
//         };
    
//         let traceReExports = {
//             x: [],
//             y: [],
//             name: "Re-Exports",
//             type: "bar",
//             orientation: 'h',
//             marker: {
//                 color: "#bc5090"
//             }
//         };
    
//         let traceNonOilExports = {
//             x: [],
//             y: [],
//             name: "Non-Oil Imports",
//             type: "bar",
//             orientation: 'h',
//             marker: {
//                 color: "#ffa600"
//             }
//         };

//         let annotations = [];

//         let country3 = this.country3;
//         let sortedCountry3Id = Object.keys(this.country3).sort( function ( a, b ) {
//             return -((country3[a][0] + country3[a][1] + country3[a][2]) - (country3[b][0] + country3[b][1] + country3[b][2]));
//         }); 

//         sortedCountry3Id = sortedCountry3Id.slice(0, numberOfTop);
    
//         for (let i = sortedCountry3Id.length - 1; i > -1; i--) {
//             const el = sortedCountry3Id[i];
            
//             let name = this.countryName.getById(el).value;
//             print(name);
//             print(country3[el]);

//             traceImports.y.push(name);
//             traceImports.x.push(this.country3[el][2]);
    
//             traceReExports.y.push(name);
//             traceReExports.x.push(this.country3[el][1]);
    
//             traceNonOilExports.y.push(name);
//             traceNonOilExports.x.push(this.country3[el][0]);

//             let val = this.country3[el][0] + this.country3[el][1] + this.country3[el][2];

//             annotations.push({
//                 x: val,
//                 y: name,
//                 text: "<b>" + (val / 1000000).toFixed(3).toString() + "M</b>",
//                 xref: 'x',
//                 yref: 'y',
//                 align: 'center',
//                 showarrow: false,
//                 font: {
//                     family: 'Courier New, monospace',
//                     size: 16,
//                 },
//                 ay: 30,
//             });
//         }
    
//         let data = [traceImports, traceReExports, traceNonOilExports];
    
//         let config = {responsive: true};
    
//         let layout = {
//             margin: {
//                 l: 150,
//                 r: 50,
//                 b: 50,
//                 t: 50,
//               },
//             barmode: 'stack',
//             showlegend: false,
//             annotations: annotations,
//             // plot_bgcolor: "#AAA",
//             // paper_bgcolor: "#AAA"
//         };
    
//         Plotly.newPlot(topCountriesDiv, data, layout, config);
//     }
// }


// class ItemGraph {

//     constructor( data, itemName) {
//         this.item3 = {}
//         this.itemName = itemName
//         print(itemName)

//         data.forEach(el => {

//             if (!this.item3.hasOwnProperty(el.idItem)) {
//                 this.item3[el.idItem] = {
//                     0: 0,
//                     1: 0,
//                     2: 0
//                 }
//             }
//             this.item3[el.idItem][el.idTradeType] += el.value
//         });

//         print(this.item3)
//     }


//     drawTopItems(numberOfTop) {
//         let topCountriesDiv = $("#topitems")[0];
    
//         let traceImports = {
//             x: [],
//             y: [],
//             name: "Import",
//             type: "bar",
//             orientation: 'h',
//             marker: {
//                 color: "#003f5c"
//             }
//         };
    
//         let traceReExports = {
//             x: [],
//             y: [],
//             name: "Re-Exports",
//             type: "bar",
//             orientation: 'h',
//             marker: {
//                 color: "#bc5090"
//             }
//         };
    
//         let traceNonOilExports = {
//             x: [],
//             y: [],
//             name: "Non-Oil Imports",
//             type: "bar",
//             orientation: 'h',
//             marker: {
//                 color: "#ffa600"
//             }
//         };

//         let item3 = this.item3;
//         let sortedItem3Id = Object.keys(this.item3).sort( function ( a, b ) {
//             return -((item3[a][0] + item3[a][1] + item3[a][2]) - (item3[b][0] + item3[b][1] + item3[b][2]));
//         }); 

//         sortedItem3Id = sortedItem3Id.slice(0, numberOfTop);

//         let annotations = [];
    
//         for (let i = sortedItem3Id.length - 1; i > -1; i--) {
//             const el = sortedItem3Id[i];
            
//             let name = this.itemName.getById(el).value.slice(0, 20) + "..";
//             print(name);
//             print(item3[el]);

//             traceImports.y.push(name);
//             traceImports.x.push(this.item3[el][2]);
    
//             traceReExports.y.push(name);
//             traceReExports.x.push(this.item3[el][1]);
    
//             traceNonOilExports.y.push(name);
//             traceNonOilExports.x.push(this.item3[el][0]);

//             let val = this.item3[el][0] + this.item3[el][1] + this.item3[el][2];

//             annotations.push({
//                 x: val,
//                 y: name,
//                 text: "<b>" + (val / 1000000).toFixed(3).toString() + "M</b>",
//                 xref: 'x',
//                 yref: 'y',
//                 align: 'center',
//                 showarrow: false,
//                 font: {
//                     family: 'Courier New, monospace',
//                     size: 16,
//                 },
//                 ay: 30,
//             });
//         }
    
//         let data = [traceImports, traceReExports, traceNonOilExports];
    
//         let config = {responsive: true};
    
//         let layout = {
//             margin: {
//                 l: 150,
//                 r: 50,
//                 b: 50,
//                 t: 50,
//               },
//             barmode: 'stack',
//             showlegend: false,
//             annotations: annotations,
//             // plot_bgcolor: "#AAA",
//             // paper_bgcolor: "#AAA"
//         };
    
//         Plotly.newPlot(topCountriesDiv, data, layout, config);
//     }
// }

// class CountryGrowthGraph {
//     constructor( data, dataLastYear, countryName) {
//         this.country = {}
//         this.countryTY = {}
//         this.countryLY = {}
//         this.sortedCountryId = []
//         this.countryName = countryName

//         data.forEach(el => {
//             if (!this.countryTY.hasOwnProperty(el.idCountry)) {
//                 this.countryTY[el.idCountry] = 0
//             }
//             this.countryTY[el.idCountry] += el.value
//         });

//         dataLastYear.forEach(el => {
//             if (!this.countryLY.hasOwnProperty(el.idCountry)) {
//                 this.countryLY[el.idCountry] = 0
//             }
//             this.countryLY[el.idCountry] += el.value
//         });

//         for (let el in this.countryTY) {
//             let val = ((this.countryTY[el] - this.countryLY[el]) / this.countryLY[el]) * 100;
//             if (!isNaN(val)) {
//                 this.country[el] = val;
//             }
//         }

//         let c = this.country;
//         this.sortedCountryId = Object.keys(this.country).sort( function ( a, b ) {
//             return -(c[a] - c[b]);
//         }); 

//         print(this.country)
//     }

//     addHtmlTableRow(table, values)
//     {
//         // get the table by id
//         // create a new row and cells
//         // get value from input text
//         // set the values into row cell's
//         let newRow = table.insertRow(table.length);
//         // call the function to set the event to the new row
//         for (let i = 0; i < values.length; i++) {
//             const element = values[i];
//             let cellIth = newRow.insertCell(i);
//             cellIth.innerHTML = element;
//         }
//     }

//     drawGrowthCountryTable(numberOfTop) {
//         let table = $("#table")[0];
    
//         // print(response)
    
//         for (let ind = 0; ind < numberOfTop; ind++) {
//             const el = this.sortedCountryId[ind];

//             let name = this.countryName.getById(el).value
//             let value = this.country[el].toFixed(0).toString() + "%";
//             this.addHtmlTableRow(table, [name, value]);
//         }
//     }
// }

// class YearsGraph {
//     constructor (data) {
//         this.yearValues = {};
//         this.yearRates = {};
//         this.yearBalance = {};

//         data.forEach(el => {
//             if (!this.yearValues.hasOwnProperty(el.idYear)) {
//                 this.yearValues[el.idYear] = {
//                     0: 0,
//                     1: 0,
//                     2: 0
//                 };
//             }
//             this.yearValues[el.idYear][el.idTradeType] += el.value;
//         });

//         print(this.yearValues);
//     }

//     drawValueByYear() {
//         // print(response)
//         let balanceDiv = $("#valueByYear")[0];
//         let traceImports = {
//             x: [],
//             y: [],
//             name: "Import",
//             type: "bar",
//             marker: {
//                 color: "#003f5c"
//             }
//         };
    
//         let traceReExports = {
//             x: [],
//             y: [],
//             name: "Re-Exports",
//             type: "bar",
//             marker: {
//                 color: "#bc5090"
//             }
//         };
    
//         let traceNonOilExports = {
//             x: [],
//             y: [],
//             name: "Non-Oil Exports",
//             type: "bar",
//             marker: {
//                 color: "#ffa600"
//             }
//         };

//         var annotations = [];
    
//         for (let i = 0; i < 20; i++) {
//             if (!this.yearValues.hasOwnProperty(i)) {
//                 continue;
//             }
//             const el = this.yearValues[i];
//             print(el);
//             let year = i + 1999;
//             traceImports.x.push(year);
//             traceImports.y.push(el[2]);
//             traceReExports.x.push(year);
//             traceReExports.y.push(el[1]);
//             traceNonOilExports.x.push(year);
//             traceNonOilExports.y.push(el[0]);

//             let score = ((el[0] + el[1] + el[2]) / 1000000).toFixed(3).toString() + "M";

//             annotations.push({
//                 x: year,
//                 y: (el[0] + el[1] + el[2]),
//                 text: score,
//                 // xref: 'x',
//                 // yref: 'y',
//                 xanchor: 'center',
//                 yanchor: 'bottom',
//                 showarrow: false
//             });
//         }
    
//         let data = [traceImports, traceReExports, traceNonOilExports];
    
//         let config = {responsive: true};
    
//         let layout = {
//             barmode: 'stack',
//             showlegend: false,
//             annotations: annotations,
//             margin: {
//                 l: 50,
//                 r: 50,
//                 b: 50,
//                 t: 50,
//             },
//             // plot_bgcolor: "#AAA",
//             // paper_bgcolor: "#AAA"
//         };
    
//         Plotly.newPlot(balanceDiv, data, layout, config);
//     }

//     drawBalanceData() {
//         let balanceDiv = $("#balance")[0];
//         let traceBalance = {
//             x: [],
//             y: [],
//             type: "bar"
//         };
    
//         let map = new Map();

//         let annotations = [];
    
//         for (let i = 0; i < 20; i++) {
//             if (!this.yearValues.hasOwnProperty(i)) {
//                 continue;
//             }
//             const el = this.yearValues[i];
//             let year = 1999 + i;
//             let val = el[0]+ el[1] - el[2];

//             traceBalance.x.push(year);
//             traceBalance.y.push(val);
            
//             annotations.push({
//                 x: year,
//                 y: val,
//                 text: "<b>" + (val / 1000000).toFixed(3).toString() + "M" + "</b>",
//                 // xref: 'x',
//                 // yref: 'y',
//                 xanchor: 'center',
//                 yanchor: 'bottom',
//                 showarrow: false,
//                 font: {
//                     family: 'Courier New, monospace',
//                     size: 14,
//                     color: '#000',
//                 },
//                 ay: 200,
//             });
//         }
    
//         for (let d of map) {
//             traceBalance.x.push(d[0]);
//             traceBalance.y.push(d[1]);
//         }
//         let data = [traceBalance];
    
//         let config = {responsive: true};
    
//         let layout = {
//             xaxis: {
//                 type: 'category',
//               },
//             barmode: 'relative',
//             showlegend: false,
//             annotations: annotations,
//             margin: {
//                 l: 50,
//                 r: 50,
//                 b: 50,
//                 t: 50,
//             },
//             // plot_bgcolor: "#AAA",
//             // paper_bgcolor: "#AAA"
//         };
    
//         Plotly.newPlot(balanceDiv, data, layout, config);
//     }

//     drawGrowthRateByYears() {
//         let growthDiv = $("#growthRateByYears")[0];
    
//         let traceGrowth = {
//             x: [],
//             y: [],
//             mode: "lines+markers"
//         };

//         let annotations = [];

//         let curIndex = -1
    
//         for (let i = 0; i < 20; i++) {
//             if (!this.yearValues.hasOwnProperty(i)) {
//                 continue;
//             }
//             const el = this.yearValues[i];
//             let year = 1999 + i;

//             // if (!map.has(el.year)) {
//             //     map.set(el.year, 0);
//             // }
//             // map.set(el.year, map.get(el.year) + el.value)

//             curIndex++;
    
//             traceGrowth.x.push(year);
//             traceGrowth.y.push(el[0] + el[1] + el[2]);
    
//             if ( curIndex == 0) {
//                 continue;
//             }
    
//             traceGrowth.y[curIndex - 1] = (traceGrowth.y[curIndex] - traceGrowth.y[curIndex - 1]) / traceGrowth.y[curIndex - 1] * 100;
//             traceGrowth.x[curIndex - 1] = traceGrowth.x[curIndex];

//             annotations.push({
//                 x: year,
//                 y: traceGrowth.y[curIndex - 1],
//                 text: "<b>" + (traceGrowth.y[curIndex - 1] > 0 ? '+' : '') + traceGrowth.y[curIndex - 1].toFixed(1).toString() + "</b>",
//                 xanchor: 'center',
//                 yanchor: 'bottom',
//                 showarrow: false,
//                 font: {
//                     family: 'Courier New, monospace',
//                     weight: 'bold',
//                     size: 16,
//                     color: (traceGrowth.y[curIndex - 1] < 0 ? '#ff1010' : '#10ff10')
//                 },
//             });
//         }
    
//         traceGrowth.x.pop();
//         traceGrowth.y.pop();
    
//         let data = [traceGrowth];
    
//         let config = {responsive: true};
    
//         let layout = {
//             xaxis: {
//                 type: 'category',
//               },
//             showlegend: false,
//             annotations: annotations,
//             margin: {
//                 l: 50,
//                 r: 50,
//                 b: 50,
//                 t: 50,
//             },
//             // plot_bgcolor: "#AAA",
//             // paper_bgcolor: "#AAA"
//         };
    
//         Plotly.newPlot(growthDiv, data, layout, config);
//     }
// }

