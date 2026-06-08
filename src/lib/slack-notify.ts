import type { Contact, ItemType, Request, RequestItem } from "@prisma/client";
import { after } from "next/server";

export type RequestCreatedForSlack = Request & {
  contact: Contact;
  items: Array<RequestItem & { itemType: ItemType }>;
};

function getAdminRequestsUrl(): string | null {
  const explicit = process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL;
  if (explicit?.trim()) {
    return `${explicit.replace(/\/$/, "")}/admin/requests`;
  }
  const vercel = process.env.VERCEL_URL;
  if (vercel?.trim()) {
    const host = vercel.replace(/^https?:\/\//, "");
    return `https://${host}/admin/requests`;
  }
  return null;
}

function buildItemSummary(
  items: RequestCreatedForSlack["items"]
): string {
  return items
    .map((row) => {
      const prefix = row.quantity > 1 ? `${row.quantity}× ` : "";
      const label = `${prefix}${row.itemType.name}`;
      const attrs = [row.size, row.gender].filter(Boolean).join(", ");
      return attrs ? `${label} (${attrs})` : label;
    })
    .map((line) => `  • ${line}`)
    .join("\n");
}

function buildMessage(request: RequestCreatedForSlack): string {
  const lines: string[] = [
    "*New clothing/gear request*",
    `• Name: ${request.contact.name}`,
    `• Phone: ${request.contact.phone}`,
  ];
  if (request.contact.email) {
    lines.push(`• Email: ${request.contact.email}`);
  }
  lines.push("• Items:", buildItemSummary(request.items));
  if (request.additionalInfo?.trim()) {
    lines.push(`• Notes: ${request.additionalInfo.trim()}`);
  }
  const adminUrl = getAdminRequestsUrl();
  if (adminUrl) {
    lines.push(`Open admin: ${adminUrl}`);
  }
  return lines.join("\n");
}

/**
 * POSTs to Slack Incoming Webhook. Never throws.
 */
export async function notifyNewRequestInSlack(
  request: RequestCreatedForSlack
): Promise<void> {
  const url = process.env.SLACK_WEBHOOK_URL?.trim();
  if (!url) {
    return;
  }

  const text = buildMessage(request);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(
        "[slack-notify] Slack webhook failed",
        res.status,
        body.slice(0, 500)
      );
    }
  } catch (err) {
    console.error("[slack-notify] Slack webhook error", err);
  }
}

/**
 * Prefer Next.js `after()` so Slack work runs after the response (serverless-safe).
 * Falls back to immediate fire-and-forget when `after` is unavailable (e.g. tests).
 */
export function scheduleNewRequestSlackNotification(
  request: RequestCreatedForSlack
): void {
  const run = () => {
    void notifyNewRequestInSlack(request).catch((err) => {
      console.error("[slack-notify] unexpected rejection", err);
    });
  };
  try {
    after(run);
  } catch {
    run();
  }
}
