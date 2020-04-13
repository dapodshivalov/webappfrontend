class CurrencyFilterController{

    constructor(onChanged) {
        this.onChanged = onChanged;
        this.name = "idCurrency";
        this.curCurrency = "Million Dirhams";
        this.currencies = [
            "Million Dirhams",
            "Billion Dirhams",
            "Million USD",
            "Billion USD"
        ]

        this.currencyFilter = $("#currencyFilter");
    }

    set() {        
        let that = this;
        this.currencyFilter.multiselect({
            maxHeight: 300,
            buttonWidth: '200px',
            onChange: function(element, checked) {
                that.curCurrency = element.val();
                that.onChanged();
                // curCurrency = element.val();
            }
        });

        let currencyOptions = [];

        for (let i = 0; i < this.currencies.length; i++) {
            let el = this.currencies[i];
            currencyOptions.push({
                label: el, title: el, value: el, selected: (i == 0 ? true : false)
            })
        }
        this.currencyFilter.multiselect('dataprovider', currencyOptions);

    }

    update() {
        curCurrency = this.curCurrency;
    }

    getSelected() {
        return [this.curCurrency];
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