/* eslint-disable no-undef */

const App = () => {

  async function init() {
    // @ts-ignore
    const { Place, AutocompleteSessionToken, AutocompleteSuggestion } =
      await google.maps.importLibrary("places");
    // Add an initial request body.
    let request = {
      input: "premier uni",
      language: "en-US",
    };
    // Create a session token.
    const token = new AutocompleteSessionToken();

    // Add the token to the request.
    // @ts-ignore
    request.sessionToken = token;

    // Fetch autocomplete suggestions.
    const { suggestions } =
      await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
    console.log(suggestions)
    const title = document.getElementById("title");

    title.appendChild(
      document.createTextNode('Query predictions for "' + request.input + '":')
    );

    for (let suggestion of suggestions) {
      const placePrediction = suggestion.placePrediction;
      // Create a new list element.
      const listItem = document.createElement("li");
      const resultsElement = document.getElementById("results");

      listItem.appendChild(
        document.createTextNode(placePrediction.text.toString())
      );
      resultsElement.appendChild(listItem);
    }

    let place = suggestions[0].placePrediction.toPlace(); // Get first predicted place.

    await place.fetchFields({
      fields: ["displayName", "formattedAddress"],
    });

    const placeInfo = document.getElementById("prediction");

    placeInfo.textContent =
      "First predicted place: " +
      place.displayName +
      ": " +
      place.formattedAddress;
  }

  init();

  return (
    <div>
      <div id="title" className="text-red-300"></div>
      <ul id="results" className="text-blue-300"></ul>
      <p><span id="prediction" className="text-green-300"></span></p>
      <img
        className="powered-by-google"
        src="https://storage.googleapis.com/geo-devrel-public-buckets/powered_by_google_on_white.png"
        alt="Powered by Google"
      />
    </div>
  )
}

export default App
