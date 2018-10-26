import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Item } from '../../models/item';
import { Items } from '../../providers';

declare var google;

@IonicPage()
@Component({
    selector: 'page-search',
    templateUrl: 'search.html'
})
export class SearchPage {

    @ViewChild('map') mapElement: ElementRef;
    map: any;

    currentItems: any = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, public items: Items) { }

    ionViewDidLoad() {
        this.loadMap();
    }

    /**
     * Perform a service for the proper items.
     */
    getItems(ev) {
        let val = ev.target.value;
        if (!val || !val.trim()) {
            this.currentItems = [];
            return;
        }
        this.currentItems = this.items.query({
            name: val
        });
    }

    /**
     * Navigate to the detail page for this item.
     */
    openItem(item: Item) {
        this.navCtrl.push('ItemDetailPage', {
            item: item
        });
    }

    /**
     * Load google maps
     */
    loadMap() {

        let latLng = new google.maps.LatLng(-34.9290, 138.6010);

        let mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: 'satellite',
            disableDefaultUI: true
        }

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        google.maps.event.addListener(this.map, "click", (event) => {
            new google.maps.Marker({
                position: event.latLng,
                map: this.map,
                draggable: true,
            });
        });

    }

}
