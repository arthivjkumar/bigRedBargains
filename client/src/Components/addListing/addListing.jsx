import React, { useEffect, useState } from 'react';
import './addListing.css';
import { getItems } from '../item/item'

function AddListing({ isOpen, onClose }) {
  async function createItem() {
    const itemName = document.querySelector("[name=itemName]").value;
    const itemDescription = document.querySelector("[name=itemDescription]").value;
    const itemCost = document.querySelector("[name = itemCost").value;
    const itemImage = document.querySelector("[name=itemImage]").value;

    const formData = {
      seller: "kln47",
      name: itemName,
      description: itemDescription,
      cost: itemCost,
      image: itemImage
    };

    try {
      const response = await fetch("http://localhost:8000/addItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Request was successful
        console.log("Data inserted successfully");
        window.location.reload()
        getItems()

      } else {
        // Request failed
        console.error("Error inserting data:", response.statusText);
      }
    } catch (error) {
      console.error("Error accessing endpoint:", error);
    }

    onClose();
  }

  useEffect(() => {
    if (!isOpen) return;
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="addListing">
      <div className="modal">
        <div className="add-listings-header">
          <h1>Add an Item</h1>
        </div>
        <div className="add-listings-body">
          <h3>Name of Item</h3>
          <input type="text" name="itemName" />
          <h3>Description of Item</h3>
          <input type="text" name="itemDescription" />
          <h3>Cost of Item</h3>
          <input type="text" name="itemCost" />
          <h3>Image of Item</h3>
          <input type="file" name="itemImage" />
        </div>
        <div className="add-listings-footer">
          <button type="submit" onClick={createItem}>Submit</button>
          <button type="submit" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default AddListing;
