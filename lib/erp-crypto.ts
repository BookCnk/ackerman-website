import crypto from "crypto";

const DEFAULT_BRIDGE_SECRET = "ack_bridge_sec_8f93e2714a60b94c398e0a12";

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export function getBridgeSecret(): string {
  const secret = (process.env.ERP_BRIDGE_SECRET || process.env.ERP_WEBHOOK_SECRET || "").trim();
  if (isProduction()) {
    if (!secret || secret === DEFAULT_BRIDGE_SECRET || secret.length < 24) {
      throw new Error(
        "ERP_BRIDGE_SECRET must be set to a strong non-default secret (>= 24 chars) in production"
      );
    }
    return secret;
  }
  return secret || DEFAULT_BRIDGE_SECRET;
}

/**
 * Creates X-Ackermann-Timestamp and X-Ackermann-Signature headers for outgoing requests to ERP.
 */
export function createErpSignatureHeaders(rawBody: string = ""): {
  "X-Ackermann-Timestamp": string;
  "X-Ackermann-Signature": string;
} {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const secret = getBridgeSecret();
  const message = `${timestamp}.${rawBody}`;
  const signature = crypto.createHmac("sha256", secret).update(message).digest("hex");

  return {
    "X-Ackermann-Timestamp": timestamp,
    "X-Ackermann-Signature": signature,
  };
}

/**
 * Verifies an incoming webhook request from ERP using HMAC-SHA256 and 5-minute replay prevention.
 */
export function verifyErpSignature(
  rawBody: string,
  timestampHeader: string | null,
  signatureHeader: string | null
): { valid: boolean; reason?: string } {
  if (!timestampHeader || !signatureHeader) {
    return { valid: false, reason: "Missing signature or timestamp headers" };
  }

  const ts = parseInt(timestampHeader, 10);
  if (isNaN(ts)) {
    return { valid: false, reason: "Invalid timestamp format" };
  }

  const currentTs = Math.floor(Date.now() / 1000);
  if (Math.abs(currentTs - ts) > 300) {
    return { valid: false, reason: "Timestamp expired or skewed beyond 300 seconds" };
  }

  let secret: string;
  try {
    secret = getBridgeSecret();
  } catch (err) {
    return { valid: false, reason: err instanceof Error ? err.message : "Bridge secret misconfigured" };
  }

  const message = `${timestampHeader}.${rawBody}`;
  const expectedSig = crypto.createHmac("sha256", secret).update(message).digest("hex");

  try {
    const sigBuf = Buffer.from(signatureHeader.toLowerCase());
    const expBuf = Buffer.from(expectedSig.toLowerCase());
    if (sigBuf.length !== expBuf.length) {
      return { valid: false, reason: "Signature mismatch" };
    }
    const valid = crypto.timingSafeEqual(sigBuf, expBuf);
    return { valid, reason: valid ? undefined : "Signature mismatch" };
  } catch {
    return { valid: false, reason: "Signature buffer comparison error" };
  }
}

/**
 * Authorizes internal outbox endpoints (/api/erp/outbox) using either:
 *  1) Valid ERP HMAC headers (X-Ackermann-Timestamp + X-Ackermann-Signature), OR
 *  2) Valid Bearer CRON_SECRET header (for Vercel Cron / VPS Cron).
 */
export function verifyCronOrErpAuth(
  request: Request,
  rawBody: string = ""
): { valid: boolean; authType?: "hmac" | "cron"; reason?: string } {
  const authHeader = request.headers.get("authorization") || "";
  const cronSecret = (process.env.CRON_SECRET || "").trim();
  if (cronSecret && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    try {
      const a = Buffer.from(token);
      const b = Buffer.from(cronSecret);
      if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
        return { valid: true, authType: "cron" };
      }
    } catch {
      // fall through to HMAC check
    }
  }

  const timestamp = request.headers.get("X-Ackermann-Timestamp");
  const signature = request.headers.get("X-Ackermann-Signature");
  const hmacCheck = verifyErpSignature(rawBody, timestamp, signature);
  if (hmacCheck.valid) {
    return { valid: true, authType: "hmac" };
  }

  return {
    valid: false,
    reason: hmacCheck.reason || "Unauthorized: valid ERP HMAC signature or CRON_SECRET Bearer token required",
  };
}

/**
 * Verifies an incoming Payment Gateway webhook signature (HMAC-SHA256 hex of rawBody).
 */
export function verifyPaymentGatewaySignature(
  rawBody: string,
  signatureHeader: string | null
): { valid: boolean; reason?: string } {
  const secret = (process.env.PAYMENT_GATEWAY_WEBHOOK_SECRET || "").trim();
  if (!secret) {
    return { valid: false, reason: "PAYMENT_GATEWAY_WEBHOOK_SECRET is not configured" };
  }
  if (!signatureHeader) {
    return { valid: false, reason: "Missing X-Payment-Webhook-Signature header" };
  }

  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  try {
    const a = Buffer.from(signatureHeader.trim().toLowerCase());
    const b = Buffer.from(expected.toLowerCase());
    if (a.length !== b.length) {
      return { valid: false, reason: "Payment webhook signature mismatch" };
    }
    const valid = crypto.timingSafeEqual(a, b);
    return { valid, reason: valid ? undefined : "Payment webhook signature mismatch" };
  } catch {
    return { valid: false, reason: "Payment signature verification error" };
  }
}
