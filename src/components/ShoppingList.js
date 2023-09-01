import React, { useEffect, useState } from "react";
import ItemForm from "./ItemForm";
import Filter from "./Filter";
import Item from "./Item";

function ShoppingList() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/items")
      .then((r) => r.json())
      .then((items) => setItems(items));
  }, []);

  function handleAddItem(newItem) {
    // Update the API with the new item
    fetch("http://localhost:4000/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    })
      .then((r) => r.json())
      .then((createdItem) => {
        // Add the new item to the state
        setItems([...items, createdItem]);
      });
  }

  function handleCategoryChange(category) {
    setSelectedCategory(category);
  }

  const itemsToDisplay = items.filter((item) => {
    if (selectedCategory === "All") return true;
    return item.category === selectedCategory;
  });

  function handleUpdateItem(updatedItem) {
    // Update the API with the updated item
    fetch(`http://localhost:4000/items/${updatedItem.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedItem),
    })
      .then((r) => r.json())
      .then((updatedItem) => {
        // Update the item in the state
        const updatedItems = items.map((item) => {
          if (item.id === updatedItem.id) {
            return updatedItem;
          } else {
            return item;
          }
        });
        setItems(updatedItems);
      });
  }

  function handleDeleteItem(deletedItem) {
    // Delete the item from the API
    fetch(`http://localhost:4000/items/${deletedItem.id}`, {
      method: "DELETE",
    })
      .then((r) => r.json())
      .then(() => {
        // Remove the item from the state
        const updatedItems = items.filter((item) => item.id !== deletedItem.id);
        setItems(updatedItems);
      });
  }

  return (
    <div className="ShoppingList">
      <ItemForm onAddItem={handleAddItem} />
      <Filter
        category={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      <ul className="Items">
        {itemsToDisplay.map((item) => (
          <Item
            key={item.id}
            item={item}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
          />
        ))}
      </ul>
    </div>
  );
}

export default ShoppingList;
