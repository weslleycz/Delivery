import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Container } from "@mui/material";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "./icons";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

type Pros = {
    position: LatLngExpression;
    setPage: (valor: string) => void;
};

const Map = ({ position, setPage }: Pros) => {
    return (
        <>
            <Container sx={{ m: 7 }}>
                <ChevronLeftIcon
                    sx={{ cursor: "pointer" }}
                    onClick={() => setPage("order")}
                />
                <MapContainer
                    style={{ height: "70vh" }}
                    center={position}
                    zoom={13}
                    scrollWheelZoom={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker icon={Icon} position={position}>
                        <Popup>Local de entrega</Popup>
                    </Marker>
                </MapContainer>
            </Container>
        </>
    );
};

export default Map;
