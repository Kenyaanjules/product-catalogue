import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";

export function meta() {
  return [{ title: "Login | Product Catalog" }];
}

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/", { replace: true });
  }, [navigate]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Enter a username and password.");
      return;
    }
    localStorage.setItem("token", "dummy");
    navigate("/");
  }

  const input =
    "mt-1 w-full rounded-md border border-raised bg-raised px-3 py-2 text-white focus:border-accent focus:outline-none";

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-raised bg-surface p-6 shadow-lg shadow-black/20"
      >
        <h1 className="text-xl font-semibold">Product Catalog</h1>
        <p className="mt-1 text-sm text-soft">
          Sign in with any username and password.
        </p>

        <label className="mt-5 block text-sm font-medium">
          Username
          <input
            className={input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
        </label>

        <label className="mt-4 block text-sm font-medium">
          Password
          <input
            type="password"
            className={input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && <p className="mt-3 text-sm text-danger">{error}</p>}

        <button
          type="submit"
          className="mt-5 w-full rounded-md bg-accent px-4 py-2 font-semibold text-ink hover:bg-accent-hover"
        >
          Login
        </button>
      </form>
    </div>
  );
}
