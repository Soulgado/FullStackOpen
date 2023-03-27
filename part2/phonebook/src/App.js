import { useState, useEffect } from 'react';

import Filter from "./Components/Filter";
import PersonForm from './Components/PersonForm';
import Persons from './Components/Persons';

import personsService from "./Services/Persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filterName, setFilterName] = useState('');

  const personsToShow = () => persons.filter(person =>
    person.name.toLowerCase().startsWith(filterName.toLowerCase()));

  const handleFilterChange = (event) => {
    setFilterName(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (persons.find(person => person.name === newName)) {
      window.alert(`${newName} is already added to the phonebook`);
      setNewName('');
      return;
    }
    const newPerson = {
      name: newName,
      number: newNumber
    };
    personsService
      .create(newPerson)
      .then(response => {
        setPersons(persons.concat(response));
        setNewName('');
        setNewNumber('');
      })
      .catch(error => alert(`Error happened: ${error}`));
  }

  const handleDeleteClick = (id) => () => {
    const person = persons.find(person => person.id === id);
    if (!person) return;
    window.confirm(`Delete ${person.name}?`);
    personsService
      .deletePerson(id)
      .then(response => {
        setPersons(persons.filter(person => person.id !== id));
      });
  }

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
    });
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterName={filterName} handleFilterChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm 
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        handleSubmit={handleSubmit}
      /> 
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} handleClick={handleDeleteClick} />
    </div>
  );
}

export default App;
