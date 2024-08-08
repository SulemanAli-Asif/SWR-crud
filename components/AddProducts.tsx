import React, { FormEvent, ChangeEvent, useState, useEffect } from "react";
import useSWRMutation from "swr/mutation";
import useSWR from "swr";

const fetcher = async (
  url: string,
  { arg, method }: { arg: any; method: string }
) => {
  const res = await fetch(url, {
    method: arg.method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg.arg),
  });

  if (!res.ok) {
    throw new Error(
      `Failed to ${method === "PATCH" ? "update" : "create"} the product`
    );
  }

  return res.json();
};
interface Products {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  inStock: boolean;
}

interface AddProductsProps {
  showButton: any;
  product: Products;
  isEditing: boolean;
}

const AddProducts: React.FC<AddProductsProps> = ({
  showButton,
  product,
  isEditing,
}: AddProductsProps) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    inStock: false,
  });

  useEffect(() => {
    if (product && isEditing) {
      setFormData({
        name: product.name,
        category: product.category,
        quantity: product.quantity.toString(),
        inStock: product.inStock,
      });
    } else {
      setFormData({
        name: "",
        category: "",
        quantity: "",
        inStock: false,
      });
    }
  }, [product, isEditing]);

  const { trigger } = useSWRMutation(
    product ? `/api/products/${product.id}` : "/api/products/new",
    fetcher
  );
  const { mutate } = useSWR("/api/products", fetcher);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      quantity: "",
      inStock: false,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const data: any = {
        ...formData,
        quantity: parseInt(formData.quantity),
      };
      const method: string = product ? "PATCH" : "POST";
      await trigger({ arg: data, method });

      mutate();
      resetForm();
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
        <button type="submit">
          {product ? "Edit Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProducts;
