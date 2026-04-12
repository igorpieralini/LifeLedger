# Security Policy

## Project Status

LifeLedger is currently **in development** and not yet intended for production use.

## Security Architecture

- **Authentication**: Stateless JWT (HMAC-SHA256 / HS256). Tokens expire after 24 hours.
- **Passwords**: Stored as BCrypt hashes.
- **Rate limiting**: Applied via Bucket4j on API endpoints.
- **Transport**: HTTPS is expected to be enforced at the infrastructure level (reverse proxy / load balancer). The backend itself does not terminate TLS.
- **CORS**: Restricted to the configured allowed origin (default: `http://localhost:4200`).
- **Sessions**: None — `SessionCreationPolicy.STATELESS`.

## Known Limitations

- Authorization is not fully enforced in the current development build (`.anyRequest().permitAll()` is in place as a placeholder). All protected routes should be treated as **unauthenticated** until this is resolved.
- The JWT secret has a hard-coded development fallback. In any non-local environment the `LIFELEDGER_JWT_SECRET` environment variable **must** be set to a strong, randomly generated value.

## Reporting a Vulnerability

This project is not yet in production. If you find a security issue, please open a GitHub Issue or contact the maintainer directly via the repository. There is no bug bounty program at this time.
