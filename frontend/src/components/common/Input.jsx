import React from "react";

const Input = ({
  label,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  error,
  icon,
}) => {
  return (
    <div className="input-group">
      {label && (
        <label htmlFor={name}>
          {label}
        </label>
      )}

      <div className="input-wrapper">
        {icon && (
          <span className="input-icon">
            {icon}
          </span>
        )}

        <input
          id={name}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="input-field"
        />
      </div>

      {error && (
        <span className="input-error">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;