export interface ErrorObj {
  error: string;
  statusCode: number;
  message: string | string[];
}

export interface ErrorMsg {
  success: boolean;
  timestamp: string;
  path: string;
  error: ErrorObj;
}
