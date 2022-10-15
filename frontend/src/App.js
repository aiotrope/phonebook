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

const Persons = ({ persons, search, setCount, setErrorMsg }) => {
  const onClick = (event) => {
    const target = event.target.value;
    const targetName = event.target.name;

    personsService
      .omit(target)
      .then((response) => {
        if (response.data.message !== null) {
          const confirm = window.confirm(`Delete ${targetName}?`);
          if (confirm) {
            setCount((c) => c + 1);
          }
        }
      })
      .catch((e) => {
        console.log(e.message);
        setErrorMsg(
          `Information of ${targetName} has already been removed from server`
        );
        let timer;
        clearTimeout(timer);
        timer = setTimeout(() => {
          setErrorMsg(null);
        }, 6000);
        setCount((c) => c + 1);
      });
  };

  return (
    <>
      {persons
        .filter((elem) =>
          elem.name.toUpperCase().includes(search.toUpperCase())
        )
        .map((person, idx) => {
          return (
            <div key={idx}>
              {person.name} {person.number}
              <button
                value={person.id}
                name={person.name}
                onClick={onClick}
                className="button"
              >
                delete
              </button>
            </div>
          );
        })}
    </>
  );
};

const PersonForm = ({
  persons,
  setPersons,
  newName,
  setNewName,
  newNumber,
  setNewNumber,
  setSuccessMsg,
  setErrorMsg,
  setCount,
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

    if (haveMatch) {
      const targetId = persons
        .filter((p) => p.name === newName)
        .map((p) => p.id);

      const updatedEntry = { name: newName, number: newNumber };

      personsService
        .update(targetId, updatedEntry)
        .then((response) => {
          console.log(response);

          if (
            response.data.update_person !== null &&
            newNumber !== null &&
            newNumber !== undefined
          ) {
            const confirm = window.confirm(
              `${newName} is already added to phonebook, replace the old number with a new one?`
            );

            if (confirm) {
              setPersons(persons.concat(updatedEntry));
              setSuccessMsg(`${newName}'s updated phone number: ${newNumber}`);
              setCount((c) => c + 1);
              setTimeout(() => {
                setSuccessMsg(null);
              }, 5000);
            }
          }
        })
        .catch((err) => {
          if (err.response.status === 404) {
            setErrorMsg(
              `Information of ${newName} has already been removed from server`
            );
            let timer;
            clearTimeout(timer);
            timer = setTimeout(() => {
              setErrorMsg(null);
            }, 6000);
            setCount((c) => c + 1);
          } else if (err.response.status === 400) {
            setErrorMsg(err.response.data.error);
            let timer;
            clearTimeout(timer);
            timer = setTimeout(() => {
              setErrorMsg(null);
            }, 6000);
            setCount((c) => c + 1);
          }

          console.log(err.response);
          setPersons(persons.filter((p) => p.id !== targetId));
        });
    } else {
      // post new entries on the backend
      const newEntry = { name: newName, number: newNumber };

      personsService
        .create(newEntry)
        .then((response) => {
          console.log(response.data);

          setPersons(persons.concat(newEntry));
          if (response.status === 201) {
            setSuccessMsg(`Added ${newName}`);
            setCount((c) => c + 1);
            let timer;
            clearTimeout(timer);
            timer = setTimeout(() => {
              setSuccessMsg(null);
            }, 6000);
          }
        })
        .catch((err) => {
          console.log(err.response);
          setErrorMsg(err.response.data.error);
          let timer;
          clearTimeout(timer);
          timer = setTimeout(() => {
            setErrorMsg(null);
          }, 6000);
          setCount((c) => c + 1);

          if (err.response.status === 500) {
            setErrorMsg(err.response.data.error);
            let timer;
            clearTimeout(timer);
            timer = setTimeout(() => {
              setErrorMsg(null);
            }, 6000);
            setCount((c) => c + 1);
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

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
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

  return (
    <div>
      <h2>Phonebook</h2>

      {successMsg && <div className="success">{successMsg}</div>}

      {errorMsg && <div className="error">{errorMsg}</div>}

      <Filter search={search} setSearch={setSearch} />

      <h3>Add a new</h3>

      <PersonForm
        newName={newName}
        newNumber={newNumber}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
        persons={persons}
        setPersons={setPersons}
        setSuccessMsg={setSuccessMsg}
        setErrorMsg={setErrorMsg}
        setCount={setCount}
      />

      <h3>Numbers</h3>

      <Persons
        persons={persons}
        search={search}
        setCount={setCount}
        setErrorMsg={setErrorMsg}
      />
    </div>
  );
};

export default App;