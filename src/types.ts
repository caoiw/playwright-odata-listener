import { Response } from '@playwright/test';
import { URL } from 'url';

export interface ODataQueryParams {
  $filter?: string;
  $select?: string;
  $orderby?: string;
  $top?: number;
  $skip?: number;
  $expand?: string;
  $count?: boolean;
}

export interface ODataListenerOptions {
  endpoint: string;
  queryParams?: ODataQueryParams;
  expectedStatus?: number;
  timeout?: number;
  validateBody?: (pBody: Record<string, unknown>) => void;
}

export interface ODataListenerResult {
  response: Response;
  body: Record<string, unknown>;
  url: URL;
}
