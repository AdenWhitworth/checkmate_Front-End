/**
 * Props for the SearchBar component.
 *
 * @interface SearchBarProps
 * @property {function} onChange - Callback function to handle changes in the search input field.
 * Takes a React change event with an HTML input element.
 */
export interface SearchBarProps {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}