import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  route("login", "routes/login.tsx"),

  layout("routes/protected.tsx", [
    index("routes/home.tsx"),
    route("products/new", "routes/product-form.tsx", { id: "product-new" }),
    route("products/:id", "routes/product-detail.tsx"),
    route("products/:id/edit", "routes/product-form.tsx", {
      id: "product-edit",
    }),
  ]),
] satisfies RouteConfig;