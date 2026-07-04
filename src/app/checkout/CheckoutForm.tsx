"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getCart, clearCart, CartItem, lockCart, isCartLocked } from "@/lib/cart";
import Link from "next/link";
import Image from "next/image";

const ORDER_REF_KEY = "gw_last_order_ref";
const CART_SNAPSHOT_KEY = "gw_last_cart";
const ORDER_PAYMENT_METHOD_KEY = "gw_last_payment_method";
const ORDER_TOTAL_KEY = "gw_last_total";
const IDEMPOTENCY_KEY = "gw_checkout_idempotency_key";

function loadRazorpay() {
  return new Promise<boolean>((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// Persisted across refreshes (not just component state) so a mid-payment
// page reload retries the SAME checkout attempt instead of silently
// starting a second one server-side.
function getOrCreateIdempotencyKey(): string {
  if (typeof window === "undefined") return "";
  let key = localStorage.getItem(IDEMPOTENCY_KEY);
  if (!key) {
    key = crypto.randomUUID();
    localStorage.setItem(IDEMPOTENCY_KEY, key);
  }
  return key;
}

function buildWhatsAppMessage(ref: string, name: string, cart: CartItem[], paymentMethod: "ONLINE" | "COD") {
  const items = cart.map((i, idx) => `${idx + 1}. ${i.name} × ${i.quantity}`).join("\n");
  const statusLine = paymentMethod === "COD" ? "Order placed — Cash on Delivery." : "Payment confirmed.";
  return encodeURIComponent(`Hello GoldenWeft,\n\n${statusLine}\n\nOrder Reference: ${ref}\nName: ${name}\n\nItems:\n${items}\n\nPlease confirm the order.`);
}

const inputClass = "w-full border border-[var(--color-border)] px-4 py-3.5 text-[0.875rem] text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:outline-none focus:border-[var(--ink)] transition-colors duration-200 bg-[var(--paper)]";
const labelClass = "text-[0.68rem] tracking-[0.12em] uppercase text-[var(--ink-mid)] mb-3 block";

export default function CheckoutForm({
  userName,
  userEmail,
  userPhone,
}: {
  userName: string;
  userEmail: string;
  userPhone?: string;
}) {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [orderRef, setOrderRef] = useState("");
  const [confirmedTotal, setConfirmedTotal] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"ONLINE" | "COD">("ONLINE");
  const [submittedPaymentMethod, setSubmittedPaymentMethod] = useState<"ONLINE" | "COD">("ONLINE");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const idempotencyKeyRef = useRef<string>("");

  useEffect(() => {
    const cartData = getCart();
    setCart(cartData);
    if (isCartLocked()) {
      const savedRef = localStorage.getItem(ORDER_REF_KEY);
      const savedCart = localStorage.getItem(CART_SNAPSHOT_KEY);
      const savedMethod = localStorage.getItem(ORDER_PAYMENT_METHOD_KEY);
      const savedTotal = localStorage.getItem(ORDER_TOTAL_KEY);
      if (savedRef && savedCart) {
        setOrderRef(savedRef);
        setSubmitted(true);
        setCart(JSON.parse(savedCart));
        setConfirmedTotal(savedTotal ? Number(savedTotal) : 0);
        if (savedMethod === "COD" || savedMethod === "ONLINE") {
          setSubmittedPaymentMethod(savedMethod);
        }
      }
    } else if (cartData.length > 0) {
      idempotencyKeyRef.current = getOrCreateIdempotencyKey();
    }
  }, []);

  // Client-side total is shown while shopping (before submit) purely for
  // display — every route re-derives the real total from the database,
  // this number is never trusted for charging or recording anything.
  const displayTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function finalizeSuccess(ref: string, total: number, method: "ONLINE" | "COD") {
    localStorage.setItem(ORDER_REF_KEY, ref);
    localStorage.setItem(CART_SNAPSHOT_KEY, JSON.stringify(cart));
    localStorage.setItem(ORDER_PAYMENT_METHOD_KEY, method);
    localStorage.setItem(ORDER_TOTAL_KEY, String(total));
    localStorage.removeItem(IDEMPOTENCY_KEY);
    setOrderRef(ref);
    setConfirmedTotal(total);
    setSubmittedPaymentMethod(method);
    setSubmitted(true);
    clearCart();
    lockCart();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isProcessing) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const contact = String(formData.get("contact") || "").trim();
    const notes = String(formData.get("notes") || "").trim();
    const shippingAddress = {
      fullName: name,
      phone: String(formData.get("phone") || "").trim(),
      line1: String(formData.get("line1") || "").trim(),
      line2: String(formData.get("line2") || "").trim(),
      landmark: String(formData.get("landmark") || "").trim(),
      city: String(formData.get("city") || "").trim(),
      state: String(formData.get("state") || "").trim(),
      postalCode: String(formData.get("postalCode") || "").trim(),
      country: "India",
    };

    setCustomerName(name);
    setErrorMessage(null);

    if (!idempotencyKeyRef.current) idempotencyKeyRef.current = getOrCreateIdempotencyKey();
    const idempotencyKey = idempotencyKeyRef.current;

    setIsProcessing(true);

    try {
      // ---------- Cash on Delivery ----------
      if (paymentMethod === "COD") {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idempotencyKey, name, contact, notes, cart, shippingAddress, paymentMethod: "COD" }),
        });
        const data = await res.json();
        if (!res.ok) {
          if (data.requiresAuth) {
            router.push("/login?redirect=/checkout");
            return;
          }
          const e: any = new Error(data.error || "Failed to place order");
          e.unavailable = data.unavailable;
          throw e;
        }
        finalizeSuccess(data.reference, data.total, "COD");
        return;
      }

      // ---------- Pay Online via Razorpay ----------
      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) throw new Error("Payment gateway failed to load. Please check your connection and try again.");

      // The order is created server-side FIRST, priced from the database,
      // before the customer ever sees the payment sheet. If the browser
      // is closed right after paying, this order already exists and the
      // webhook alone is enough to confirm it — nothing depends on this
      // tab staying open past this point.
      const createRes = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idempotencyKey, name, contact, notes, cart, shippingAddress }),
      });
      const paymentData = await createRes.json();
      if (!createRes.ok) {
        if (paymentData.requiresAuth) {
          router.push("/login?redirect=/checkout");
          return;
        }
        const e: any = new Error(paymentData.error || "Payment initialization failed");
        e.unavailable = paymentData.unavailable;
        throw e;
      }

      // A retried request can land after the webhook already confirmed
      // this exact checkout attempt — go straight to the success screen
      // instead of trying to reopen a payment sheet for a paid order.
      if (paymentData.alreadyConfirmed) {
        finalizeSuccess(paymentData.reference, paymentData.total, "ONLINE");
        return;
      }

      const options = {
        key: paymentData.key,
        amount: paymentData.amount,
        currency: "INR",
        name: "GoldenWeft",
        description: "Handwoven Bhagalpuri Silk",
        order_id: paymentData.razorpayOrderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              setErrorMessage(
                verifyData.error ||
                  "We received your payment but couldn't confirm it automatically. Don't worry — our team will verify it shortly, or contact us with your payment ID."
              );
              setIsProcessing(false);
              return;
            }
            finalizeSuccess(verifyData.order.reference, verifyData.order.total, "ONLINE");
          } catch {
            setErrorMessage(
              "Your payment succeeded, but we couldn't confirm it here due to a connection issue. Please contact us with your payment ID — you have not been charged twice."
            );
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setErrorMessage("Payment cancelled. You can try again whenever you're ready.");
            setIsProcessing(false);
          },
        },
        prefill: {
          name,
          contact: shippingAddress.phone,
          ...(contact.includes("@") ? { email: contact } : {}),
        },
        theme: { color: "#B8912F" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        setErrorMessage("Payment failed: " + (response?.error?.description || "please try again."));
        setIsProcessing(false);
      });
      rzp.open();
    } catch (err: any) {
      if (err?.unavailable?.length) {
        setErrorMessage(
          `${err.message} ${err.unavailable.map((u: any) => `${u.name} (only ${u.available} left)`).join(", ")}`
        );
      } else {
        setErrorMessage(err.message || "Something went wrong. Please try again.");
      }
      setIsProcessing(false);
    } finally {
      if (paymentMethod === "COD") setIsProcessing(false);
    }
  }

  if (cart.length === 0 && !submitted && !isCartLocked()) {
    return (
      <div className="min-h-screen bg-[var(--color-ivory)] flex items-center justify-center">
        <div className="text-center max-w-sm">
          <h1 className="font-serif text-[2.5rem] text-[var(--color-charcoal)] mb-4">Checkout</h1>
          <p className="text-[var(--ink-mid)] mb-8">Your cart is empty.</p>
          <Link href="/collections" className="btn-ghost">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    const whatsappMessage = buildWhatsAppMessage(orderRef, customerName, cart, submittedPaymentMethod);
    return (
      <div className="min-h-screen bg-[var(--color-ivory)] flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center">
          <div className="w-16 h-16 mx-auto mb-8 bg-[var(--color-gold)] rounded-full flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-[1px] w-8 bg-[var(--color-gold)]" />
            <span className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-gold)]">Order Confirmed</span>
            <div className="h-[1px] w-8 bg-[var(--color-gold)]" />
          </div>

          <h1 className="font-serif text-[2.8rem] text-[var(--color-charcoal)] mb-8">
            Thank you for your order.
          </h1>

          <div className="bg-white border border-[var(--color-border)] p-8 mb-8 text-left">
            <p className="text-[0.6rem] tracking-[0.22em] uppercase text-[var(--ink-muted)] mb-2">Order Reference</p>
            <p className="font-serif text-[1.5rem] text-[var(--color-charcoal)] mb-6">{orderRef}</p>

            {submittedPaymentMethod === "COD" && (
              <div className="mb-6 px-4 py-3 bg-[var(--color-ivory-deep)] border border-[var(--color-border)] text-[0.78rem] text-[var(--ink-mid)]">
                Pay <span className="font-medium text-[var(--color-charcoal)]">₹{confirmedTotal.toLocaleString("en-IN")}</span> in cash when your order is delivered.
              </div>
            )}

            <div className="border-t border-[var(--color-border)] pt-5 space-y-3">
              {cart.map((item) => (
                <div key={item.productId} className="flex items-center gap-3 text-[0.82rem] text-[var(--ink-mid)]">
                  {item.image ? (
                    <div className="w-10 h-10 flex-shrink-0 relative border border-[var(--color-border)] overflow-hidden">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="40px" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 flex-shrink-0 bg-[var(--color-ivory-deep)] border border-[var(--color-border)]" />
                  )}
                  <span className="flex-1 truncate">{item.name} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-[var(--color-border)] mt-5 pt-5 flex justify-between items-baseline">
              <span className="text-[0.72rem] tracking-[0.12em] uppercase text-[var(--ink-mid)]">Total</span>
              <span className="font-serif text-[1.3rem] text-[var(--color-charcoal)]">₹{confirmedTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <p className="text-[0.78rem] text-[var(--ink-mid)] mb-6">
            We've sent a confirmation to your email if you provided one. You can track this order any time from{" "}
            <Link href="/account" className="underline hover:text-[var(--color-charcoal)]">My Orders</Link>.
          </p>

          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-luxury inline-flex items-center gap-3 px-8 py-4 bg-[#25D366] text-white text-[0.775rem] mb-4 hover:bg-[#20b858]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Confirm on WhatsApp
          </a>

          <div>
            <Link href="/" className="text-[0.75rem] tracking-[0.12em] uppercase text-[var(--ink-mid)] hover:opacity-60 transition-colors duration-300">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-ivory)]">
      <div className="border-b border-[var(--color-border)] bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-4 flex items-center gap-3 text-[0.72rem] tracking-[0.1em] uppercase text-[var(--ink-mid)]">
          <Link href="/" className="hover:opacity-60 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/cart" className="hover:opacity-60 transition-colors">Cart</Link>
          <span>/</span>
          <span className="text-[var(--color-charcoal)]">Checkout</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-16">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-[1px] w-8 bg-[var(--color-gold)]" />
          <h1 className="font-serif text-[2.5rem] text-[var(--color-charcoal)]">Checkout</h1>
        </div>

        {errorMessage && (
          <div className="mb-8 px-5 py-4 bg-[#fef2f2] border border-[#fecaca] text-[0.82rem] text-[#991b1b]">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-5">
              <h2 className="font-serif text-[1.2rem] text-[var(--color-charcoal)]">Your Details</h2>
              <input name="name" required minLength={2} defaultValue={userName} placeholder="Full name" className={inputClass} />
              <input name="contact" required minLength={5} defaultValue={userEmail} placeholder="Email or phone number" className={inputClass} />
            </div>

            <div className="space-y-5">
              <h2 className="font-serif text-[1.2rem] text-[var(--color-charcoal)]">Delivery Address</h2>
              <input name="phone" required defaultValue={userPhone} placeholder="Phone number for delivery" className={inputClass} />
              <input name="line1" required placeholder="Address line 1 (house no., street)" className={inputClass} />
              <input name="line2" placeholder="Address line 2 (optional)" className={inputClass} />
              <input name="landmark" placeholder="Landmark (optional)" className={inputClass} />
              <div className="grid grid-cols-2 gap-4">
                <input name="city" required placeholder="City" className={inputClass} />
                <input name="state" required placeholder="State" className={inputClass} />
              </div>
              <input
                name="postalCode"
                required
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                placeholder="6-digit PIN code"
                className={`${inputClass} max-w-[200px]`}
              />
              <textarea name="notes" placeholder="Delivery notes (optional)" className={`${inputClass} h-24 resize-none`} />
            </div>

            <div className="pt-2">
              <p className={labelClass}>Payment Method</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("ONLINE")}
                  className={`border px-4 py-3.5 text-left text-[0.82rem] transition-colors duration-200 ${
                    paymentMethod === "ONLINE"
                      ? "border-[var(--ink)] bg-[var(--paper)]"
                      : "border-[var(--color-border)] text-[var(--ink-mid)]"
                  }`}
                >
                  <span className="block font-medium text-[var(--color-charcoal)]">Pay Online</span>
                  <span className="block text-[0.7rem] text-[var(--ink-mid)] mt-0.5">UPI, Cards, Netbanking</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("COD")}
                  className={`border px-4 py-3.5 text-left text-[0.82rem] transition-colors duration-200 ${
                    paymentMethod === "COD"
                      ? "border-[var(--ink)] bg-[var(--paper)]"
                      : "border-[var(--color-border)] text-[var(--ink-mid)]"
                  }`}
                >
                  <span className="block font-medium text-[var(--color-charcoal)]">Cash on Delivery</span>
                  <span className="block text-[0.7rem] text-[var(--ink-mid)] mt-0.5">Pay when it arrives</span>
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isProcessing}
                className="btn-primary w-full justify-center py-4 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isProcessing
                  ? "Processing..."
                  : paymentMethod === "COD"
                  ? "Place Order (Cash on Delivery)"
                  : "Pay & Place Order"}
              </button>
              <p className="text-center text-[0.7rem] text-[var(--ink-mid)] mt-3">
                {paymentMethod === "COD"
                  ? "Pay with cash when your order is delivered"
                  : "Secured by Razorpay · Your data is safe"}
              </p>
            </div>
          </form>

          {/* Summary */}
          <div>
            <h2 className="font-serif text-[1.2rem] text-[var(--color-charcoal)] mb-6">Order Summary</h2>
            <div className="bg-white border border-[var(--color-border)] p-8">
              <div className="space-y-3 mb-6 pb-6 border-b border-[var(--color-border)]">
                {cart.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3 text-[0.82rem] text-[var(--ink-mid)]">
                    {item.image ? (
                      <div className="w-10 h-10 flex-shrink-0 relative border border-[var(--color-border)] overflow-hidden">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="40px" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 flex-shrink-0 bg-[var(--color-ivory-deep)] border border-[var(--color-border)]" />
                    )}
                    <span className="flex-1 truncate">{item.name} × {item.quantity}</span>
                    <span className="font-medium text-[var(--color-charcoal)]">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[0.72rem] tracking-[0.12em] uppercase text-[var(--ink-mid)]">Total</span>
                <span className="font-serif text-[1.5rem] text-[var(--color-charcoal)]">₹{displayTotal.toLocaleString("en-IN")}</span>
              </div>
              <p className="text-[0.68rem] text-[var(--ink-muted)] mt-4">
                Final pricing and availability are confirmed securely at checkout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
