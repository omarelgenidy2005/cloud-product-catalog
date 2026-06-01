import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { createProduct } from "../api/productsApi";

function AddProduct() {
  const navigate = useNavigate();

  async function handleSubmit(formData) {
    try {
      await createProduct(formData);
      navigate("/");
    } catch (error) {
      console.error("Failed to create product:", error);
      alert("Failed to create product");
    }
  }

  return <ProductForm onSubmit={handleSubmit} buttonText="Create Product" />;
}

export default AddProduct;