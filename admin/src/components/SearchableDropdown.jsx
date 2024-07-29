import React, { useRef, useEffect } from 'react';
import Select from 'react-select';

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        border: '1px solid #cbd5e0',
        borderRadius: '0.375rem',
        boxShadow: state.isFocused ? '0 0 0 1px blue' : 'none',
        '&:hover': {
            borderColor: '#94a3b8'
        }
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? '#edf2f7' : 'white',
        color: '#1a202c',
        cursor: 'pointer'
    }),
    menu: (provided) => ({
        ...provided,
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        borderRadius: '0.5rem'
    }),
    singleValue: (provided) => ({
        ...provided,
        color: '#1a202c'
    })
};

const SearchableDropdown = ({ options, selectedValue, onChange }) => {
    const dropdownRef = useRef(null);

    const handleSelectChange = (selectedOption) => {
        onChange(selectedOption.value);
    };
    return (
        <div className="relative w-full" ref={dropdownRef}>
            <Select
                styles={customStyles}
                options={options}
                value={options?.find(option => option.value === selectedValue)}
                onChange={handleSelectChange}
                placeholder="Search..."
                isSearchable
                noOptionsMessage={() => 'No results found'}
            />
        </div>
    );
};

export default SearchableDropdown;
