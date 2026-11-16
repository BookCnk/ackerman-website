import crypto from "crypto";

const DEFAULT_BRIDGE_SECRET = "ack_bridge_sec_8f93e2714a60b94c398e0a12";

export function getBridgeSecret(): string {
  return process.env.ERP_BRIDGE_SECRET || process.env.ERP_WEBHOOK_SECRET || DEFAULT_BRIDGE_SECRET;
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

  const secret = getBridgeSecret();
  const message = `${timestampHeader}.${rawBody}`;
  const expectedSig = crypto.createHmac("sha256", secret).update(message).digest("hex");

  try {
    const valid = crypto.timingSafeEqual(
      Buffer.from(signatureHeader.toLowerCase()),
      Buffer.from(expectedSig.toLowerCase())
    );
    return { valid, reason: valid ? undefined : "Signature mismatch" };
  } catch {
    return { valid: false, reason: "Signature buffer comparison error" };
  }
}
