export const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
  PUT: 'PUT',
  DELETE: 'DELETE',
  OPTION: 'OPTION',
};

export const defaultFetchOptions = {
  method: HttpMethod.GET,
  headers: { 'Content-Type': 'application/json' },
};
