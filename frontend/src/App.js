import { useState, useEffect } from "react";
import personsService from "./services/persons";
import "./styles.css";

const Filter = ({ search, setSearch }) => {
  const onChange = (event) => {
    let keyword = event.target.value;
    setSearch(keyword);
  };

  return (
    <form>
      <div>
        filter shown with:
        <input type="text" name="filter" value={search} onChange={onChange} />
      </div>
    </form>
  );
};

const PersonForm = ({
  persons,
  setPersons,
  newName,
  setNewName,
  newNumber,
  setNewNumber,
}) => {
  const onChangeName = (event) => {
    event.persist();
    const target = event.target.value;
    setNewName(target);
  };

  const onChangeNumber = (event) => {
    event.persist();
    const target = event.target.value;
    setNewNumber(target);
  };

  const onSubmit = (event) => {
    if (event) event.preventDefault();
    const namesArr = persons.map((e) => e.name);
    const haveMatch = namesArr.includes(newName);

    if (newName.length === 0) {
      alert("You forgot to enter your name!");
    } else if (newNumber.length === 0) {
      alert("You forgot to enter your phone number!");
    } else if (haveMatch) {
      alert(`${newName} is already added to phonebook`);
    } else {
      // post new entries on the backend
      const newEntry = { name: newName, number: newNumber };

      personsService
        .create(newEntry)
        .then((response) => {
          console.log(response.data);
          setPersons(persons.concat(newEntry));
        })
        .catch((error) => {
          alert(`${error.response.data.error}`); // error response from the server
          if (error.response) {
            //console.log(error.response.statusText)
            console.log(error.message);
          }
        });
    }
    setNewName("");
    setNewNumber("");
  };

  return (
    <>
      <form onSubmit={onSubmit} noValidate>
        <div>
          name:{" "}
          <input
            type="text"
            name="name"
            onChange={onChangeName}
            value={newName || ""}
            required
          />
          <br />
          number:{" "}
          <input
            type="text"
            name="number"
            onChange={onChangeNumber}
            value={newNumber || ""}
            required
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};

const DeleteButton = ({ id, setPersons, targetName }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    personsService
      .getAll()
      .then((res) => {
        const init = res.data;
        //console.log(init);
        setPersons(init);
      })
      .catch((e) => console.log(e.message));
  }, [count, setPersons]);

  const onClick = (event) => {
    const target = event.target.value;
    //console.log(target);
    const confirm = window.confirm(`Delete ${targetName}?`);
    console.log(confirm);

    if (confirm) {
      personsService
        .omit(target)
        .then((returedPerson) => {
          setCount((c) => c + 1);
          //console.log(returedPerson);
        })
        .catch((e) => {
          console.log(e.message);
          alert(`Problem deleting resource: ${e.message}`);
        });
    }
  };

  return (
    <button value={id} onClick={onClick} className="button">
      delete
    </button>
  );
};

const Persons = ({ persons, setPersons, search }) => {
  const [count, setCount] = useState(0);

  /* useEffect(() => {
    personsService
      .getAll()
      .then((res) => {
        const init = res.data;
        //console.log(init);
        setPersons(init);
      })
      .catch((e) => console.log(e.message));
  }, [setPersons]);
  console.log(persons); */

  useEffect(() => {
    personsService
      .getAll()
      .then((res) => {
        const init = res.data;
        //console.log(init);
        setPersons(init);
      })
      .catch((e) => console.log(e.message));
  }, [count, setPersons]);

  const onClick = (event) => {
    const target = event.target.value;
    const targetName = persons
      .filter((i) => i._id === target)
      .map((target) => target.name);
    //console.log(target);
    const confirm = window.confirm(`Delete ${targetName}?`);
    console.log(confirm);

    if (confirm) {
      personsService
        .omit(target)
        .then((returedPerson) => {
          setCount((c) => c + 1);
          //console.log(returedPerson);
        })
        .catch((e) => {
          console.log(e.message);
          alert(`Problem deleting resource: ${e.message}`);
        });
    }
  };

  return (
    <>
      {persons
        .filter((elem) =>
          elem.name.toUpperCase().includes(search.toUpperCase())
        )
        .map((person) => {
          return [
            <div key={person._id}>
              {person.name} {person.number}
              <button
                value={person._id}
                name={person.name}
                onClick={onClick}
                className="button"
              >
                delete
              </button>
            </div>,
          ];
        })}
    </>
  );
};
const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} setSearch={setSearch} />
      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
        persons={persons}
        setPersons={setPersons}
      />

      <h3>Numbers</h3>
      <div>
        <Persons persons={persons} setPersons={setPersons} search={search} />
      </div>
    </div>
  );
};

export default App;
