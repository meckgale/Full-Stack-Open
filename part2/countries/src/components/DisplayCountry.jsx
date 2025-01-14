import Temperature from "./Temperature";

function DisplayCountry({ country }) {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages).map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <div className="flag">{country.flag}</div>
      <Temperature capital={country.capital[0]} />
    </div>
  );
}

export default DisplayCountry;
