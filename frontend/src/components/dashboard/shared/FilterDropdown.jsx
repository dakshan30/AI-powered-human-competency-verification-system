import React from "react";

const FilterDropdown = ({
  options,
  value,
  onChange,
}) => {
  return (
    <select
      className="filter-dropdown"
      value={value}
      onChange={onChange}
    >
      {options.map((option) => (
        <option
          key={option}
          value={option}
        >
          {option}
        </option>
      ))}
    </select>
  );
};

export default FilterDropdown;