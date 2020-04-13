class YearsRangeFilterController{

    constructor(onChanged) {
        this.name = "idYear";
        this.curYear = 18;
        this.onChanged = onChanged;
        this.yearsSlider = $("#yearSlider");
    }

    updateMinMax(min, max) {
        print(this);
        this.yearsSlider.data("ionRangeSlider").update({
            min: min,
            max: max,
            from: min,
            to: max
        });
    }

    set(data) {  
        let years = data["years"].map(el => parseInt(el.value));
        let minYear = Math.min(...years);
        let maxYear = Math.max(...years);

        let that = this;
        this.yearsSlider.ionRangeSlider({
            type: "double",
            min: minYear,
            max: maxYear,
            from: 2014,
            to: 2017,
            prettify_enabled: false,
            onFinish: function(data) {
                that.onChanged();
            } 
        });
    }

    getSelected() {
        let from = this.yearsSlider.data("from");
        let to = this.yearsSlider.data("to");
        let selected = [];
        for (let i = from; i <= to; i++) {
            selected.push(i - 1999);
        }
        return selected;
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