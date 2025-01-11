import { useState, useEffect } from "react";
import DisplayPeople from "./components/DisplayPeople";
import SearchFilter from "./components/SearchFilter";
import AddPeople from "./components/AddPeople";
import phoneModules from "./services/phoneModules";

const App = () => {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    phoneModules
      .getAll()
      .then((initialContacts) => setPersons(initialContacts));
  }, []);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newSearch, setNewSearch] = useState("");

  const addPerson = (event) => {
    event.preventDefault();

    const isDuplicate = persons.some(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    );

    if (isDuplicate) {
      const person = persons.find(
        (person) => person.name.toLowerCase() === newName.toLowerCase()
      );
      const updatedContact = { ...person, number: newNumber };
      const id = person.id;

      if (
        !window.confirm(
          `${person.name} is already added to phone book, replace old number with a new one?`
        )
      ) {
        return;
      }
      phoneModules.updateOne(id, updatedContact).then((updatedPerson) => {
        setPersons(
          persons.map((person) => (person.id === id ? updatedPerson : person))
        );
      });
    }

    const personObject = {
      name: newName,
      number: newNumber,
    };
    phoneModules.addOne(personObject).then((newPerson) => {
      setPersons(persons.concat(newPerson));
      setNewName("");
      setNewNumber("");
    });
  };

  const deletePerson = (event, id) => {
    event.preventDefault();

    const person = persons.find((person) => person.id === id);

    if (window.confirm(`Delete ${person.name} ?`)) {
      phoneModules.deleteOne(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id));
      });
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value);
  };

  const filterPersons = (newSearch) => {
    return persons.filter((person) =>
      person.name.toLowerCase().includes(newSearch.toLowerCase())
    );
  };

  const displayPersons = newSearch ? filterPersons(newSearch) : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <SearchFilter
        newSearch={newSearch}
        handleSearchChange={handleSearchChange}
      />
      <h2>add a new</h2>
      <AddPeople
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <DisplayPeople
        displayPersons={displayPersons}
        deletePerson={deletePerson}
      />
    </div>
  );
};

export default App;
