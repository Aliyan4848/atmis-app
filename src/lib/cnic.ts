// CNIC pattern: 5 digits - 7 digits - 1 digit (standard NADRA format)
const CNIC_DISPLAY_RE = /\b\d{5}-\d{7}-\d{1}\b/g;
// also catch runs of exactly 13 digits (OCR sometimes drops hyphens)
const CNIC_DIGITS_RE = /\b\d{13}\b/g;

/** Strip everything but digits, so "12345-1234567-1" and "1234512345671" compare equal. */
export function normalizeCnic(value: string): string {
  return value.replace(/[^0-9]/g, "");
}

export function isValidCnicShape(digits: string): boolean {
  return /^\d{13}$/.test(digits);
}

/**
 * Scan raw OCR text for anything that looks like a CNIC. Returns normalized
 * (digits-only) candidates, most-likely-first (hyphenated matches are more
 * reliable than bare 13-digit runs, which risk false positives from other
 * document numbers).
 */
export function extractCnicCandidates(rawText: string): string[] {
  const candidates: string[] = [];

  const hyphenated = rawText.match(CNIC_DISPLAY_RE) ?? [];
  for (const m of hyphenated) candidates.push(normalizeCnic(m));

  const bareDigits = rawText.match(CNIC_DIGITS_RE) ?? [];
  for (const m of bareDigits) {
    const n = normalizeCnic(m);
    if (!candidates.includes(n)) candidates.push(n);
  }

  return candidates.filter(isValidCnicShape);
}

export type CnicCompareResult =
  | { result: "verified"; matched: string }
  | { result: "mismatch"; extracted: string[] }
  | { result: "manual_review"; reason: string };

/** Compare a user-entered CNIC against candidates extracted from a document. */
export function compareCnic(enteredCnic: string, rawOcrText: string): CnicCompareResult {
  const entered = normalizeCnic(enteredCnic);
  if (!isValidCnicShape(entered)) {
    return { result: "manual_review", reason: "The entered CNIC is not in a valid format." };
  }

  const candidates = extractCnicCandidates(rawOcrText);
  if (candidates.length === 0) {
    return { result: "manual_review", reason: "Could not reliably extract a CNIC number from this document." };
  }

  if (candidates.includes(entered)) {
    return { result: "verified", matched: entered };
  }

  return { result: "mismatch", extracted: candidates };
}

/** Format a normalized 13-digit CNIC back into the standard display form. */
export function formatCnic(digits: string): string {
  if (!isValidCnicShape(digits)) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
}
