import React, { FormEvent, ChangeEvent, useState } from "react";
import useSWRMutation from "swr/mutation";
import useSWR from "swr";

const fetcher = async (url: string, { arg }: any) => {
  console.log("Fetcher product: ", arg);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });

  if (!res.ok) {
    throw new Error("Failed to create a new product");
  }

  return res.json();
};

const AddProducts = ({ showButton }: any) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    inStock: false,
  });

  const { trigger } = useSWRMutation("/api/products/new", fetcher);
  const { mutate } = useSWR("/api/products", fetcher);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const data = {
        ...formData,
        quantity: parseInt(formData.quantity),
      };
      console.log("data is: ", data);
      await trigger(data);
      mutate(); // Revalidate the list after adding a new product

      showButton(false);
    } catch (err) {}
  };

  return (
    <div>
      <h3>Add Products</h3>
      <button
        onClick={() => {
          showButton(false);
        }}
      >
        x
      </button>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Category:
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
        </label>
        <label>
          Quantity:
          <input
            type="text"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
          />
        </label>
        <label>
          In Stock:
          <input
            type="checkbox"
            name="inStock"
            checked={formData.inStock}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProducts;
