import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Item } from '../../models/item';
import { Items } from '../../providers';
import { Marker } from '../../models/marker';
import { Markers } from '../../providers/markers/markers';


@IonicPage()
@Component({
    selector: 'page-search',
    templateUrl: 'search.html'
})
export class SearchPage {

    @ViewChild('map') mapElement: ElementRef;
    map: google.maps.Map;

    currentItems: any = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, public items: Items, public markers: Markers) { }

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

        let mapOptions: google.maps.MapOptions = {
            center: latLng,
            zoom: 20,
            mapTypeId: google.maps.MapTypeId.SATELLITE,
            rotateControl: true,
            tilt: 45,
            panControl: true,
            disableDefaultUI: true,
            rotateControlOptions: {
                position: google.maps.ControlPosition.RIGHT_CENTER
            },
        }

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        var overlay = new google.maps.OverlayView()
        overlay.draw = function () {
            this.getPanes().markerLayer.id = 'markerLayer'
        }
        overlay.setMap(this.map);

        google.maps.event.addListener(this.map, "click", (event) => {
            //add event to each marker we add
            //whenever we click a marker zoom in on the map
            //and show windrose
            //and show popup
            /*this._markers.push(new Marker({
                position: event.latLng,
                map: this.map,
                draggable: true,
                clickable: true,
            }));*/
            this.markers.addMarker(new Marker(this.markers, {
                position: event.latLng,
                map: this.map,
                draggable: true,
                clickable: true,
                icon: {
                    url: 'assets/img/target_sami_medium.png',
                    origin: new google.maps.Point(0, 0),
                    scaledSize: new google.maps.Size(250, 250)
                },
            }));
            this.map.panTo(this.markers.getLast().getPosition());
            this.map.setZoom(20);
        });
    }

    public rotateMarker(clockwise: boolean): void {
        this.markers.rotateMarker(clockwise);
    }

    public deleteMarker() {
        this.markers.deleteMarker();
    }

    public get selectedMarker(): number {
        return this.markers.selectedMarker;
    }

    public saveMarker() {
        new Marker(this.markers, {
            position: this.markers.getMarkerInCreationState.getPosition(),
            map: this.map,
            clickable: true,
        })
        this.markers.saveMarker();
    }

    public markerInCreationState(): Marker {
        return this.markers.getMarkerInCreationState;
    }

}
