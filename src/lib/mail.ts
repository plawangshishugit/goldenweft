import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // must be false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/** Minimal, ORM-agnostic shape every mail function needs from an order. */
export type MailableOrder = {
  reference: string;
  name: string;
  contact: string;
  total: number;
  paymentMethod: string;
  notes?: string | null;
  trackingNumber?: string | null;
  courierName?: string | null;
  cancelReason?: string | null;
  shippingAddress?: {
    fullName: string;
    phone: string;
    line1: string;
    line2?: string | null;
    landmark?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  } | null;
};

export type MailableItem = { name: string; price: number; quantity: number };

function isEmailAddress(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function formatAddress(addr: MailableOrder["shippingAddress"]): string {
  if (!addr) return "Not on file";
  return [
    addr.fullName,
    addr.line1,
    addr.line2,
    addr.landmark,
    `${addr.city}, ${addr.state} ${addr.postalCode}`,
    addr.country,
    `Phone: ${addr.phone}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function formatItems(items: MailableItem[]): string {
  return items.map((i) => `• ${i.name} × ${i.quantity} — ₹${(i.price * i.quantity).toLocaleString("en-IN")}`).join("\n");
}

/** Every send goes through here so a mail-provider outage never throws
 *  into order-processing code — it's logged and swallowed instead. */
async function safeSend(opts: { to: string; subject: string; text: string; from?: string }) {
  try {
    await transporter.sendMail({
      from: opts.from ?? `"GoldenWeft" <${process.env.EMAIL_USER}>`,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
    });
  } catch (err) {
    console.error(`✉️  Failed to send "${opts.subject}" to ${opts.to}:`, err);
  }
}

/* ============================================================
   Existing: business / wishlist inquiry email (unchanged)
============================================================ */
export async function sendInquiryEmail(data: {
  name: string;
  contact: string;
  message?: string;
  wishlist: any[];
}) {
  const wishlistText = data.wishlist.map((p) => `• ${p.name} (${p.fabric}, ${p.weight})`).join("\n");

  await safeSend({
    to: process.env.EMAIL_TO!,
    from: `"GoldenWeft Inquiry" <${process.env.EMAIL_USER}>`,
    subject: "New Silk Inquiry Received",
    text: `
New Inquiry Received

Name: ${data.name}
Contact: ${data.contact}

Message:
${data.message || "—"}

Wishlist:
${wishlistText || "No items"}

— GoldenWeft
    `,
  });
}

/* ============================================================
   Admin notifications
============================================================ */
export async function sendAdminNewOrderEmail(order: MailableOrder, items: MailableItem[]) {
  const to = process.env.BUSINESS_INQUIRY_RECEIVER_EMAIL;
  if (!to) return;

  await safeSend({
    to,
    from: `"GoldenWeft Orders" <${process.env.EMAIL_USER}>`,
    subject: `🧵 New Order — ${order.reference}${order.paymentMethod === "COD" ? " (COD)" : " (Paid Online)"}`,
    text: `
New order received on GoldenWeft

Order Reference: ${order.reference}
Payment Method: ${order.paymentMethod === "COD" ? `Cash on Delivery — collect ₹${order.total.toLocaleString("en-IN")} on delivery` : "Paid online via Razorpay"}

Customer:
${order.name}
${order.contact}

Ship to:
${formatAddress(order.shippingAddress)}

Items:
${formatItems(items)}

Total: ₹${order.total.toLocaleString("en-IN")}

Notes:
${order.notes || "—"}

Log in to the admin dashboard to process this order.
    `,
  });
}

export async function sendAdminAlertEmail(subject: string, message: string) {
  const to = process.env.BUSINESS_INQUIRY_RECEIVER_EMAIL || process.env.EMAIL_TO;
  if (!to) return;

  await safeSend({
    to,
    from: `"GoldenWeft Alerts" <${process.env.EMAIL_USER}>`,
    subject: `⚠️ ${subject}`,
    text: message,
  });
}

/* ============================================================
   Customer notifications — best-effort, skipped when `contact`
   isn't an email address (it may be a phone number).
============================================================ */
export async function sendCustomerOrderConfirmedEmail(order: MailableOrder, items: MailableItem[]) {
  if (!isEmailAddress(order.contact)) return;

  const paymentLine =
    order.paymentMethod === "COD"
      ? `Please keep ₹${order.total.toLocaleString("en-IN")} ready in cash for delivery.`
      : `Payment received — thank you.`;

  await safeSend({
    to: order.contact,
    subject: `Your GoldenWeft order is confirmed — ${order.reference}`,
    text: `
Hello ${order.name},

Thank you for your order! Here's a summary:

Order Reference: ${order.reference}
${paymentLine}

Items:
${formatItems(items)}

Total: ₹${order.total.toLocaleString("en-IN")}

Delivering to:
${formatAddress(order.shippingAddress)}

We'll email you again as soon as your order ships.

Warmly,
GoldenWeft
    `,
  });
}

export async function sendCustomerShippedEmail(order: MailableOrder) {
  if (!isEmailAddress(order.contact)) return;

  const trackingLine = order.trackingNumber
    ? `Tracking Number: ${order.trackingNumber}${order.courierName ? ` (${order.courierName})` : ""}`
    : `Your courier will contact you shortly before delivery.`;

  await safeSend({
    to: order.contact,
    subject: `Your GoldenWeft order has shipped — ${order.reference}`,
    text: `
Hello ${order.name},

Good news — your order is on its way.

Order Reference: ${order.reference}
${trackingLine}

Delivering to:
${formatAddress(order.shippingAddress)}

Warmly,
GoldenWeft
    `,
  });
}

export async function sendCustomerDeliveredEmail(order: MailableOrder) {
  if (!isEmailAddress(order.contact)) return;

  await safeSend({
    to: order.contact,
    subject: `Delivered — ${order.reference}`,
    text: `
Hello ${order.name},

Your GoldenWeft order (${order.reference}) has been marked as delivered. We hope you love it.

If anything isn't right, just reply to this email and we'll make it right.

Warmly,
GoldenWeft
    `,
  });
}

export async function sendCustomerCancelledEmail(order: MailableOrder) {
  if (!isEmailAddress(order.contact)) return;

  await safeSend({
    to: order.contact,
    subject: `Order cancelled — ${order.reference}`,
    text: `
Hello ${order.name},

Your order ${order.reference} has been cancelled.${order.cancelReason ? ` Reason: ${order.cancelReason}` : ""}
${order.paymentMethod === "ONLINE" ? "A refund has been initiated to your original payment method and should reflect within 5–7 business days." : ""}

If this wasn't expected, just reply to this email.

Warmly,
GoldenWeft
    `,
  });
}

export async function sendCustomerRefundedEmail(order: MailableOrder) {
  if (!isEmailAddress(order.contact)) return;

  await safeSend({
    to: order.contact,
    subject: `Refund processed — ${order.reference}`,
    text: `
Hello ${order.name},

We've processed a refund of ₹${order.total.toLocaleString("en-IN")} for order ${order.reference}.${order.cancelReason ? ` ${order.cancelReason}` : ""}

This should reflect in your original payment method within 5–7 business days, depending on your bank.

We're sorry for the inconvenience, and we'd love another chance — reply any time.

Warmly,
GoldenWeft
    `,
  });
}
