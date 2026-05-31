import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct, updateProduct } from "../api/productsApi";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: ""
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    async function loadProduct() {
      const product = await getProduct(id);

      setForm({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category
      });
    }

    loadProduct();
  }, [id]);

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

    await updateProduct(id, formData);
    navigate("/");
  }

  return (
    <div>
      <h1>Edit Product</h1>

      <form className="product-form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Product name" value={form.name} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />

        <button type="submit">Update Product</button>
      </form>
    </div>
  );
}

export default EditProduct;