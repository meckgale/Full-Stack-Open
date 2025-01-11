function DisplayPeople({ displayPersons, deletePerson }) {
  return (
    <div>
      <ul>
        {displayPersons.map((person) => (
          <li key={person.name}>
            {person.name} {person.number}
            <button
              type="submit"
              onClick={(event) => deletePerson(event, person.id)}
            >
              delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DisplayPeople;
