import { ODataQueryParams } from './types';

/**
 * Checks if a URL contains the expected OData query params.
 */
export function matchesODataParams(
  pUrl: URL,
  pQueryParams: ODataQueryParams
): boolean {
  for (const [xKey, xExpected] of Object.entries(pQueryParams)) {
    const xActual = pUrl.searchParams.get(xKey);

    if (xActual === null) return false;

    const xIsExactMatch = xKey === '$top' || xKey === '$skip' || xKey === '$count';

    if (xIsExactMatch) {
      if (xActual !== String(xExpected)) return false;
    } else {
      if (!xActual.includes(String(xExpected))) return false;
    }
  }

  return true;
}

/**
 * Builds a default error message for the listener.
 */
export function buildErrorMessage(
  pContext: string,
  pEndpoint: string,
  pUrl: string
): string {
  return (
    `[ODataListener] ${pContext}\n` +
    `Endpoint: "${pEndpoint}"\n` +
    `URL capturada: ${pUrl}`
  );
}
