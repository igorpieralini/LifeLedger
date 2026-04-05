/**
 * LifeLedger — Input/Output Sanitizer
 *
 * Previne XSS, SQL injection, HTML injection, e outros ataques
 * aplicando sanitização em TODOS os dados de entrada e saída.
 */

// Padrões perigosos que nunca devem chegar ao backend
const DANGEROUS_PATTERNS: RegExp[] = [
  // Script injection
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript\s*:/gi,
  /on\w+\s*=\s*["'][^"']*["']/gi,       // onclick=, onerror=, etc.
  /on\w+\s*=/gi,

  // HTML injection
  /<iframe\b[^>]*>/gi,
  /<object\b[^>]*>/gi,
  /<embed\b[^>]*>/gi,
  /<form\b[^>]*>/gi,
  /<link\b[^>]*>/gi,
  /<meta\b[^>]*>/gi,
  /<base\b[^>]*>/gi,

  // Data URIs perigosos
  /data\s*:\s*text\/html/gi,
  /data\s*:\s*application\/xhtml/gi,

  // SQL injection patterns
  /('\s*(OR|AND)\s+')/gi,
  /(;\s*(DROP|DELETE|INSERT|UPDATE|ALTER|CREATE|EXEC)\s)/gi,
  /(UNION\s+(ALL\s+)?SELECT)/gi,
  /(--\s)/g,

  // Path traversal
  /\.\.\//g,
  /\.\.%2[fF]/g,

  // Template injection
  /\$\{[^}]*\}/g,
  /\{\{[^}]*\}\}/g,
];

// Entidades HTML para escape
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#96;',
};

const HTML_ENTITY_REGEX = /[&<>"'`/]/g;

/**
 * Escapa caracteres HTML perigosos.
 */
export function escapeHtml(value: string): string {
  return value.replace(HTML_ENTITY_REGEX, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Remove padrões perigosos de uma string.
 */
export function stripDangerousPatterns(value: string): string {
  let clean = value;
  for (const pattern of DANGEROUS_PATTERNS) {
    clean = clean.replace(pattern, '');
  }
  return clean.trim();
}

/**
 * Sanitiza uma string: remove padrões perigosos e escapa HTML.
 * Usado para dados ENVIADOS ao backend (requests).
 */
export function sanitizeString(value: string): string {
  if (!value || typeof value !== 'string') return value;
  return escapeHtml(stripDangerousPatterns(value));
}

/**
 * Sanitiza uma string sem escaping HTML.
 * Usado para dados RECEBIDOS do backend (responses).
 * Apenas remove padrões perigosos — o Angular já faz auto-escaping no template.
 */
export function sanitizeStringResponse(value: string): string {
  if (!value || typeof value !== 'string') return value;
  return stripDangerousPatterns(value);
}

/**
 * Sanitiza recursivamente um objeto para responses (sem HTML escaping).
 * Apenas remove padrões perigosos — Angular já faz auto-escaping.
 */
export function sanitizeResponseValue(value: unknown): unknown {
  if (value === null || value === undefined) return value;

  if (typeof value === 'string') {
    return sanitizeStringResponse(value);
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeResponseValue);
  }

  if (typeof value === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      sanitized[key] = sanitizeResponseValue(val);
    }
    return sanitized;
  }

  return value;
}

/**
 * Sanitiza recursivamente um objeto (request body).
 * Strings são sanitizadas, outros tipos passam intactos.
 */
export function sanitizeValue(value: unknown): unknown {
  if (value === null || value === undefined) return value;

  if (typeof value === 'string') {
    return sanitizeString(value);
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (typeof value === 'object' && !(value instanceof File) && !(value instanceof Blob) && !(value instanceof FormData)) {
    const sanitized: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      const cleanKey = sanitizeString(key);
      sanitized[cleanKey] = sanitizeValue(val);
    }
    return sanitized;
  }

  // Numbers, booleans, Files, Blobs, FormData — pass through
  return value;
}

/**
 * Verifica se uma string contém padrões perigosos (sem alterar).
 * Retorna true se encontrou ameaça.
 */
export function hasDangerousContent(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  return DANGEROUS_PATTERNS.some((pattern) => {
    pattern.lastIndex = 0; // reset global regex
    return pattern.test(value);
  });
}

/**
 * Valida um email de forma segura.
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email);
}

/**
 * Limita o tamanho de uma string.
 */
export function truncate(value: string, maxLength: number): string {
  if (!value) return value;
  return value.length > maxLength ? value.substring(0, maxLength) : value;
}
