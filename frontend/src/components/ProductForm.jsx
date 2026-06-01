import { useState } from "react";

function ProductForm({
  initialData = {},
  onSubmit,
  buttonText = "Create Product",
}) {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    description: initialData.description || "",
    price: initialData.price || "",
    category: initialData.category || "",
    image: null,
  });

  function handleChange(e) {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData((prev) => ({
        ...prev,
        image: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);

    if (formData.image) {
      data.append("image", formData.image);
    }

    onSubmit(data);
  }

  return (
    <div className="form-page">
      <div className="form-card">
        <div className="form-header">
          <h1>{buttonText === "Create Product" ? "Add Product" : "Edit Product"}</h1>
          <p>Fill in the product details and upload an image to store it in S3.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              placeholder="Example: Black Hoodie"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Write a short product description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                name="price"
                placeholder="Example: 50"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                placeholder="Example: Clothes"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Product Image</label>
            <label className="file-upload">
              <span>
                {formData.image ? formData.image.name : "Choose product image"}
              </span>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
            </label>
          </div>

          <button className="submit-btn" type="submit">
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;