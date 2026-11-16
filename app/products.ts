import type { Dispatch, SetStateAction } from "react";

export const API = "https://dummyjson.com/products";

export type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  description?: string;
  rating?: number;
  thumbnail?: string;
  
  local?: boolean;
};

export type CatalogContext = {
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
  loaded: boolean;
  setLoaded: Dispatch<SetStateAction<boolean>>;
};

export const formatPrice = (price: number) => `$${price.toFixed(2)}`;