# playwright-api-listener

Playwright helper to declaratively listen and validate REST API requests in E2E tests.

## Installation

```bash
npm install playwright-api-listener
```

## Usage

```typescript
import { listenRequest } from "playwright-api-listener";

const requestListener = listenRequest(page, {
  endpoint: "/api/vehicles",
  method: "GET",
  queryParams: { status: "active", limit: 50 },
  expectedStatus: 200,
  validateBody: (body) => {
    if (!Array.isArray(body.items)) {
      throw new Error("Expected items array in response");
    }
  },
});

await page.goto("/vehicles");

const { body, url, response } = await requestListener;
```

## API

### `listenRequest(page, options)`

| Option           | Type          | Required | Default | Description                                           |
| ---------------- | ------------- | -------- | ------- | ----------------------------------------------------- |
| `endpoint`       | `string`      | ✅       | —       | URL fragment to match                                 |
| `method`         | `HttpMethod`  | ❌       | —       | The HTTP method to match (e.g., 'GET', 'POST', 'PUT') |
| `queryParams`    | `QueryParams` | ❌       | `{}`    | Query params to exact match                           |
| `expectedStatus` | `number`      | ❌       | `200`   | Expected HTTP status code                             |
| `timeout`        | `number`      | ❌       | `10000` | Timeout in ms                                         |
| `validateBody`   | `function`    | ❌       | —       | Callback to assert response body                      |

### `listenMultipleRequests(page, requests[])`

Listens to multiple REST API requests simultaneously. Useful for page loads that trigger several concurrent requests.
