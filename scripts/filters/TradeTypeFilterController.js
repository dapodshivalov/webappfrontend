class TradeTypeFilterController{

    constructor() {
        this.name = "idTradeType";
        this.tradeTypes = {};

        this.tradeTypeFilter = $("#tradeTypeFilter");
    }

    set(data) {        

        let that = this;
        this.tradeTypeFilter.multiselect({
            nonSelectedText: 'All TradeType',
            maxHeight: 300,
            buttonWidth: '200px',
            onChange: function(element, checked) {
                that["tradeTypes"][element.val()].isPicked = checked;
            }
        });

        let tradeTypeOptions = [];

        for (let i = 0; i < data["tradeTypes"].length; i++) {
            const el = data["tradeTypes"][i];
            this.tradeTypes[el.id] = {
                name: el.value,
                isPicked: false
            };
            tradeTypeOptions.push({
                label: el.value, title: el.value, value: el.id
            })
        }
        this.tradeTypeFilter.multiselect('dataprovider', tradeTypeOptions);

    }

    getSelected() {
        let pickedItems = [];
        for (const id in this["tradeTypes"]) {
            if (this["tradeTypes"].hasOwnProperty(id)) {
                const el = this["tradeTypes"][id];
                if (el.isPicked) {
                    pickedItems.push(parseInt(id));
                }
            }
        }
        let allLen = Object.keys(this["tradeTypes"]).length;

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