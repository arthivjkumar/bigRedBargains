import './filter.css';
import React, { useEffect, useState } from 'react';
import dateIcon from '../../assets/images/calendarIcon.png'
import tagIcon from '../../assets/images/tagIcon.png'
import costIcon from '../../assets/images/moneyIcon.png'

function Filter({ isOpen, onClose }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
  }, [isOpen]);

  if (!isOpen) return null;


 function selected(id) {
    let icon = document.getElementById(id);
    console.log(icon)
    if (icon) {
      icon.classList.add("selected")
    }
  }

  return (
    <div className="Filter">
      <div className="Modal">
        <header className="Table-Header">
          <h1>Add Filter</h1>
        </header>
        <div className="Table">
          <div className="Component Filter-Date" id="filter-date">
            <img src={dateIcon} onClick={() => selected("filter-date")}></img>
            <h3>Date</h3>
          </div>
          <div className="Component Filter-Tag" id="filter-tag">
            <img src={tagIcon} onClick={() => selected("filter-tag")}></img>
            <h3>Tag</h3>
          </div>
          <div className="Component Filter-Cost" id="filter-cost">
            <img src={costIcon} onClick={() => selected("filter-cost")}></img>
            <h3>Cost</h3>
          </div>
        </div>
        <div className="Buttons">
          <button>Apply</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default Filter;
