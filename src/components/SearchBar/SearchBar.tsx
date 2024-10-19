import React from 'react';
import "./SearchBar.css";
import { SearchBarProps } from './SearchBarTypes';
import Search from "../../Images/Search.svg";

/**
 * SearchBar component that renders a styled search input field with a search icon.
 *
 * @component
 * @param {SearchBarProps} props - The props for the SearchBar component.
 * @param {function} props.onChange - Callback function that handles changes to the input field.
 * @returns {JSX.Element} The rendered SearchBar component.
 */
export default function SearchBar({ onChange }: SearchBarProps): JSX.Element {
  return (
    <div className="search-bar">
      <img className="search-img" src={Search} alt="search icon" />
      <input
        spellCheck="false"
        onChange={onChange}
        type="text"
        placeholder="Search"
      />
    </div>
  );
}

