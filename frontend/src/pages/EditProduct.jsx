import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { getProduct, updateProduct } from "../api/productsApi";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await getProduct(id);
        setProduct(data);
      } catch (error) {
        console.error("Failed to load product:", error);
      }
    }

    loadProduct();
  }, [id]);

  async function handleSubmit(formData) {
    try {
      await updateProduct(id, formData);
      navigate("/");
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Failed to update product");
    }
  }

  if (!product) {
    return <div className="empty-state">Loading product...</div>;
  }

  return (
    <ProductForm
      initialData={product}
      onSubmit={handleSubmit}
      buttonText="Update Product"
    />
  );
}

export default EditProduct;