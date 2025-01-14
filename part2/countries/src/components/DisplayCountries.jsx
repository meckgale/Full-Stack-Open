function DisplayCountries({ displayCountries, showCountry }) {
  return (
    <div>
      {displayCountries.map((country) => (
        <p key={country.name.official}>
          {country.name.common}
          <button
            type="submit"
            onClick={(event) => showCountry(event, country.name.common)}
          >
            show
          </button>
        </p>
      ))}
    </div>
  );
}

export default DisplayCountries;
