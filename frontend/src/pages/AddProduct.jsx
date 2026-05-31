import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../api/productsApi";

function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: ""
  });

  const [image, setImage] = useState(null);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("category", form.category);

    if (image) {
      formData.append("image", image);
    }

    await createProduct(formData);
    navigate("/");
  }

  return (
    <div>
      <h1>Add Product</h1>

      <form className="product-form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Product name" value={form.name} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />

        <button type="submit">Create Product</button>
      </form>
    </div>
  );
}

export default AddProduct;