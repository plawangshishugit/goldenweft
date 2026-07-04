"use client";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

const CART_KEY = "gw_cart";
const CART_LOCK_KEY = "gw_cart_locked";

/* ---------- Lock helpers ---------- */
export function isCartLocked() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(CART_LOCK_KEY) === "true";
}

export function lockCart() {
  localStorage.setItem(CART_LOCK_KEY, "true");
}

export function unlockCart() {
  localStorage.removeItem(CART_LOCK_KEY);
}

/* ---------- Get cart (ALWAYS READABLE) ---------- */
export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

/* ---------- INTERNAL (raw cart, no lock) ---------- */
function getRawCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

/* ---------- Add item ---------- */
export function addToCart(item: Omit<CartItem, "quantity">) {
  const cart = getRawCart(); // bypass lock

  const existing = cart.find(
    (c) => c.productId === item.productId
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  notifyCartUpdate();
}

/* ---------- Update quantity ---------- */
export function updateCartQuantity(
  productId: string,
  quantity: number
) {
  if (isCartLocked()) return;

  const cart = getCart();
  const item = cart.find((i) => i.productId === productId);
  if (!item) return;

  if (quantity <= 0) {
    const filtered = cart.filter(
      (i) => i.productId !== productId
    );
    localStorage.setItem(CART_KEY, JSON.stringify(filtered));
    notifyCartUpdate();
    return;
  }

  item.quantity = quantity;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  notifyCartUpdate();
}

/* ---------- Remove item ---------- */
export function removeFromCart(productId: string) {
  const cart = getRawCart().filter(
    (item) => item.productId !== productId
  );

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  notifyCartUpdate();
}

/* ---------- Clear cart ---------- */
export function clearCart() {
  localStorage.removeItem(CART_KEY);
  unlockCart();
  notifyCartUpdate();
}

/* ---------- Cart count ---------- */
export function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

/* ---------- Event ---------- */
function notifyCartUpdate() {
  window.dispatchEvent(new Event("gw-cart-update"));
}
