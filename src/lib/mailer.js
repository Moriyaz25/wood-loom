import nodemailer from "nodemailer";

function transport() {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASSWORD
  )
    return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });
}

export async function sendMail({ to, subject, text, html, replyTo }) {
  const smtp = transport();
  if (!smtp) {
    console.warn("SMTP is not configured; email skipped");
    return { skipped: true };
  }
  return smtp.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
    replyTo,
  });
}

export async function sendOrderEmails(order, user) {
  const lines = order.items
    .map(
      (item) =>
        `${item.name} × ${item.quantity} — ₹${item.price * item.quantity}`,
    )
    .join("\n");
  await Promise.allSettled([
    sendMail({
      to: user.email,
      subject: `Checkout ${order.orderNumber} received`,
      text: `Hello ${user.name},\n\nWe saved your delivery details. Payment is pending and the order will be confirmed after payment is enabled and completed.\n\n${lines}\n\nTotal: ₹${order.total}\n\nReview the latest status from your account.`,
      html: `<div style="font-family:Arial;max-width:600px"><h1>Thank you, ${user.name}</h1><p>We saved checkout <strong>${order.orderNumber}</strong>.</p><pre>${lines}</pre><p><strong>Total: ₹${order.total}</strong></p><p>Payment is pending. Review the latest status from your account.</p></div>`,
    }),
    process.env.STORE_NOTIFICATION_EMAIL
      ? sendMail({
          to: process.env.STORE_NOTIFICATION_EMAIL,
          subject: `Pending-payment checkout ${order.orderNumber}`,
          text: `${user.email}\n${lines}\nTotal ₹${order.total}`,
        })
      : Promise.resolve(),
  ]);
}
