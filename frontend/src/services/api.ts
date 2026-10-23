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

// Fetch data from the API and return it as a Promise of unknown type.
export async function fetchApiData(path: string): Promise<unknown> {
  const response = await fetch(path)

  if (!response.ok) {
    throw new ApiError(response.status)
  }

  const data: unknown = await response.json()
  return data
}
