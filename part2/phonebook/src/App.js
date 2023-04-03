import { useState, useEffect } from 'react';

import "./index.css";

import Filter from "./Components/Filter";
import PersonForm from './Components/PersonForm';
import Persons from './Components/Persons';
import Notification from './Components/Notification';
import ErrorMessage from './Components/Error';

import personsService from "./Services/Persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filterName, setFilterName] = useState('');
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

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
    if (persons.find(p => p.name === newName)) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        const person = persons.find(p => p.name === newName);
        const changedPerson = { ...person, number: newNumber };
        personsService
          .update(person.id, changedPerson)
          .then(response => {
            setPersons(persons.map(p => p.id !== person.id ? p : response));
            setNotificationMessage(`${person.name}'s phone has been successfully updated`);
            setTimeout(() => {
              setNotificationMessage(null);
            }, 4000);
          })
          .catch(error => {
            setErrorMessage(error.response.data.error);
            setTimeout(() => {
              setErrorMessage(null)
            }, 4000);
          });
      }
      setNewName('');
      setNewNumber('');
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
        setNotificationMessage(`The new person ${response.name} has been successfully added`);
        setTimeout(() => {
          setNotificationMessage(null);
        }, 4000);
      })
      .catch(error => {
        setErrorMessage(error.response.data.error);
        setTimeout(() => {
          setErrorMessage(null)
        }, 4000);
      });
  }

  const handleDeleteClick = (id) => () => {
    const person = persons.find(person => person.id === id);
    if (!person) return;
    if (window.confirm(`Delete ${person.name}?`)) {
      personsService
        .deletePerson(id)
        .then(response => {
          setPersons(persons.filter(person => person.id !== id));
          setNotificationMessage(`${person.name} has been successfully deleted`);
          setTimeout(() => {
            setNotificationMessage(null);
          }, 4000);
        })
        .catch(error => {
          setErrorMessage(`Information of ${person.name} has already been removed from server`);
            setTimeout(() => {
              setErrorMessage(null)
            }, 4000);
          setPersons(persons.filter(person => person.id !== id));
        });
    } 
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
      <ErrorMessage message={errorMessage} />
      <Filter filterName={filterName} handleFilterChange={handleFilterChange} />
      <h2>Add a new</h2>
      <Notification message={notificationMessage} />
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
