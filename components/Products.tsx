"use client";
import React, { useEffect, useState } from "react";
import ProductItems from "./ProductItems";
import useSWR from "swr";
import AddProducts from "./AddProducts";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface AddProductsProps {
  showButton: (value: boolean) => void;
}

const Products = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productToEdit, setProductToEdit] = useState<any>(null);
  const {
    data: products,
    error,
    isLoading,
    mutate,
  } = useSWR("/api/products", fetcher);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  const handleEdit = (product: any) => {
    setProductToEdit(product);
    setShowAddProduct(true);
  };

  const handleDelete = async (productId: string) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete the product");
      }
      // Revalidate data
      mutate();
    } catch (err) {
      console.error("Error deleting product: ", err);
    }
  };
  return (
    <>
      <div
        className={`productsContainer ${
          showAddProduct ? "blur-background" : ""
        }`}
      >
        <h3>Products</h3>
        <div className={`productsTop `}>
          <button onClick={() => setShowAddProduct(!showAddProduct)}>
            {showAddProduct ? "Cancel" : "Add a product"}
          </button>
          <button>All Products</button>
          <button>InStock</button>
          <button>Out of Stock</button>
        </div>
        <div className="products">
          {products.map((product: any) => (
            <ProductItems
              key={product.id}
              product={product}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      {showAddProduct && (
        <div className="popup-overlay">
          <div className="popup">
            <AddProducts
              showButton={setShowAddProduct}
              product={productToEdit}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Products;
