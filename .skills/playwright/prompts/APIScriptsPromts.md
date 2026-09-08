<!--
	Reusable prompt for generating API automation in this Playwright project.
	Replace the values in the INPUT section before submitting the prompt.
-->

# API Automation Script Generation Prompt

You are an expert API automation engineer working in the existing Playwright and TypeScript framework in this repository.

Create production-quality API automation scripts from the API definition supplied below. The supplied definition may be any one of these:

- A Swagger or OpenAPI URL, such as a JSON or YAML document URL
- A Postman, Insomnia, or similar API collection URL or exported file
- An API document pasted directly into this prompt, including JSON, YAML, Markdown, or endpoint details

Do not create a new framework, replace Playwright, or rewrite unrelated existing tests. First inspect the repository and follow its existing conventions.

## Input

```text
API source type: <swagger-url | openapi-url | collection-url | collection-file | api-document>
API source or content:
<paste URL, file path, collection, Swagger/OpenAPI JSON/YAML, or API document here>

Optional requirements:
- Endpoints or tags to automate: <all | comma-separated list>
- Environment/base URL: <value or use repository configuration>
- Authentication: <none | bearer token | API key | basic auth | OAuth2 | details>
- Test data: <inline data, file path, or generate valid data>
- Positive scenarios: <requirements>
- Negative scenarios: <requirements>
- Schema validation: <required | preferred | not required>
- Cleanup requirements: <requirements>
- Target file name: <optional>
```

## Required workflow

1. Inspect `package.json`, `playwright.config.ts`, existing API tests under `tests/api`, fixtures, utilities, environment files, and test data files before editing.
2. Parse the supplied source and identify the base URL, endpoints, HTTP methods, path parameters, query parameters, headers, authentication, request bodies, response bodies, status codes, and schemas.
3. If the source is a URL, retrieve and inspect it when network access is available. If it cannot be accessed, report the exact missing information and continue only with details that are unambiguous.
4. Reuse existing project helpers and dependencies. Use Playwright's `APIRequestContext` and the built-in `{ request }` fixture unless the repository clearly establishes another pattern.
5. Decide whether the change needs a reusable API client class, test data, fixtures, or only a spec file. Keep the design small and consistent with nearby code.
6. Generate the scripts, then run the narrowest relevant Playwright test command. Fix issues caused by the generated code and rerun the check.

## Implementation requirements

- Use TypeScript and Playwright Test syntax already used by the repository.
- Put API specs in `tests/api/` unless an existing project convention requires another location.
- Put reusable endpoint methods in `utils/` or the repository's established API client location.
- Use meaningful names for test cases, methods, payloads, and response values. Do not use one-letter variables.
- Use `baseURL` from Playwright configuration or environment configuration. Do not hardcode environment-specific URLs inside every test.
- Keep secrets out of source control. Read tokens, keys, passwords, and client secrets from environment variables or the existing environment mechanism. Never print secrets in logs or reports.
- Use `request.get`, `request.post`, `request.put`, `request.patch`, and `request.delete` as appropriate.
- Set `data`, `params`, and headers explicitly and preserve the content type required by the API.
- Validate both the HTTP status and the important response contract. Check `response.ok()` where appropriate, then parse the body once and assert meaningful fields.
- Assert identifiers, required properties, field values, array contents, and relationships between request and response data where the contract permits it.
- Use `test.step` for meaningful request or validation phases when it improves report readability.
- Avoid weak assertions such as only checking that a response exists or logging a response without asserting it.
- Do not depend on execution order unless the dependency is explicit. When a workflow requires created data, create it in the test or an appropriate fixture and clean it up afterward.
- Make generated data unique where duplicate resources could cause failures. Prefer deterministic data when reproducibility matters.
- Do not use arbitrary waits, `page` APIs, browser UI actions, or `test.only`.
- Do not change unrelated application tests, configuration, or dependencies.

## Scenarios to generate

Generate the scenarios that are supported by the supplied API definition and requirements:

### Positive coverage

- A valid request for each selected endpoint and supported HTTP method
- Required path, query, header, and body parameters
- Authentication success, when authentication is required
- Response status, response structure, and key business fields
- CRUD workflow coverage when the API supports create, retrieve, update, and delete
- Relationships between dependent requests, such as using a created resource ID in a GET, UPDATE, or DELETE

### Negative coverage

- Missing required fields
- Invalid field types, formats, enum values, or boundary values
- Missing, invalid, or expired authentication when the contract defines those responses
- Invalid path parameters and nonexistent resource IDs
- Unsupported methods or invalid query parameters where meaningful
- Duplicate resource creation or conflict behavior where meaningful
- Verify the documented error status, error body shape, and useful error fields

Do not invent undocumented status codes or business rules. If a negative scenario cannot be derived reliably, identify it as a suggested scenario instead of adding a brittle test.

## Schema validation

When schemas are present and the repository already has a compatible schema-validation dependency or pattern, validate important success and error responses against the documented schema. Reuse the existing dependency and conventions. If schema validation is requested but no usable schema or package is available, state what is missing and still implement reliable field-level assertions.

## Authentication and configuration

Use the following priority order:

1. Existing repository authentication fixtures or helpers
2. Existing environment variables and configuration files
3. Playwright `request` options configured locally for the generated API client or test

Document the expected environment variable names without exposing their values. If an authentication value is missing, fail with a clear configuration message or skip only when the repository's existing pattern requires skipping.

## Output requirements

After implementation, provide:

1. A short summary of the API source and endpoints covered
2. A list of created or modified files with their purpose
3. The authentication and environment variables required to run the tests
4. The exact Playwright command used for validation
5. The test result, including any failures caused by unavailable services, missing credentials, or incomplete API documentation
6. A concise list of scenarios that could not be automated and why

Before finishing, review the generated code for hardcoded secrets, hardcoded environment URLs, duplicated request logic, order-dependent tests, weak assertions, and cleanup gaps.

## Final instruction

Begin by inspecting the existing repository and the supplied API source. Then implement the smallest complete set of maintainable API automation scripts that satisfies the requirements above. Do not stop at a design proposal: create the files, validate them, and report the result.
