class TradeCategoryFilterController{

    constructor() {
        this.name = "idTradeCategory";
        this.tradeCategories = {};

        this.tradeCategoryFilter = $("#tradeCategoryFilter");
    }

    set(data) {        

        let that = this;
        this.tradeCategoryFilter.multiselect({
            nonSelectedText: 'All TradeCategory',
            maxHeight: 300,
            buttonWidth: '200px',
            onChange: function(element, checked) {
                that["tradeCategories"][element.val()].isPicked = checked;
            }
        });

        let tradeCategoryOptions = [];

        for (let i = 0; i < data["tradeCategories"].length; i++) {
            const el = data["tradeCategories"][i];
            this.tradeCategories[el.id] = {
                name: el.value,
                isPicked: false
            };
            tradeCategoryOptions.push({
                label: el.value, title: el.value, value: el.id
            })
        }
        this.tradeCategoryFilter.multiselect('dataprovider', tradeCategoryOptions);

    }

    getSelected() {
        let pickedItems = [];
        for (const id in this["tradeCategories"]) {
            if (this["tradeCategories"].hasOwnProperty(id)) {
                const el = this["tradeCategories"][id];
                if (el.isPicked) {
                    pickedItems.push(parseInt(id));
                }
            }
        }
        let allLen = Object.keys(this["tradeCategories"]).length;

        if (pickedItems.length == allLen) {
            return [];
        }
        return pickedItems;
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