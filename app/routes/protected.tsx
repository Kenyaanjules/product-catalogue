import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import type { CatalogContext, Product } from "../products";

export default function ProtectedLayout() {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setAllowed(true);
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  if (!allowed) return null;

  const context: CatalogContext = { products, setProducts, loaded, setLoaded };

  return (
    <div className="min-h-screen bg-ink text-white">
      <header className="border-b border-raised bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-semibold">
            Product Catalog
          </Link>
          <button
            onClick={logout}
            className="rounded-md border border-muted px-3 py-1.5 text-sm hover:bg-raised"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet context={context} />
      </main>
    </div>
  );
}