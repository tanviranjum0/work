/* eslint-disable react/prop-types */
import { MapPin } from "lucide-react";

function LocationSuggestions({
  suggestions = [],
  setSuggestions,
  setPickupLocation,
  setDestinationLocation,
  input,
}) {
  const chooseLocation = (suggestion) => {
    if (input === "pickup" || input === "pickup-location") {
      setPickupLocation(suggestion);
    } else if (input === "destination" || input === "destination-location") {
      setDestinationLocation(suggestion);
    }
    setSuggestions([]);
  };

  return (
    <ul
      id="location-suggestions"
      className="booking-suggestion-list"
      role="listbox"
      aria-label={`Suggested ${input === "pickup" ? "pickup" : "destination"} locations`}
    >
      {suggestions.map((suggestion) => (
        <li key={suggestion} role="presentation">
          <button
            type="button"
            role="option"
            aria-selected="false"
            onClick={() => chooseLocation(suggestion)}
          >
            <span className="booking-suggestion-icon"><MapPin size={17} /></span>
            <span>{suggestion}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export default LocationSuggestions;
