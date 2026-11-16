import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router";
import {
  API,
  formatPrice,
  type CatalogContext,
  type Product,
} from "../products";

export function meta() {
  return [{ title: "Product Catalog" }];
}

export default function Home() {
  const { products, setProducts, loaded, setLoaded } =
    useOutletContext<CatalogContext>();
  const [category, setCategory] = useState("all");
  const [error, setError] = useState("");  // edited or deleted in this session are not overwritten.
  useEffect(() => {
    if (loaded) return;
    let cancelled = false;

    async function loadProducts() {
      try {
        const res = await fetch(`${API}?limit=30`);
        if (!res.ok) throw new Error("Request failed");
        const data = await res.json();
        if (cancelled) return;
        setProducts(data.products);
        setLoaded(true);
      } catch {
        if (!cancelled) setError("Could not load products.");
      }
    }

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, [loaded, setProducts, setLoaded]);

  async function handleDelete(product: Product) {
    if (!window.confirm(`Delete "${product.title}"?`)) return;
    try {
      if (!product.local) {
        const res = await fetch(`${API}/${product.id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Request failed");
      }
      setProducts((list) => list.filter((p) => p.id !== product.id));
    } catch {
      window.alert("Could not delete the product. Please try again.");
    }
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-danger">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 rounded-md border border-muted px-3 py-1.5 text-sm hover:bg-raised"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="flex justify-center py-20" role="status">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-raised border-t-accent" />
        <span className="sr-only">Loading products…</span>
      </div>
    );
  }

  const categories = [...new Set(products.map((p) => p.category))].sort();
  const visible =
    category === "all"
      ? products
      : products.filter((p) => p.category === category);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm font-medium">
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-md border border-raised bg-surface px-3 py-2 capitalize text-white focus:border-accent focus:outline-none"
          >
            <option value="all">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <Link
          to="/products/new"
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-ink hover:bg-accent-hover"
        >
          + Add Product
        </Link>
      </div>

      {visible.length === 0 ? (
        <p className="py-20 text-center text-soft">No products found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((product) => (
            <article
              key={product.id}
              className="flex flex-col rounded-xl border border-raised bg-surface p-4 shadow-lg shadow-black/20"
            >
              <Link to={`/products/${product.id}`} className="block">
                <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-white">
                  {product.thumbnail ? (
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      loading="lazy"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-sm text-muted">No image</span>
                  )}
                </div>
                <h2 className="mt-3 font-medium hover:text-accent">
                  {product.title}
                </h2>
              </Link>
              <p className="mt-1 font-semibold text-accent">
                {formatPrice(product.price)}
              </p>

              <div className="mt-auto flex gap-2 pt-4">
                <Link
                  to={`/products/${product.id}/edit`}
                  className="flex-1 rounded-md border border-muted px-3 py-1.5 text-center text-sm hover:bg-raised"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(product)}
                  className="flex-1 rounded-md border border-danger/50 px-3 py-1.5 text-sm text-danger hover:bg-danger/10"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}