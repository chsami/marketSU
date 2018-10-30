import { Injectable } from '@angular/core';
import { Marker } from '../../models/marker';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { MarkerStateEnum } from '../../enums/marker.state.enum';

@Injectable()
export class Markers {

    selectedMarker: number = -1;

    _markers: Marker[] = [];
    markersSubject: BehaviorSubject<Marker[]> = new BehaviorSubject([]);
    markers$: Observable<Marker[]>;

    constructor() {
        this.markersSubject = new BehaviorSubject(this._markers);
        this.markers$ = this.markersSubject.asObservable();
        // this.markers$.subscribe((markers: Marker[]) => {
        //     if (markers.length > 0) {
        //         // markers[markers.length - 1].addListener("click", (event) => {
        //         //     this.selectedMarker = markers.length - 1;
        //         // });
        //         this.map.panTo(markers[markers.length - 1].getPosition());
        //         this.map.setZoom(20);
        //     }
        // })
    }

    public findByIndex(index: number): Marker {
        if (this._markers[index]) {
            return this._markers[index]
        }
        return null;
    }

    public getLast(): Marker {
        return this._markers[this._markers.length - 1];
    }

    public countMarkers(): number {
        return this._markers.length;
    }

    public setSelectedMarker(marker: Marker): void {
        this.selectedMarker = this._markers.findIndex(x => x == marker)
    }

    public get getMarkerInCreationState(): Marker {
        return this._markers.find(x => x.state == MarkerStateEnum.CREATION);
    }

    public addMarker(marker: Marker) {
        marker.state = MarkerStateEnum.CREATION;
        this._markers.push(marker);
        this.selectedMarker = this._markers.length - 1;
        this.markersSubject.next([...this._markers]);
    }

    public rotateMarker(clockwise: boolean): void {
        let elements: NodeListOf<Element> = document.querySelectorAll('#markerLayer img');
        let element: any = elements[this.selectedMarker];
        if (clockwise) {
            this._markers[this.selectedMarker].rotate += 7;
            element.style.transform = 'rotate(' + this._markers[this.selectedMarker].rotate + 'deg)';
        } else {
            this._markers[this.selectedMarker].rotate -= 7;
            element.style.transform = 'rotate(' + this._markers[this.selectedMarker].rotate + 'deg)';
        }
    }

    public deleteMarker() {
        let marker: Marker = this._markers[this._markers.length - 1];
        if (marker.state == MarkerStateEnum.CREATION) {
            marker.setMap(null);
            this._markers = this._markers.slice(0, this.countMarkers() - 1);
            this.markersSubject.next([...this._markers]);
            this.selectedMarker = -1;
        }
    }

    public hideMarker(marker: Marker) {
        marker.setMap(null);
    }

    public saveMarker() {
        let marker: Marker = this.getLast();
        marker.state = MarkerStateEnum.IDLE;
        this.selectedMarker = -1;
    }

}
