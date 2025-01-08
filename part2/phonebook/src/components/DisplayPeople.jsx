function DisplayPeople({ displayPersons }) {
  return (
    <div>
      <ul>
        {displayPersons.map((person) => (
          <li key={person.name}>
            {person.name} {person.number}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DisplayPeople;
