import { useState, useEffect } from "react";
import serviceModules from "./services/serviceModules";
import DisplayCountries from "./components/DisplayCountries";
import SearchFilter from "./components/SearchFilter";
import DisplayCountry from "./components/DisplayCountry";
import "./index.css";

function App() {
  const [shownCountries, setShownCountries] = useState([]);
  const [newSearch, setNewSearch] = useState("");
  const [countryName, setCountryName] = useState(null);
  const [countryDetails, setCountryDetails] = useState(null);

  useEffect(() => {
    serviceModules
      .getAll()
      .then((allCountries) => setShownCountries(allCountries));
  }, []);

  useEffect(() => {
    if (countryName) {
      serviceModules
        .getCountry(countryName)
        .then((country) => setCountryDetails(country));
    }
  }, [countryName]);

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value);
    setCountryDetails(null);
  };

  const displayCountries = newSearch
    ? shownCountries.filter((country) =>
        country.name.common.toLowerCase().includes(newSearch.toLowerCase())
      )
    : shownCountries;

  const showCountry = (event, country) => {
    event.preventDefault();
    setCountryName(country.toLowerCase());
  };

  return (
    <>
      <h1>Countries</h1>
      <SearchFilter
        newSearch={newSearch}
        handleSearchChange={handleSearchChange}
      />
      {countryDetails && <DisplayCountry country={countryDetails} />}
      {!countryDetails && displayCountries.length > 10 && (
        <p>Too many matches, specify another filter</p>
      )}
      {!countryDetails && displayCountries.length === 1 && (
        <DisplayCountry country={displayCountries[0]} />
      )}
      {!countryDetails &&
        displayCountries.length <= 10 &&
        displayCountries.length > 1 && (
          <DisplayCountries
            displayCountries={displayCountries}
            showCountry={showCountry}
          />
        )}
    </>
  );
}

export default App;
