import { Page } from '@playwright/test';
import { ODataListenerOptions, ODataListenerResult } from './types';
import { matchesODataParams, buildErrorMessage } from './utils';

/**
 * Listens to a specific OData request during the navigation and
 * checks the query params and the response.
 *
 * IMPORTANT: always start the listener BEFORE the navigation.
 * The waitForResponse method needs to be registered before the request happens.
 *
 * @example
 * const xListener = listenODataRequest(page, {
 *   endpoint: '/odata/vehicles',
 *   queryParams: { $filter: "Status eq 'Active'", $top: 50 },
 *   expectedStatus: 200,
 * });
 * await page.goto('/vehicles');
 * const { body, url } = await xListener;
 */
export async function listenODataRequest(
  pPage: Page,
  pOptions: ODataListenerOptions
): Promise<ODataListenerResult> {
  const {
    endpoint: pEndpoint,
    queryParams: pQueryParams = {},
    expectedStatus: pExpectedStatus = 200,
    timeout: pTimeout = 10_000,
    validateBody: pValidateBody,
  } = pOptions;

  const xHasQueryParams = Object.keys(pQueryParams).length > 0;

  const xResponse = await pPage.waitForResponse(
    (pResponse) => {
      const xUrl = new URL(pResponse.url());

      const xEndpointMatch =
        xUrl.pathname.includes(pEndpoint) ||
        pResponse.url().includes(pEndpoint);

      if (!xEndpointMatch) return false;
      if (xHasQueryParams && !matchesODataParams(xUrl, pQueryParams)) return false;

      return true;
    },
    { timeout: pTimeout }
  );

  const xActualStatus = xResponse.status();
  if (xActualStatus !== pExpectedStatus) {
    throw new Error(
      buildErrorMessage(
        `Returned HTTP ${xActualStatus}, expected ${pExpectedStatus}.`,
        pEndpoint,
        xResponse.url()
      )
    );
  }

  let xBody: Record<string, unknown> = {};
  try {
    xBody = await xResponse.json();
  } catch {
    throw new Error(
      buildErrorMessage(
        'Response body is not valid JSON.',
        pEndpoint,
        xResponse.url()
      )
    );
  }

  pValidateBody?.(xBody);

  return {
    response: xResponse,
    body: xBody,
    url: new URL(xResponse.url()),
  };
}

/**
 * Listens to multiple OData requests simultaneously.
 * Useful for pages where multiple GET requests are triggered after navigation.
 *
 * @example
 * const [xVehicles, xRoutes] = await listenMultipleODataRequests(page, [
 *   { endpoint: '/odata/vehicles' },
 *   { endpoint: '/odata/routes', queryParams: { $filter: "Active eq true" } },
 * ]);
 */
export async function listenMultipleODataRequests(
  pPage: Page,
  pRequests: ODataListenerOptions[]
): Promise<ODataListenerResult[]> {
  return Promise.all(
    pRequests.map((pOpts) => listenODataRequest(pPage, pOpts))
  );
}
