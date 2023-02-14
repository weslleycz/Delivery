
import * as L from "leaflet";
const LeafIcon = L.Icon.extend({
  options: {
    iconSize: [30, 95],
    shadowSize: [50, 64],
    iconAnchor: [22, 94],
    shadowAnchor: [4, 62],
    popupAnchor: [-3, -76],
  },
});

const Icon = new LeafIcon({ iconUrl: "./icon.svg" });

export { Icon };