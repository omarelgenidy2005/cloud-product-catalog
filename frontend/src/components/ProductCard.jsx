import { Link } from "react-router-dom";

function ProductCard({ product, onDelete }) {
  return (
    <div className="product-card">
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-image"
        />
      ) : (
        <div className="no-image">No Image</div>
      )}

      <h2>{product.name}</h2>

      <p className="product-description">
        {product.description || "No description available"}
      </p>

      <div className="product-meta">
        <span className="price-badge">${product.price}</span>
        <span className="category-badge">{product.category}</span>
      </div>

      <div className="card-actions">
        <Link className="btn btn-primary" to={`/edit/${product.productId}`}>
          Edit
        </Link>

        <button
          className="btn btn-danger"
          onClick={() => onDelete(product.productId)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default ProductCard;