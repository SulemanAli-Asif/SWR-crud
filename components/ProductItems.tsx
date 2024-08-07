const ProductItems = ({ product, handleEdit, handleDelete }: any) => {
  return (
    <div className="product">
      <h2>{product.name}</h2>
      <p>{product.category}</p>
      <p>{product.price}</p>
      <p>{product.quantity}</p>
      {product.inStock ? <p>In Stock</p> : <p>Out of Stock</p>}
      <button onClick={() => handleEdit(product)}>Edit</button>
      <button onClick={() => handleDelete(product.id)}>Delete</button>
    </div>
  );
};

export default ProductItems;
