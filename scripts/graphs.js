// // 
// // response = [
// //     {
// //         tradetype: "",
// //         year: "",
// //         value: ""
// //     }, ...
// // ]
// function getValueByYear( response ) {
//     // print(response)
//     let balanceDiv = $("#valueByYear")[0];
//     let traceImports = {
//         x: [],
//         y: [],
//         name: "Import",
//         type: "bar",
//         marker: {
//             color: "#003f5c"
//         }
//     };

//     let traceReExports = {
//         x: [],
//         y: [],
//         name: "Re-Exports",
//         type: "bar",
//         marker: {
//             color: "#bc5090"
//         }
//     };

//     let traceNonOilExports = {
//         x: [],
//         y: [],
//         name: "Non-Oil Exports",
//         type: "bar",
//         marker: {
//             color: "#ffa600"
//         }
//     };

//     for (let i = 0; i < response.length; i++) {
//         const el = response[i];
//         if (el.tradeType == "Imports") {
//             traceImports.x.push(el.year);
//             traceImports.y.push(el.value);
//         } else if (el.tradeType == "Re-Exports") {
//             traceReExports.x.push(el.year);
//             traceReExports.y.push(el.value);
//         } else {
//             traceNonOilExports.x.push(el.year);
//             traceNonOilExports.y.push(el.value);
//         }
//     }

//     let data = [traceImports, traceReExports, traceNonOilExports];

//     let config = {responsive: true};

//     let layout = {
//         barmode: 'stack',
//         showlegend: false,
//         // plot_bgcolor: "#AAA",
//         // paper_bgcolor: "#AAA"
//     };

//     Plotly.newPlot(balanceDiv, data, layout, config);
// }

// // 
// // response = [
// //     {
// //         tradetype: "",
// //         year: "",
// //         value: ""
// //     }, ...
// // ]
// function getBalanceData( response ) {
//     let balanceDiv = $("#balance")[0];
//     let traceBalance = {
//         x: [],
//         y: [],
//         type: "bar"
//     };

//     let map = new Map();

//     for (let el of response) {
//         if (el.tradeType == "Imports") {
//             if (!map.has(el.year)) {
//                 map.set(el.year, 0);
//             }
//             map.set(el.year, map.get(el.year) - el.value)
//         } else {
//             if (!map.has(el.year)) {
//                 map.set(el.year, 0);
//             }
//             map.set(el.year, map.get(el.year) + el.value)
//         }
//     }

//     for (let d of map) {
//         traceBalance.x.push(d[0]);
//         traceBalance.y.push(d[1]);
//     }
//     let data = [traceBalance];

//     let config = {responsive: true};

//     let layout = {
//         xaxis: {
//             type: 'category',
//           },
//         barmode: 'relative',
//         showlegend: false,
//         // plot_bgcolor: "#AAA",
//         // paper_bgcolor: "#AAA"
//     };

//     Plotly.newPlot(balanceDiv, data, layout, config);
// }

// function getGrowthRateByYears( response ) {
//     let growthDiv = $("#growthRateByYears")[0];

//     let traceGrowth = {
//         x: [],
//         y: [],
//         mode: "lines+markers"
//     };

//     let map = new Map();

//     for (let el of response) {
//         if (!map.has(el.year)) {
//             map.set(el.year, 0);
//         }
//         map.set(el.year, map.get(el.year) + el.value)
//     }

//     let curIndex = -1

//     for (let d of map) {
//         curIndex++;

//         traceGrowth.x.push(d[0]);
//         traceGrowth.y.push(d[1]);

//         if ( curIndex == 0) {
//             continue;
//         }

//         traceGrowth.y[curIndex - 1] = (d[1] - traceGrowth.y[curIndex - 1]) / traceGrowth.y[curIndex - 1] * 100;
//         traceGrowth.x[curIndex - 1] = traceGrowth.x[curIndex];
//     }

//     traceGrowth.x.pop();
//     traceGrowth.y.pop();

//     let data = [traceGrowth];

//     let config = {responsive: true};

//     let layout = {
//         xaxis: {
//             type: 'category',
//           },
//         showlegend: false,
//         // plot_bgcolor: "#AAA",
//         // paper_bgcolor: "#AAA"
//     };

