# services

## Security best practices

1. Embracing linter security rules
   The project eslint-plugin-security helps to identify potential security hotspots.

2. Disable the header X-Powered-By
   Your application won't show that was developed using Express.js, preventing to send this info to attackers.

3. Use environment variables to store SECRETS
   Very popular and good practice. We should use the package dotenv in order to use .env files in our application

4. Limit concurrent requests using a middleware: express-rate-limit
   From the NGINX blog:
   Rate limiting can be used for security purposes, for example to slow down brute‑force password‑guessing attacks. It can help protect against DDoS attacks by limiting the incoming request rate to a value typical for real users, and (with logging) identify the targeted URLs. More generally, it is used to protect upstream application servers from being overwhelmed by too many user requests at the same time.

5. Adjust the HTTP response headers for enhanced security
   Your application should be using secure headers to prevent attackers from using common attacks like cross-site scripting (XSS), clickjacking and other malicious attacks. These can be configured easily using modules like helmet.

6. Avoid using the Node.js crypto library for handling passwords, use Bcrypt
   We're using bcrypt.js for users passwords. This package offer an optimized implementation of Bcrypt for JavaScript and is widely trusted and used over the Internet.

7. OpenAPI-compliant Web API
   tsoa, A tool to compliant OpenAPI Web APIs using TypeScript and Node. We should generate swagger document in our application.
