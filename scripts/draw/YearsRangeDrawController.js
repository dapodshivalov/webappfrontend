class YearsRangeDrawController {

    constructor () {
        this.values = {};
        this.growth = {};
        this.balance = {};
        this.years = [];
    }

    setYears(years) {
        this.years = years;
    }

    setYearsMinMax(min, max) {
        let years = [];
        for (let i = min; i <= max; i++) {
            years.push(i - 1999);
        }
        this.years = years;
    }

    setSlider(slider) {
        this.slider = slider;
    }

    changeMinMax(min, max) {
        this.slider.updateMinMax(min, max);
    }

    load(filters) {
        let that = this;
        $(".years").addClass('d-none');
        $(".yearsSpinner").removeClass("d-none");
        $.ajax({
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            },
            type: 'POST',
            contentType: 'application/json',
            url: "http://localhost:8080/api/valuebyyears",
            data: JSON.stringify(filters),
            dataType: 'json',
            'success': function( response ) {
                print("tut")
                // print(response);
                let years = Object.keys(response["value"]).map(el=> parseInt(el) + 1999);
                // print(years);
                let min = Math.min(...years);
                let max = Math.max(...years);
                // print(min);
                // print(max);
                that.changeMinMax(min, max);
                that.setYearsMinMax(min, max);
                that.values = response["value"];
                that.growth = response["growth"];
                that.balance = response["balance"];
                $(".yearsSpinner").addClass("d-none");
                $(".years").removeClass('d-none');
                that.drawAll();
            }
        });
    }

    drawAll() {
        this.drawValueByYear();
        this.drawGrowthRateByYears();
        this.drawBalanceData();
    }

    drawValueByYear() {
        let valueDiv = $("#valueByYear")[0];
        let traceImports = {
            x: [],
            y: [],
            name: "Import",
            type: "bar",
            marker: {
                color: "#003f5c"
            }
        };
    
        let traceReExports = {
            x: [],
            y: [],
            name: "Re-Exports",
            type: "bar",
            marker: {
                color: "#bc5090"
            }
        };
    
        let traceNonOilExports = {
            x: [],
            y: [],
            name: "Non-Oil Exports",
            type: "bar",
            marker: {
                color: "#ffa600"
            }
        };

        var annotations = [];


        // let sortedYears = Object.keys(this.values).map(el => parseInt(el));
        // sortedYears.sort();

        for (let i = 0; i < this.years.length; i++) {
            let yearId = this.years[i];
            let year = 1999 + yearId;
            if (!this.values.hasOwnProperty(yearId)) {
                continue;
            }
            let el = this.values[yearId];
            traceImports.x.push(year);
            traceImports.y.push(currentCurrency(el[2]));
            traceReExports.x.push(year);
            traceReExports.y.push(currentCurrency(el[1]));
            traceNonOilExports.x.push(year);
            traceNonOilExports.y.push(currentCurrency(el[0]));

            let score = parseFloat(fixed(currentCurrency(el[0] + el[1] + el[2]), 2)).toLocaleString('ru-RU', {"minimumSignificantDigits": 2});

            annotations.push({
                x: year,
                y: (currentCurrency(el[0] + el[1] + el[2])),
                text: score,
                textangle: '-55',
                xanchor: 'center',
                yanchor: 'bottom',
                showarrow: false
            });
        }

        // sortedYears.forEach(yearId => {
        //     let year = 1999 + yearId;
        //     let el = this.values[yearId];
        //     traceImports.x.push(year);
        //     traceImports.y.push(currentCurrency(el[2]));
        //     traceReExports.x.push(year);
        //     traceReExports.y.push(currentCurrency(el[1]));
        //     traceNonOilExports.x.push(year);
        //     traceNonOilExports.y.push(currentCurrency(el[0]));

        //     let score = parseFloat(fixed(currentCurrency(el[0] + el[1] + el[2]), 2)).toLocaleString('ru-RU');

        //     annotations.push({
        //         x: year,
        //         y: (currentCurrency(el[0] + el[1] + el[2])),
        //         text: score,
        //         textangle: '-55',
        //         xanchor: 'center',
        //         yanchor: 'bottom',
        //         showarrow: false
        //     });
        // });
    
        let data = [traceImports, traceReExports, traceNonOilExports];
    
        let config = {
            responsive: true,
            modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d',
            'hoverClosestGl2d', 'hoverClosestPie', 'toggleHover', 'resetViews', 'sendDataToCloud', 'toggleSpikelines', 'resetViewMapbox',
            'hoverClosestCartesian', 'hoverCompareCartesian', 'hoverClosestGeo']
        };
    
        let layout = {
            barmode: 'stack',
            showlegend: true,
            legend: {"orientation": "h"},
            annotations: annotations,
            margin: {
                l: 0,
                r: 0,
                b: 30,
                t: 30,
            },
            xaxis: {
                type: 'category',
            },
            yaxis: {
                autorange: true,
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
    
        Plotly.newPlot(valueDiv, data, layout, config);
    }

    drawBalanceData() {
        let balanceDiv = $("#balance")[0];
        let traceBalance = {
            x: [],
            y: [],
            type: "bar"
        };
    
        let map = new Map();

        // let sortedYears = Object.keys(this.balance).map(el => parseInt(el));
        // sortedYears.sort();

        let annotations = [];

        for (let i = 0; i < this.years.length; i++) {
            let yearId = this.years[i];
            let year = yearId + 1999;
            if (!this.balance.hasOwnProperty(yearId)) {
                continue;
            }
            let val = currentCurrency(this.balance[yearId]);
            
            traceBalance.x.push(year);
            traceBalance.y.push(val);
            
            annotations.push({
                x: year,
                y: val,
                text: "<b>" + parseFloat(fixed(val, 2)).toLocaleString('ru-RU', {"minimumSignificantDigits": 2}) + "</b>",
                // xref: 'x',
                // yref: 'y',
                textangle: '-45',
                xanchor: 'center',
                yanchor: 'bottom',
                showarrow: false,
                font: {
                    family: 'Courier New, monospace',
                    size: 14,
                    color: '#000',
                },
                ay: 200,
            });
        }

        // sortedYears.forEach(yearId => {
        //     let year = yearId + 1999;
        //     let val = currentCurrency(this.balance[yearId]);
            
        //     traceBalance.x.push(year);
        //     traceBalance.y.push(val);
            
        //     annotations.push({
        //         x: year,
        //         y: val,
        //         text: "<b>" + parseFloat(fixed(val, 2)).toLocaleString('ru-RU') + "</b>",
        //         // xref: 'x',
        //         // yref: 'y',
        //         textangle: '-45',
        //         xanchor: 'center',
        //         yanchor: 'bottom',
        //         showarrow: false,
        //         font: {
        //             family: 'Courier New, monospace',
        //             size: 14,
        //             color: '#000',
        //         },
        //         ay: 200,
        //     });
        // });

        let data = [traceBalance];
    
        let config = {
            responsive: true,
            modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d',
            'hoverClosestGl2d', 'hoverClosestPie', 'toggleHover', 'resetViews', 'sendDataToCloud', 'toggleSpikelines', 'resetViewMapbox',
            'hoverClosestCartesian', 'hoverCompareCartesian', 'hoverClosestGeo']
        };
    
        let layout = {
            xaxis: {
                type: 'category',
              },
            barmode: 'relative',
            showlegend: false,
            annotations: annotations,
            margin: {
                l: 0,
                r: 0,
                b: 30,
                t: 30,
            },
            yaxis: {
                autorange: true,
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
    
        Plotly.newPlot(balanceDiv, data, layout, config);
    }

    drawGrowthRateByYears() {
        let growthDiv = $("#growthRateByYears")[0];
    
        let traceGrowth = {
            x: [],
            y: [],
            mode: "lines+markers"
        };

        // let sortedYears = Object.keys(this.growth).map(el => parseInt(el));
        // sortedYears.sort();

        let annotations = [];

        for (let i = 0; i < this.years.length; i++) {
            let yearId = this.years[i];
            if (!this.growth.hasOwnProperty(yearId)) {
                continue;
            }
            let val = this.growth[yearId] * 100;
            let year = 1999 + yearId;
            traceGrowth.x.push(year);
            traceGrowth.y.push(val);
            annotations.push({
                x: year,
                y: val,
                text: "<b>" + (val > 0 ? '+' : '') + fixed(val, 2).toString() + "%</b>",
                xanchor: 'center',
                yanchor: 'bottom',
                showarrow: false,
                font: {
                    family: 'Courier New, monospace',
                    weight: 'bold',
                    size: 16,
                    color: (val < 0 ? '#ff1010' : '#10ff10')
                },
            });
        }

        // sortedYears.forEach(yearId => {
        //     let val = this.growth[yearId];
        //     let year = 1999 + yearId;
        //     traceGrowth.x.push(year);
        //     traceGrowth.y.push(val);
        //     annotations.push({
        //         x: year,
        //         y: val,
        //         text: "<b>" + (val > 0 ? '+' : '') + fixed(val, 2).toString() + "</b>",
        //         xanchor: 'center',
        //         yanchor: 'bottom',
        //         showarrow: false,
        //         font: {
        //             family: 'Courier New, monospace',
        //             weight: 'bold',
        //             size: 16,
        //             color: (val < 0 ? '#ff1010' : '#10ff10')
        //         },
        //     });
        // });
    
        let data = [traceGrowth];
    
        let config = {
            responsive: true,
            modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'resetScale2d',
            'hoverClosestGl2d', 'hoverClosestPie', 'toggleHover', 'resetViews', 'sendDataToCloud', 'toggleSpikelines', 'resetViewMapbox',
            'hoverClosestCartesian', 'hoverCompareCartesian', 'hoverClosestGeo']
        };
    
        let layout = {
            xaxis: {
                type: 'category',
            },
            yaxis: {
                exponentformat: 'none'
            },
            showlegend: false,
            annotations: annotations,
            margin: {
                l: 0,
                r: 0,
                b: 30,
                t: 30,
            },
            plot_bgcolor: "#FCFCFE",
            paper_bgcolor: "#FCFCFE"
        };
    
        Plotly.newPlot(growthDiv, data, layout, config);
    }
    
}