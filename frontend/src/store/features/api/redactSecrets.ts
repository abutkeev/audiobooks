// hash is the telegram login signature: leaked, it logs in on its own
const secretName = /password|token|secret|hash/i;

const redacted = '[redacted]';

/**
 * Arguments of a failed request travel to the server log as they are, and a failed login
 * carries the credentials among them.
 */
const redactSecrets = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(redactSecrets);
  // anything else than a plain object keeps whatever JSON.stringify makes of it: walking a Date
  // or a Blob with Object.entries would turn it into an empty object
  if (!value || Object.getPrototypeOf(value) !== Object.prototype) return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, secretName.test(key) ? redacted : redactSecrets(item)])
  );
};

export default redactSecrets;
