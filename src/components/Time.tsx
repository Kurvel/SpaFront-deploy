import React, { useState } from 'react';
import './ChoiceWarmCold.css'

export interface TimeOption {
  
  label: string;
}

interface TimeProps {
  timeOptions: TimeOption[];
    selectedTime: TimeOption | null;
    setSelectedTime: (option: TimeOption) => void;
}

const Time: React.FC<TimeProps> = ({ timeOptions, selectedTime, setSelectedTime }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (timeOption: TimeOption) => {
    setSelectedTime(timeOption);
    setIsOpen(false);
  };

  return (
    <div>
      <div className='dropDown' onClick={toggleDropdown}>
        {selectedTime ? selectedTime.label : 'Am, Fm or Evning?'}
        <i className={`arrow ${isOpen ? 'open' : ''}`} />
      </div>
      {isOpen && (
        <ul className='ul' >
          {timeOptions.map((option, index) => (
            <li key={index} onClick={() => handleOptionClick(option)}>
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Time;
