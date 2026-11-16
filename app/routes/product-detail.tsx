import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router";
import { API, formatPrice, type CatalogContext } from "../products";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, setProducts } = useOutletContext<CatalogContext>();
  const [error, setError] = useState("");

  const product = products.find((p) => String(p.id) === id);

  useEffect(() => {
    if (!product) navigate("/", { replace: true });
  }, [product, navigate]);

  if (!product) return null;

  async function handleDelete() {
    if (!product || !window.confirm(`Delete "${product.title}"?`)) return;
    try {
      if (!product.local) {
        const res = await fetch(`${API}/${product.id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Request failed");
      }
      setProducts((list) => list.filter((p) => p.id !== product.id));
      navigate("/");
    } catch {
      setError("Could not delete the product. Please try again.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-accent hover:underline"
      >
        ← Back
      </button>

      <div className="grid gap-6 rounded-xl border border-raised bg-surface p-6 shadow-lg shadow-black/20 sm:grid-cols-2">
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-white">
          {product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={product.title}
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-sm text-muted">No image</span>
          )}
        </div>

        <div>
          <span className="rounded-full bg-raised px-2.5 py-1 text-xs capitalize text-soft">
            {product.category}
          </span>
          <h1 className="mt-3 text-2xl font-semibold">{product.title}</h1>
          <p className="mt-2 text-xl font-semibold text-accent">
            {formatPrice(product.price)}
          </p>
          <p className="mt-1 text-sm text-soft">
            Rating:{" "}
            {product.rating != null ? `${product.rating} / 5` : "Not rated"}
          </p>
          <p className="mt-4 text-soft">
            {product.description || "No description."}
          </p>

          {error && <p className="mt-4 text-sm text-danger">{error}</p>}

          <div className="mt-6 flex gap-2">
            <Link
              to={`/products/${product.id}/edit`}
              className="rounded-md border border-muted px-4 py-2 text-sm hover:bg-raised"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="rounded-md border border-danger/50 px-4 py-2 text-sm text-danger hover:bg-danger/10"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}