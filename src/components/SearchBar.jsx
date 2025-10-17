import React from 'react'

const SearchBar = ({ value, onChange, placeholder = "Buscar..." }) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="border p-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
)

export default SearchBar
