# Code Review Guidelines

## High-Risk Changes

### New Dependencies (Critical)
New package dependencies represent a **supply chain attack vector** and must be scrutinized:
- Verify the package is actively maintained and widely used
- Check for known vulnerabilities (npm audit, Snyk, etc.)
- Review the package's dependencies (transitive risk)
- Prefer well-established packages over newer alternatives
- Question whether the dependency is truly necessary or if the functionality can be implemented directly

### Outbound HTTP Requests (Important)
Non-same-origin HTTP requests should be carefully reviewed:
- Verify the target domain is trusted and expected
- Check that URLs are not constructed from user input without validation
- Ensure sensitive data is not leaked to third-party endpoints
- Review error handling to prevent information disclosure
- Consider whether the request should be proxied through our backend instead
