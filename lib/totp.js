import crypto from "crypto";

// Convert Base32 string to Buffer (RFC 4648)
function base32ToBuffer(base32) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  for (let i = 0; i < base32.length; i++) {
    const val = alphabet.indexOf(base32[i].toUpperCase());
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, "0");
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.substring(i, i + 8), 2));
  }
  return Buffer.from(bytes);
}

// Generate 6-digit TOTP code according to RFC 6238
export function generateTOTP(secret, timeStepSeconds = 30) {
  const counter = Math.floor(Date.now() / 1000 / timeStepSeconds);
  const buf = Buffer.alloc(8);
  buf.writeBigInt64BE(BigInt(counter));
  const key = base32ToBuffer(secret);
  const hmac = crypto.createHmac("sha1", key).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code = (hmac.readUInt32BE(offset) & 0x7fffffff) % 1000000;
  return code.toString().padStart(6, "0");
}

// Verify TOTP token with +/- 1 time step tolerance (30 seconds drift)
export function verifyTOTP(token, secret, window = 1) {
  if (!token || !secret) return false;
  const clean = token.toString().replace(/\s+/g, "").trim();

  const timeStepSeconds = 30;
  const currentCounter = Math.floor(Date.now() / 1000 / timeStepSeconds);
  const key = base32ToBuffer(secret);

  for (let i = -window; i <= window; i++) {
    const counter = currentCounter + i;
    const buf = Buffer.alloc(8);
    buf.writeBigInt64BE(BigInt(counter));
    const hmac = crypto.createHmac("sha1", key).update(buf).digest();
    const offset = hmac[hmac.length - 1] & 0x0f;
    const code = ((hmac.readUInt32BE(offset) & 0x7fffffff) % 1000000)
      .toString()
      .padStart(6, "0");
    if (code === clean) {
      return true;
    }
  }
  return false;
}

// Generate OTPAuth URI for QR code integration
export function getOTPAuthURL(email, secret, issuer = "JVM Medical Services") {
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedEmail = encodeURIComponent(email);
  return `otpauth://totp/${encodedIssuer}:${encodedEmail}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
}
