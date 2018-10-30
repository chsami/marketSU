import { Markers } from "../providers/markers/markers";
import { MarkerStateEnum } from "../enums/marker.state.enum";

export class Marker extends google.maps.Marker {

    public state: MarkerStateEnum = MarkerStateEnum.IDLE;
    public rotate?: number = 0;

    /**
     *
     */
    constructor(markers: Markers, opts?: google.maps.MarkerOptions) {
        super(opts);
        this.addListener("click", (event) => {
            markers.setSelectedMarker(this);
        });
    }
}