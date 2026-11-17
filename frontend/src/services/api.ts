// Error thrown when an API request receives a non-success HTTP response.
// Stores the response status code for status-specific handling.
class ApiError extends Error {
  public readonly status: number // HTTP status code returned by the API

  constructor(status: number) {
    super(`Request failed: HTTP ${String(status)}`)
    this.name = 'ApiError'
    this.status = status
  }
}
// Returns a status-specific message for API errors,
// or the fallback for other errors.
export function getApiErrorMessage(
  error: unknown,
  fallbackMessage: string,
  statusMessages: Partial<Record<number, string>> = {}
): string {
  if (error instanceof ApiError) {
    return statusMessages[error.status] ?? fallbackMessage
  }

  return fallbackMessage
}

// Send an API request and return its JSON response, or undefined if there is no body.
export async function fetchApiData(
  path: string,
  options?: RequestInit
): Promise<unknown> {
  const response = await fetch(path, options)

  if (!response.ok) {
    throw new ApiError(response.status)
  }

  if (response.status === 204) {
    return undefined
  }

  const data: unknown = await response.json()
  return data
}
