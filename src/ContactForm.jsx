import { useState } from "react"

const ContactForm = ({ existingContact = {}, updateCallback }) => {
    const [firstName, setFirstName] = useState(existingContact.firstName || "")
    const [lastName, setLastName] = useState(existingContact.lastName || "")
    const [email, setEmail] = useState(existingContact.email || "")

    const updating = Object.entries(existingContact).length !== 0  // if a passed object has at least 1 entry (length !== 0) then we're updating it

    const onSubmit = async (e) => {
        e.preventDefault()  // prevent page refreshing

        const data = {  // get data from the form (below)
            firstName,
            lastName,
            email
        }
        const url = "http://127.0.0.1:5000/" + (updating ? `update_contact/${existingContact.id}` : "create_contact")  // where the data is sent
        // if updating is true - go to corresponding update_contact endpoint. otherwise - create a new contact
        const options = {
            method: updating ? "PATCH" : "POST",  // specify options (necessary unless method is GET)
            headers: {
                "Content-Type": "application/json"  //specify that we send a json object
            },
            body: JSON.stringify(data)  // convert data into json (just like jsonify in python)
        }
        const response = await fetch(url, options)
        if (response.status !== 201 && response.status !== 200) {  // if response not successful
            const data = await response.json()
            alert(data.message)
        } else {
            updateCallback() // close the modal once we're done with the form
        }
    }

    return (
        <form onSubmit={onSubmit}>  {/* specify what function is called upon submitting */}
            <div>
                <label htmlFor="firstName">First Name:</label>
                <input 
                    type="text" 
                    id="firstName" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                />
            </div>
            <div>
                <label htmlFor="lastName">Last Name:</label>
                <input 
                    type="text" 
                    id="lastName" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                />
            </div>
            <div>
                <label htmlFor="email">Email:</label>
                <input 
                    type="text" 
                    id="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />
            </div>
            <button type="submit">{updating ? "Update" : "Create"}</button>
        </form>
    );
};

export default ContactForm