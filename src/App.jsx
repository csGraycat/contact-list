import { useState, useEffect } from 'react'
import ContactList from './ContactList'
import './App.css'
import ContactForm from './ContactForm'

function App() {
  const [contacts, setContacts] = useState([])  // set state with the contacts from the fetchContacts function
  const [isModalOpen, setIsModalOpen] = useState(false) // modal is closed by default
  const [currentContact, setCurrentContact] = useState({})  // store the contact for editing

  useEffect( () => {  // useEffect - executes when the component is rendered
    fetchContacts()   // once it loads, call the fetchContacts function
  }, [])

  const fetchContacts = async () => {
    const response = await fetch("http://127.0.0.1:5000/contacts")  // send a request (GET by default) to the /contacts endpoint and wait for it
    const data = await response.json()  // {"contacts": []}
    setContacts(data.contacts)
    console.log(data.contacts)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentContact({})
  }

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true)  // if modal not opened - open it
  }

  const openEditModal = (contact) => {
    if (isModalOpen) return
    setCurrentContact(contact)
    setIsModalOpen(true)
  }

  const onUpdate = () => {
    closeModal()
    fetchContacts()
  }

  return ( 
  <>
    <ContactList contacts={contacts} updateContact={openEditModal} updateCallback={onUpdate}/>
    <button onClick={openCreateModal}>
      Create New Contact
    </button>
    { isModalOpen && <div className="modal">
      <div className="modal-content">
        <span className='close' onClick={closeModal}>&times;</span> {/* &times; is an X icon*/} 
      <ContactForm existingContact={currentContact} updateCallback={onUpdate} />
      </div>
    </div>
    }
     
  </>
  );
}

export default App
