class YearFilterController{

    constructor(onChanged) {
        this.name = "idYear";
        this.curYear = 18;
        this.onChanged = onChanged;
        this.yearFilter = $("#yearFilter");
    }

    set(data) {        

        let that = this;
        this.yearFilter.multiselect({
            nonSelectedText: 'All Year',
            maxHeight: 300,
            buttonWidth: '200px',
            onChange: function(element, checked) {
                that.curYear = element.val();
                that.onChanged();
            }
        });

        let yearOptions = [];

        let years = data["years"];
        years.sort(function(a, b) {
            return b.id - a.id;
        })

        for (let i = 0; i < years.length; i++) {
            const el = years[i];
            yearOptions.push({
                label: el.value, title: el.value, value: el.id, selected: (el.id == 18 ? true : false)
            })
        }
        this.yearFilter.multiselect('dataprovider', yearOptions);

    }

    getSelected() {
        return [parseInt(this.curYear)];
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