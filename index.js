// ==UserScript==
// @name         ApricotsPromo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Xariyx
// @match        *://lp.morele.net/*
// ==/UserScript==

    function regexPrice(text) {
        return parseFloat(text.replace("zł", "").replace(" ", "").replace(',', '.'));
    }

    function sortByDiscFlatASC(a, b){
        return ((a.discFlat) - (b.discFlat));
    }

    function sortByDiscFlatDESC(a, b){
        return ((b.discFlat) - (a.discFlat));
    }

    function sortByDiscPercASC(a, b){
        return ((a.discPerc) - (b.discPerc));
    }

    function sortByDiscPercDESC(a, b){
        return ((b.discPerc) - (a.discPerc));
    }

    function removeChilds(parent){
        while (parent.lastChild) {
            parent.removeChild(parent.lastChild);
        }
    }



    const offerListDiv = document.getElementsByClassName("product-list-container")[0];
    const offers = new Array();

    class SorterElement {
        constructor(value, text, sortFunction) {
            this.value = value;
            this.text = text;
            this.listSelector = document.createElement("li");
            this.listSelector.setAttribute("class", "md-list-item");
            this.listSelector.setAttribute("data-dropdown-value", this.value);
            this.listSelector.setAttribute("data-dropdown-label", this.text);
            this.listSelector.addEventListener("click", function(){
                removeChilds(offerListDiv);
                offers.sort(sortFunction);
                for (var offer of offers) {
                    offerListDiv.appendChild(offer.div);
                }
            });
            this.listSelector.innerHTML = this.text;
  }
}
        class Offer {
        constructor(div) {
            this.div = div;
            this.newPrice = regexPrice(div.getElementsByClassName("product-slider-price")[0].getElementsByClassName("price-new")[0].textContent);
            this.oldPrice = regexPrice(div.getElementsByClassName("product-slider-price")[0].getElementsByClassName("price-old")[0].textContent);
            this.discFlat = Number((this.oldPrice - this.newPrice).toFixed(2));
            this.discPerc = Number((100 - (this.newPrice*100 / this.oldPrice)).toFixed(2));
  }
}

(function() {



    for (var child of offerListDiv.children) {
        var offer = new Offer(child);
        offers.push(offer);
    }

    var list = document.getElementsByClassName("md-list-collection")[0];

    var discFlatASC = new SorterElement("discFlat|asc", "Wartość promocji rosnąco", sortByDiscFlatASC);
    var discFlatDESC = new SorterElement("discFlat|desc", "Wartość promocji malejąco", sortByDiscFlatDESC);
    var discPercASC = new SorterElement("discPerc|asc", "Procent promocji rosnąco", sortByDiscPercASC);
    var discPercDESC = new SorterElement("discPerc|desc", "Procent promocji malejąco", sortByDiscPercDESC);

    list.appendChild(discFlatASC.listSelector);
    list.appendChild(discFlatDESC.listSelector);
    list.appendChild(discPercASC.listSelector);
    list.appendChild(discPercDESC.listSelector);

})();
