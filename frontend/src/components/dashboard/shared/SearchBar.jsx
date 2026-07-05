import React from "react";

import {
  FaSearch,
} from "react-icons/fa";

const SearchBar = ({
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="search-bar">
      <FaSearch />

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchBar;