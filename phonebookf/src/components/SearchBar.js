import React from 'react'

const SearchBar = ({ search, setSearch }) => {
    return (
        <p>filter shown with <input value={search} onChange={e => setSearch(e.target.value)} /></p>
    )
}

export default SearchBar
