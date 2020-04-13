class CountryDrawController {

    constructor(countryName) {
        this.country = {};
        this.country3 = {};
        this.countryName = {};
        this.numberOfTop = 5;
        for (let i = 0; i < countryName.length; i++) {
            const el = countryName[i];
            this.countryName[el.id] = el.value;
        }
        
        this.countFilter = $("#countFilter");
        let that = this;
        this.countFilter.change(function() {
            print(this.value);
            print(this.max);
            print(this.min);
            let val = parseInt(this.value);
            if (Number.isNaN(val)) {
                return;
            }
            let min = this.min;
            let max = this.max;
            val = Math.min(max, val);
            val = Math.max(min, val);
            that.numberOfTop = val;
            that.drawTopCountries();
        })
    }

    load(filters) {
        let that = this;

        $(".country").addClass('d-none');
        $(".countrySpinner").removeClass('d-none');
        $.ajax({
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            },
            type: 'POST',
            contentType: 'application/json',
            url: "http://localhost:8080/api/getcountryvalue",
            data: JSON.stringify(filters),
            dataType: 'json',
            'success': function( response ) {
                print("here we are")
                
                $(".countrySpinner").addClass('d-none');
                $(".country").removeClass('d-none');
                that.country = response["map"];
                that.country3 = response["topCountry"];
                that.drawAll();
            }
        });
    }

    drawAll() {
        this.drawMapCountry();
        this.drawTopCountries();
    }

    drawMapCountry() {
        let topCountriesDiv = $("#mapcountry")[0];
    
        // print(response)
    
        let trace = {
            type: 'choropleth',
            locationmode: 'country names',
            locations: [],
            z: [],
            text: [],
            // autocolorscale: true,
            // zmin: 1000000,
            // zmax: 200000000,
            // colorscale: [
            //     [0, 'rgb(242,240,247)'], [0.2, 'rgb(158,154,200)'],[0.6, 'rgb(117,107,177)'],
            //     [0.8, 'rgb(117,107,177)'], [1, 'rgb(84,39,143)']
            // ],
            colorscale: [
                [0, 'rgb(158,154,200)'],
                [0.3, 'rgb(117,107,177)'], [0.6, 'rgb(84,39,143)'],
                [1, 'rgb(64,19,123)']
            ],
            colorbar: {
                title: 'Trading Value',
                thickness: 0.3
            },
        };
    
        for (let el in this.country) {
            let name = this.countryName[el];
            let value = currentCurrency(this.country[el]);
            trace.locations.push(name);
            trace.z.push(value);
            // trace.text.push(name + " " + value.toString());
        }
    
        let data = [trace];
    
        let config = {
            responsive: true,
            modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d',
            'hoverClosestGl2d', 'hoverClosestPie', 'toggleHover', 'resetViews', 'sendDataToCloud', 'toggleSpikelines', 'resetViewMapbox',
            'hoverClosestCartesian', 'hoverCompareCartesian', 'hoverClosestGeo']
        };
    
        let layout = {
            geo: {
                projection: {
                    type: 'equirectangular'
                },
                zaxis: {
                    exponentformat: 'none'
                }
            },
            showlegend: false,
            margin: {
                l: 50,
                r: 50,
                b: 50,
                t: 50,
            },
            plot_bgcolor: "#FCFCFE",
            paper_bgcolor: "#FCFCFE",
            mapbox: {
                style: "lightopen-street-map"
            }
        };
    
        Plotly.newPlot(topCountriesDiv, data, layout, config);
    }

    drawTopCountries() {
        let numberOfTop = this.numberOfTop;
        let topCountriesDiv = $("#topcountries")[0];
    
        let traceImports = {
            x: [],
            y: [],
            name: "Import",
            type: "bar",
            orientation: 'h',
            marker: {
                color: "#003f5c"
            }
        };
    
        let traceReExports = {
            x: [],
            y: [],
            name: "Re-Exports",
            type: "bar",
            orientation: 'h',
            marker: {
                color: "#bc5090"
            }
        };
    
        let traceNonOilExports = {
            x: [],
            y: [],
            name: "Non-Oil Exports",
            type: "bar",
            orientation: 'h',
            marker: {
                color: "#ffa600"
            }
        };

        let annotations = [];

        let country3 = this.country3;
        let sortedCountry3Id = Object.keys(this.country3).sort( function ( a, b ) {
            return -((country3[a][0] + country3[a][1] + country3[a][2]) - (country3[b][0] + country3[b][1] + country3[b][2]));
        }); 

        sortedCountry3Id = sortedCountry3Id.slice(0, numberOfTop);
    
        for (let i = sortedCountry3Id.length - 1; i > -1; i--) {
            const el = sortedCountry3Id[i];
            
            let name = this.countryName[el];

            traceImports.y.push(name);
            traceImports.x.push(currentCurrency(this.country3[el][2]));
    
            traceReExports.y.push(name);
            traceReExports.x.push(currentCurrency(this.country3[el][1]));
    
            traceNonOilExports.y.push(name);
            traceNonOilExports.x.push(currentCurrency(this.country3[el][0]));

            let val = currentCurrency(this.country3[el][0] + this.country3[el][1] + this.country3[el][2]);

            annotations.push({
                x: val,
                y: name,
                text: "<b>" + parseFloat(fixed(val, 2)).toLocaleString('ru-RU', {"minimumSignificantDigits": 2}) + "</b>",
                xref: 'x',
                yref: 'y',
                align: 'center',
                showarrow: false,
                font: {
                    family: 'Courier New, monospace',
                    size: 16,
                    color: '#000'
                },
                ay: 30,
            });
        }
    
        let data = [traceImports, traceReExports, traceNonOilExports];
    
        let config = {
            responsive: true,
            modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d',
            'hoverClosestGl2d', 'hoverClosestPie', 'toggleHover', 'resetViews', 'sendDataToCloud', 'toggleSpikelines', 'resetViewMapbox',
            'hoverClosestCartesian', 'hoverCompareCartesian']
        };
    
        let layout = {
            height: 25 * numberOfTop + 150,
            margin: {
                l: 150,
                r: 50,
                b: 50,
                t: 50,
              },
            barmode: 'stack',
            showlegend: true,
            legend: {
                xanchor:"top",
                // yanchor:"top",
                "orientation": "h"
            },
            annotations: annotations,
            xaxis: {
                // autorange: true,
                // showgrid: false,
                // showline: false,
                // autotick: true,
                // ticks: '',
                // showticklabels: false,
                exponentformat: 'none'
            },
            plot_bgcolor: "#FCFCFE",
            paper_bgcolor: "#FCFCFE"
        };
    
        Plotly.newPlot(topCountriesDiv, data, layout, config);
    }
}