import { useState } from "react";

function ProductForm({ initialData = {}, onSubmit, buttonText }) {
  const [name, setName] = useState(initialData.name || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [price, setPrice] = useState(initialData.price || "");
  const [category, setCategory] = useState(initialData.category || "");
  const [image, setImage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);

    if (image) {
      formData.append("image", image);
    }

    await onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px" }}>
      <div>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div>
        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>

      <div>
        <label>Price</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </div>

      <div>
        <label>Category</label>
        <input value={category} onChange={(e) => setCategory(e.target.value)} required />
      </div>

      <div>
        <label>Image</label>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      </div>

      <button type="submit">{buttonText}</button>
    </form>
  );
}

export default ProductForm;