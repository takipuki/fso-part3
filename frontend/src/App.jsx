import { useState, useEffect } from 'react';
import phonebook from './services/phonebook.jsx';


function App() {
  const [persons, setPersons] = useState([]);
  useEffect(() => {
    phonebook
      .getAll()
      .then(data => setPersons(data))
  }, []);

  const [filter, setFilter] = useState('');

  const [msg, setMsg] = useState(null);
  const notify = msg => {
    setMsg(msg);
    setTimeout(() => setMsg(null), 2000);
  }

  const hdlNewEntry = person => {
    const dup = persons.find(v => v.name === person.name);
    if (dup) {
      if (window.confirm(`Do you want to update the number for ${person.name}?`)) {
        phonebook
          .update({...dup, number: person.number})
          .then(data => {
            setPersons(persons.map(v => v.id === data.id ? data : v));
            notify({text: 'Number updated.', type: 'success'});
          });
        return true;
      }
      return false;
    }

    phonebook
      .add(person)
      .then(data => {
        setPersons(persons.concat(data));
        notify({text: `Added ${data.name}`, type: 'success'});
      })

    return true;
  };

  const hdlDeletion = person => {
    if (window.confirm(`Really delete ${person.name}`))
      phonebook
        .remove(person)
        .then(data => {
          setPersons(persons.filter(v => v.id != data.id));
          notify({text: `Deleted ${person.name}`, type: 'success'});
        })
        .catch(() => {
          notify({text: `${person.name} doesn't exist.`, type: 'failure'})
        });
  };

  return (
    <div>
      <Notification message={msg} />
      
      <h2>Phonebook</h2>
      <Filter filter={filter} setFilter={setFilter} />

      <h2>add a new</h2>
      <New hdlNewEntry={hdlNewEntry} />

      <h2>Numbers</h2>
      <TOC filter={filter} persons={persons} hdlDeletion={hdlDeletion} />
    </div>
  );
}


function Notification({ message }) {
  if (!message) return <></>;

  const style = {
    position: 'absolute',
    left: '70vw',
    padding: '0.5em',
    fontSize: '2em',
  };
  const styleSuccess = {
    color: 'green',
    border: '3px solid green',
  };
  const styleFailure = {
    color: 'red',
    border: '3px solid red',
  };

  return (
    <div style={{
      ...style,
      ...(message.type === 'success' ? styleSuccess : styleFailure),
    }}
    >{message.text}</div>
  );
}


function Filter({filter, setFilter}) {
  return (
      <div>
        filter:
        <input
          value={filter}
          onChange={e => setFilter(e.target.value.toLowerCase())}
        />
      </div>
  );
}


function New({hdlNewEntry}) {
  const [newName, setNewName] = useState('');
  const [newNum, setNewNum] = useState('');

  const onSubmit = e => {
    e.preventDefault();
    if (!(newName && newNum)) return;
    hdlNewEntry({ name: newName, number: newNum})
      && (setNewName(''), setNewNum(''));
  }

  return (
    <form onSubmit={onSubmit}>
      <div>
        name:
        <input
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
      </div>
      <div>
        number:
        <input
          value={newNum}
          onChange={e => setNewNum(e.target.value)}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
}


function TOC({filter, persons, hdlDeletion}) {
  return (
    <table>
      <thead><tr><th>Names</th><th>Numbers</th></tr></thead>
      <tbody>
        {persons
          .filter(v => v.name.toLowerCase().includes(filter))
          .map(v =>
            <tr key={v.id}>
              <td>{v.name}</td>
              <td>{v.number}</td>
              <td>
                <button onClick={() => hdlDeletion(v)}>
                  delete
                </button>
              </td>
            </tr>
          )
        }
      </tbody>
    </table>
  );
}


export default App;
