import { useState, useMemo, useRef } from "react";
import {
    APIProvider,
    Map,
    Pin,
    AdvancedMarker
} from "@vis.gl/react-google-maps";
import { useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

export default function Places() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_MAP_API,
        libraries: ["places"],
    });

    if (!isLoaded) return <div>Loading...</div>;
    return <Map1 />;
}
function Map1() {
    const center = { lat: 37.7749, lng: -122.4194 }
    const [selected, setSelected] = useState(null);


    return (
        <>
            <div className="places-container">
                <PlacesAutocomplete setSelected={setSelected} />
            </div>
            <div className="h-[100vh] relative w-full">
                <APIProvider apiKey={import.meta.env.VITE_MAP_API}>
                    <Map
                        id="map"
                        mapId={import.meta.env.VITE_MAP_ID}
                        defaultZoom={10}
                        center={selected ? selected : center}
                        mapContainerClassName="map-container"
                    >
                        {selected && <AdvancedMarker position={selected}><Pin background={"violet"} borderColor={"green"} glyphColor={"purple"} /></AdvancedMarker>}
                    </Map>
                </APIProvider>
            </div >
        </>
    );
}

const PlacesAutocomplete = ({ setSelected }) => {
    const {
        ready,
        value,
        setValue,
        suggestions: { status, data },
        clearSuggestions,
    } = usePlacesAutocomplete();

    const handleSelect = async (address) => {
        console.log("📍 Selected address: ", address);
        setValue(address, false);
        clearSuggestions();

        const results = await getGeocode({ address });
        const { lat, lng } = await getLatLng(results[0]);
        // console.log("📍 Coordinates: ", { lat, lng });
        setSelected({ lat, lng });
    };

    return (
        <Combobox onSelect={handleSelect}>
            <ComboboxInput
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={!ready}
                className="combobox-input"
                placeholder="Search an address"
            />
            <ComboboxPopover>
                <ComboboxList>
                    {status === "OK" &&
                        data.map(({ place_id, description }) => (
                            <ComboboxOption key={place_id} value={description} />
                        ))}
                </ComboboxList>
            </ComboboxPopover>
        </Combobox>
    );
};