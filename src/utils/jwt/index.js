import * as crypto from 'crypto';

/**
 * Converts an object to a base64 string
 * @param {object} obj - The object to convert
 * @returns {string} - A base64 string
 */
export function toBase64(obj) {
  const str = JSON.stringify(obj);
  return Buffer.from(str).toString('base64');
}

/** @readonly */
const str = {
  '=': '',
  '+': '-',
  '/': '_',
};

/**
 * Replace unfriendly url characters in a base64 string
 * @param {string} b64string - The base64 string to replace characters in
 * @returns {string} - A base64 string with replaced characters
 */
export function replaceSpecialChars(b64string) {
  return b64string.replace(
    /[=+/]/g,
    (charToBeReplaced) => str[charToBeReplaced],
  );
}

/**
 * Converts an object to a jwt base64 string
 * @param {object} obj - The object to convert
 * @returns {string} - A jwt base64 string
 */
export function toJwtB64(obj) {
  return replaceSpecialChars(toBase64(obj));
}

/**
 * Create a jwt signature
 * @param {string} jwtB64Header - The base64 header
 * @param {string} jwtB64Payload - The base64 payload
 * @param {string} secret - The secret to use for the signature
 */
export function createSignature(jwtB64Header, jwtB64Payload, secret) {
  let signature = crypto.createHmac('sha256', secret);
  signature.update(`${jwtB64Header}.${jwtB64Payload}`);
  signature = signature.digest('base64');
  signature = replaceSpecialChars(signature);
  return signature;
}

/**
 * Create a jwt with algorithm HS256
 * @param {object} optHeader - The header
 * @param {object} optPayload - The payload
 * @param {number?} expTime - The time in milliseconds the token should expire in
 * @param {string?} secret - The secret
 */
export function createJwt(optHeader, optPayload, expTime, secret) {
  const header = { ...optHeader, alg: 'HS256' };
  const iat = Date.now();
  if (!expTime) expTime = 5 * 60 * 1000; // 5 minutes
  const payload = { ...optPayload, iat, exp: iat + expTime };
  secret = secret || process.env.JWT_SECRET;
  return new Promise((resolve) => {
    const jwtB64Header = toJwtB64(header);
    const jwtB64Payload = toJwtB64(payload);
    const signature = createSignature(jwtB64Header, jwtB64Payload, secret);
    return resolve(`${jwtB64Header}.${jwtB64Payload}.${signature}`);
  });
}

/**
 * Verify a jwt with algorithm HS256
 * @param {string} jwt - The jwt to verify
 * @param {string?} secret - The secret
 */
export function verifyJwtSignature(jwt, secret) {
  secret = secret || process.env.JWT_SECRET;
  const [jwtB64Header, jwtB64Payload, signature] = jwt.split('.');
  const newSignature = createSignature(jwtB64Header, jwtB64Payload, secret);
  return newSignature === signature;
}

export function verifyJwtExpiration(jwt) {
  const [, jwtB64Payload] = jwt.split('.');
  const payload = JSON.parse(Buffer.from(jwtB64Payload, 'base64').toString());
  return payload.exp > Date.now();
}

export function verifyJwt(jwt, secret) {
  return verifyJwtSignature(jwt, secret) && verifyJwtExpiration(jwt);
}
