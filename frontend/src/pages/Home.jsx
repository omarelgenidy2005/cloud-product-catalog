import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { deleteProduct, getProducts } from "../api/productsApi";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((product) => product.productId !== id));
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product");
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  if (loading) {
    return <div className="empty-state">Loading products...</div>;
  }

  return (
    <>
      <div className="page-header">
        <h1>Products</h1>
        <p>Manage your cloud-hosted product catalog with images stored in S3.</p>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          No products found. Add your first product.
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product.productId}
              product={product}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default Home;