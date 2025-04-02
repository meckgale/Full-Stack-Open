import { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const clear = () => {
    setValue('')
  }

  return {
    inputTexts: {
      type,
      value,
      onChange,
    },
    clear,
  }
}

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    const getAll = async () => {
      try {
        const response = await axios.get(baseUrl)
        setResources(response.data)
      } catch (error) {
        console.log('Error:', error)
      }
    }
    getAll()
  }, [refreshTrigger, baseUrl])

  const create = async (resource) => {
    const response = await axios.post(baseUrl, resource)
    setRefreshTrigger((prev) => prev + 1)
    return response.data
  }

  const service = {
    create,
  }

  return [resources, service]
}

const App = () => {
  const content = useField('text')
  const name = useField('text')
  const number = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: content.inputTexts.value })
    content.clear()
  }

  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({
      name: name.inputTexts.value,
      number: number.inputTexts.value,
    })
    name.clear()
    number.clear()
  }

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content.inputTexts} />
        <button>create</button>
      </form>
      {notes.map((n) => (
        <p key={n.id}>{n.content}</p>
      ))}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name.inputTexts} /> <br />
        number <input {...number.inputTexts} />
        <button>create</button>
      </form>
      {persons.map((n) => (
        <p key={n.id}>
          {n.name} {n.number}
        </p>
      ))}
    </div>
  )
}

export default App
