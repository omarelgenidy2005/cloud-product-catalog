import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct } from "../api/productsApi";

function Home() {
  const [products, setProducts] = useState([]);

  async function loadProducts() {
    const data = await getProducts();
    setProducts(data);
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    await deleteProduct(id);
    loadProducts();
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div>
      <h1>Products</h1>

      <div className="products-grid">
        {products.map((product) => (
          <div className="product-card" key={product.productId}>
            {product.imageUrl && (
              <img src={product.imageUrl} alt={product.name} />
            )}

            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p><strong>Price:</strong> ${product.price}</p>
            <p><strong>Category:</strong> {product.category}</p>

            <Link to={`/edit/${product.productId}`}>
              <button>Edit</button>
            </Link>

            <button onClick={() => handleDelete(product.productId)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;