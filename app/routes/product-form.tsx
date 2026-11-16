import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { API, type CatalogContext, type Product } from "../products";

type Errors = { title?: string; price?: string; category?: string };

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { products, setProducts } = useOutletContext<CatalogContext>();

  const product = isEdit
    ? products.find((p) => String(p.id) === id)
    : undefined;

  const [title, setTitle] = useState(product?.title ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [category, setCategory] = useState(product?.category ?? "");
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (isEdit && !product) navigate("/", { replace: true });
  }, [isEdit, product, navigate]);

  if (isEdit && !product) return null;

  const categories = [...new Set(products.map((p) => p.category))].sort();

  function validate(): Errors {
    const found: Errors = {};
    if (!title.trim()) found.title = "Title is required.";
    const amount = Number(price);
    if (price.trim() === "" || !Number.isFinite(amount) || amount <= 0) {
      found.price = "Price must be a positive number.";
    }
    if (!category.trim()) found.category = "Category is required.";
    return found;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const input = {
      title: title.trim(),
      price: Number(price),
      category: category.trim(),
    };

    setSaving(true);
    setSubmitError("");
    try {
      const options = {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      };

      if (product) {
        
        if (!product.local) {
          const res = await fetch(`${API}/${product.id}`, {
            method: "PUT",
            ...options,
          });
          if (!res.ok) throw new Error("Request failed");
        }
        const updated: Product = { ...product, ...input };
        setProducts((list) =>
          list.map((p) => (p.id === updated.id ? updated : p)),
        );
      } else {
        const res = await fetch(`${API}/add`, { method: "POST", ...options });
        if (!res.ok) throw new Error("Request failed");        // unique one of our own
        const created: Product = { ...input, id: Date.now(), local: true };
        setProducts((list) => [created, ...list]);
      }
      navigate("/");
    } catch {
      setSubmitError("Could not save the product. Please try again.");
      setSaving(false);
    }
  }

  const input =
    "mt-1 w-full rounded-md border border-raised bg-raised px-3 py-2 text-white focus:border-accent focus:outline-none";

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-semibold">
        {isEdit ? "Edit Product" : "Add Product"}
      </h1>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-4 rounded-xl border border-raised bg-surface p-6 shadow-lg shadow-black/20"
      >
        <label className="block text-sm font-medium">
          Title
          <input
            className={input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        {errors.title && (
          <p className="mt-1 text-sm text-danger">{errors.title}</p>
        )}

        <label className="mt-4 block text-sm font-medium">
          Price
          <input
            className={input}
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>
        {errors.price && (
          <p className="mt-1 text-sm text-danger">{errors.price}</p>
        )}

        <label className="mt-4 block text-sm font-medium">
          Category
          <input
            className={input}
            list="category-options"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </label>
        <datalist id="category-options">
          {categories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        {errors.category && (
          <p className="mt-1 text-sm text-danger">{errors.category}</p>
        )}

        {submitError && (
          <p className="mt-4 text-sm text-danger">{submitError}</p>
        )}

        <div className="mt-6 flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-ink hover:bg-accent-hover disabled:opacity-60"
          >
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Product"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-md border border-muted px-4 py-2 text-sm hover:bg-raised"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}