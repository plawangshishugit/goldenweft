import { Product } from "./products";

const STORAGE_KEY = "goldenweft_wishlist";

function loadWishlist(): Product[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveWishlist(items: Product[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("gw-wishlist-update"));
}

export function getWishlist(): Product[] {
  return loadWishlist();
}

export function addToWishlist(product: Product) {
  const wishlist = loadWishlist();
  if (!wishlist.find((p) => p.id === product.id)) {
    const updated = [...wishlist, product];
    saveWishlist(updated);
  }
}

export function removeFromWishlist(id: string) {
  const wishlist = loadWishlist();
  const updated = wishlist.filter((p) => p.id !== id);
  saveWishlist(updated);
}

export function isInWishlist(id: string): boolean {
  const wishlist = loadWishlist();
  return wishlist.some((p) => p.id === id);
}