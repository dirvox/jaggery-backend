// utils/emailHelpers.js
export const validateEmail = (email) => {
  if (!email) return false;
  const e = String(email).trim();
  // simple but decent regex
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(e);
};

export const validateAndCleanEmails = (input) => {
  // Accept either string or array
  let arr = [];
  if (Array.isArray(input)) {
    arr = input.flatMap((x) => (typeof x === "string" ? x.split(",") : []));
  } else if (typeof input === "string") {
    // split by comma, semicolon, newline
    arr = input.split(/[,;\n\r]+/);
  } else {
    return [];
  }

  const cleaned = arr
    .map((s) => (s ? s.trim().replace(/\s+/g, "") : ""))
    .filter((s) => s.length > 0 && validateEmail(s));

  // dedupe while preserving order
  const seen = new Set();
  const unique = [];
  for (const mail of cleaned) {
    if (!seen.has(mail.toLowerCase())) {
      seen.add(mail.toLowerCase());
      unique.push(mail);
    }
  }
  return unique;
};
