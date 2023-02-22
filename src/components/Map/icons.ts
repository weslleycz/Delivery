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

const Icon = new LeafIcon({
    iconUrl:
        "https://firebasestorage.googleapis.com/v0/b/guru-delivery-98cf0.appspot.com/o/files%2Ficon.svg?alt=media&token=e327b62e-94d2-47f9-8cf0-ba0d49c7f4d2",
});

export { Icon };
