import { Status, StatusGroup, StatusSet } from '@/types';

export const allStatuses: Status[] = [
  // 1XX
  { code: 100, message: 'Continue', isBasic: false },
  { code: 101, message: 'Switching Protocols', isBasic: false },
  { code: 102, message: 'Processing', isBasic: false },
  { code: 103, message: 'Early Hints', isBasic: false },
  // 2XX
  { code: 200, message: 'OK', isBasic: true },
  { code: 201, message: 'Created', isBasic: true },
  { code: 202, message: 'Accepted', isBasic: false },
  { code: 203, message: 'Non-Authoritative Information', isBasic: false },
  { code: 204, message: 'No Content', isBasic: false },
  { code: 205, message: 'Reset Content', isBasic: false },
  { code: 206, message: 'Partial Content', isBasic: false },
  { code: 207, message: 'Multi-Status', isBasic: false },
  { code: 208, message: 'Already Reported', isBasic: false },
  { code: 226, message: 'IM Used', isBasic: false },
  // 3XX
  { code: 300, message: 'Multiple Choice', isBasic: false },
  { code: 301, message: 'Moved Permanently', isBasic: true },
  { code: 302, message: 'Found', isBasic: false },
  { code: 303, message: 'See Other', isBasic: true },
  { code: 304, message: 'Not Modified', isBasic: false },
  { code: 307, message: 'Temporary Redirect', isBasic: false },
  { code: 308, message: 'Permanent Redirect', isBasic: false },
  // 4XX
  { code: 400, message: 'Bad Request', isBasic: true },
  { code: 401, message: 'Unauthorized', isBasic: true },
  { code: 402, message: 'Payment Required', isBasic: false },
  { code: 403, message: 'Forbidden', isBasic: false },
  { code: 404, message: 'Not Found', isBasic: true },
  { code: 405, message: 'Method Not Allowed', isBasic: false },
  { code: 406, message: 'Not Acceptable', isBasic: false },
  { code: 407, message: 'Proxy Authentication Required', isBasic: false },
  { code: 408, message: 'Request Timeout', isBasic: false },
  { code: 409, message: 'Conflict', isBasic: false },
  { code: 410, message: 'Gone', isBasic: false },
  { code: 411, message: 'Length Required', isBasic: false },
  { code: 412, message: 'Precondition Failed', isBasic: false },
  { code: 413, message: 'Payload Too Large', isBasic: false },
  { code: 414, message: 'URI Too Long', isBasic: false },
  { code: 415, message: 'Unsupported Media Type', isBasic: false },
  { code: 416, message: 'Range Not Satisfiable', isBasic: false },
  { code: 417, message: 'Expectation Failed', isBasic: false },
  { code: 418, message: "I'm a teapot", isBasic: false },
  { code: 421, message: 'Misdirected Request', isBasic: false },
  { code: 422, message: 'Unprocessable Entity', isBasic: false },
  { code: 423, message: 'Locked', isBasic: false },
  { code: 424, message: 'Failed Dependency', isBasic: false },
  { code: 425, message: 'Too Early', isBasic: false },
  { code: 426, message: 'Upgrade Required', isBasic: false },
  { code: 428, message: 'Precondition Required', isBasic: false },
  { code: 429, message: 'Too Many Requests', isBasic: false },
  { code: 431, message: 'Request Header Fields Too Large', isBasic: false },
  { code: 451, message: 'Unavailable For Legal Reasons', isBasic: false },
  // 5XX
  { code: 500, message: 'Internal Server Error', isBasic: true },
  { code: 501, message: 'Not Implemented', isBasic: false },
  { code: 502, message: 'Bad Gateway', isBasic: false },
  { code: 503, message: 'Service Unavailable', isBasic: true },
  { code: 504, message: 'Gateway Timeout', isBasic: false },
  { code: 505, message: 'HTTP Version Not Supported', isBasic: false },
  { code: 506, message: 'Variant Also Negotiates', isBasic: false },
  { code: 507, message: 'Insufficient Storage', isBasic: false },
  { code: 508, message: 'Loop Detected', isBasic: false },
  { code: 510, message: 'Not Extended', isBasic: false },
  { code: 511, message: 'Network Authentication Required', isBasic: false },
];

export const basicStatuses = allStatuses.filter((status) => status.isBasic);
export const unbasicStatuses = allStatuses.filter((status) => !status.isBasic);

export const basicStatusSet: StatusSet = {
  type: 'basic',
  statuses: basicStatuses,
};
export const unbasicStatusSet: StatusSet = {
  type: 'unbasic',
  statuses: unbasicStatuses,
};

export const groupedStatuses: { [K in StatusGroup]: Status[] } = {
  '1XX': allStatuses.filter((status) => Math.floor(status.code / 100) === 1),
  '2XX': allStatuses.filter((status) => Math.floor(status.code / 100) === 2),
  '3XX': allStatuses.filter((status) => Math.floor(status.code / 100) === 3),
  '4XX': allStatuses.filter((status) => Math.floor(status.code / 100) === 4),
  '5XX': allStatuses.filter((status) => Math.floor(status.code / 100) === 5),
};
export const statusGroupNames = Object.keys(groupedStatuses) as StatusGroup[];