//     Plotly.newPlot(growthDiv, data, layout, config);
// }

// function getItems( response ) {
//     let itemsDiv = $("#items")[0];

//     // print(response)

//     let traceImports = {
//         x: [],
//         y: [],
//         name: "Import",
//         type: "bar",
//         orientation: 'h',
//         marker: {
//             color: "#003f5c"
//         }
//     };

//     let traceReExports = {
//         x: [],
//         y: [],
//         name: "Re-Exports",
//         type: "bar",
//         orientation: 'h',
//         marker: {
//             color: "#bc5090"
//         }
//     };

//     let traceNonOilExports = {
//         x: [],
//         y: [],
//         name: "Non-Oil Imports",
//         type: "bar",
//         orientation: 'h',
//         marker: {
//             color: "#ffa600"
//         }
//     };

//     for (let i = response.length - 1; i > -1; i--) {
//         const el = response[i];

//         let itemEn = el.itemEN.substr(0, 20) + '..';

//         traceImports.y.push(itemEn);
//         traceImports.x.push(el.imports);

//         traceReExports.y.push(itemEn);
//         traceReExports.x.push(el.reExports);

//         traceNonOilExports.y.push(itemEn);
//         traceNonOilExports.x.push(el.nonOilExports);
//     }

//     let data = [traceImports, traceReExports, traceNonOilExports];
    
//     let config = {responsive: true};

//     let layout = {
//         margin: {
//             l: 150,
//             r: 50,
//             b: 50,
//             t: 50,
//           },
//         barmode: 'stack',
//         showlegend: false,
//         // plot_bgcolor: "#AAA",
//         // paper_bgcolor: "#AAA"
//     };

//     // print("heh");
//     Plotly.newPlot(itemsDiv, data, layout, config);
//     // print("hehdone");
// }

// function getTopCountries( response ) {
//     let topCountriesDiv = $("#topcountries")[0];

//     // print(response)

//     let traceImports = {
//         x: [],
//         y: [],
//         name: "Import",
//         type: "bar",
//         orientation: 'h',
//         marker: {
//             color: "#003f5c"
//         }
//     };

//     let traceReExports = {
//         x: [],
//         y: [],
//         name: "Re-Exports",
//         type: "bar",
//         orientation: 'h',
//         marker: {
//             color: "#bc5090"
//         }
//     };

//     let traceNonOilExports = {
//         x: [],
//         y: [],
//         name: "Non-Oil Imports",
//         type: "bar",
//         orientation: 'h',
//         marker: {
//             color: "#ffa600"
//         }
//     };

//     for (let i = response.length - 1; i > -1; i--) {
//         const el = response[i];

//         traceImports.y.push(el.countryName);
//         traceImports.x.push(el.imports);

//         traceReExports.y.push(el.countryName);
//         traceReExports.x.push(el.reExports);

//         traceNonOilExports.y.push(el.countryName);
//         traceNonOilExports.x.push(el.nonOilExports);
//     }

//     let data = [traceImports, traceReExports, traceNonOilExports];

//     let config = {responsive: true};

//     let layout = {
//         margin: {
//             l: 150,
//             r: 50,
//             b: 50,
//             t: 50,
//           },
//         barmode: 'stack',
//         showlegend: false,
//         // plot_bgcolor: "#AAA",
//         // paper_bgcolor: "#AAA"
//     };

//     Plotly.newPlot(topCountriesDiv, data, layout, config);
// }

// function getMapCountry( response ) {
//     let topCountriesDiv = $("#mapcountry")[0];

//     // print(response)

//     let trace = {
//         type: 'choropleth',
//         locationmode: 'country names',
//         locations: [],
//         z: [],
//         text: [],
//         autocolorscale: true
//     };

//     for (let i = response.length - 1; i > -1; i--) {
//         const el = response[i];

//         trace.locations.push(el.countryName);
//         trace.z.push(el.value);
//         trace.text.push(el.countryName + el.value.toString());
//     }

//     let data = [trace];

//     let config = {responsive: true};

//     let layout = {
//         geo: {
//             projection: {
//                 type: 'robinson'
//             }
//         },
//         showlegend: false,
//         };

//     Plotly.newPlot(topCountriesDiv, data, layout, config);
// }