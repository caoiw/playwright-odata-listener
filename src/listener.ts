import { Page } from "@playwright/test";
import { RequestListenerOptions, RequestListenerResult } from "./types";
import { matchesQueryParams, buildErrorMessage } from "./utils";

export async function listenRequest(
  pPage: Page,
  pOptions: RequestListenerOptions,
): Promise<RequestListenerResult> {
  const {
    endpoint: pEndpoint,
    method: pMethod,
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

      if (pMethod && pResponse.request().method() !== pMethod) {
        return false;
      }

      if (xHasQueryParams && !matchesQueryParams(xUrl, pQueryParams))
        return false;

      return true;
    },
    { timeout: pTimeout },
  );

  const xActualStatus = xResponse.status();
  if (xActualStatus !== pExpectedStatus) {
    throw new Error(
      buildErrorMessage(
        `Returned HTTP ${xActualStatus}, expected ${pExpectedStatus}.`,
        pEndpoint,
        xResponse.url(),
      ),
    );
  }

  let xBody: Record<string, unknown> = {};

  if (xActualStatus !== 204) {
    try {
      xBody = await xResponse.json();
    } catch {
      throw new Error(
        buildErrorMessage(
          "Response body is not valid JSON.",
          pEndpoint,
          xResponse.url(),
        ),
      );
    }
  }

  pValidateBody?.(xBody);

  return {
    response: xResponse,
    body: xBody,
    url: new URL(xResponse.url()),
  };
}

export async function listenMultipleRequests(
  pPage: Page,
  pRequests: RequestListenerOptions[],
): Promise<RequestListenerResult[]> {
  return Promise.all(pRequests.map((pOpts) => listenRequest(pPage, pOpts)));
}
