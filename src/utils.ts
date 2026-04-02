import { QueryParams } from "./types";

export function matchesQueryParams(
  pUrl: URL,
  pQueryParams: QueryParams,
): boolean {
  for (const [xKey, xExpected] of Object.entries(pQueryParams)) {
    const xActual = pUrl.searchParams.get(xKey);

    if (xActual === null) return false;

    if (xActual !== String(xExpected)) return false;
  }

  return true;
}

export function buildErrorMessage(
  pContext: string,
  pEndpoint: string,
  pUrl: string,
): string {
  return (
    `[PlaywrightListener] ${pContext}\n` +
    `Endpoint: "${pEndpoint}"\n` +
    `Captured URL: ${pUrl}`
  );
}
