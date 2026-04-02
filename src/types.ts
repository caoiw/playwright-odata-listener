import { Response } from "@playwright/test";

export type QueryParams = Record<string, string | number | boolean>;

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestListenerOptions {
  endpoint: string;
  method?: HttpMethod;
  queryParams?: QueryParams;
  expectedStatus?: number;
  timeout?: number;
  validateBody?: (pBody: Record<string, unknown>) => void;
}

export interface RequestListenerResult {
  response: Response;
  body: Record<string, unknown>;
  url: URL;
}
