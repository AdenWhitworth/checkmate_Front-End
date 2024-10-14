import React from 'react';
import "./SearchBar.css";
import { SearchBarProps } from './SearchBarTypes';
import Search from "../../Images/Search.svg";

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

