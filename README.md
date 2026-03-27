# playwright-odata-listener

Playwright helper to listen and validate OData requests.

## Installation
```bash
npm install playwright-odata-listener
```

## Usage
```typescript
import { listenODataRequest } from 'playwright-odata-listener';

const xListener = listenODataRequest(page, {
  endpoint: '/api/vehicles',
  queryParams: { $filter: "Status eq 'Active'", $top: 50 },
  expectedStatus: 200,
});

await page.goto('/vehicles');

const { body, url } = await xListener;
```

## API

### `listenODataRequest(page, options)`

| Option | Type | Required | Default | Description |
|---|---|---|---|---|
| `endpoint` | `string` | ✅ | — | URL fragment to match |
| `queryParams` | `ODataQueryParams` | ❌ | `{}` | OData params to validate |
| `expectedStatus` | `number` | ❌ | `200` | Expected HTTP status |
| `timeout` | `number` | ❌ | `10000` | Timeout in ms |
| `validateBody` | `function` | ❌ | — | Callback to assert response body |

### `listenMultipleODataRequests(page, requests[])`

Listens to multiple OData requests simultaneously.