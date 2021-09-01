import React from 'react'

const PhoneBook = ({ persons, search, delentry }) => {
    return (
        <div>
            {persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase())).map((person) => (
                <div key={person.id}>
                    <span>{person.name} {person.number} </span>
                    <button onClick={() => delentry(person)} >delete</button>
                </div>
            ))}
        </div>
    )
}

export default PhoneBook
