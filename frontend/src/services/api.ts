// Fetch data from the API and return it as a Promise of unknown type.
export async function fetchApiData(path: string): Promise<unknown> {
  const response = await fetch(path)

  if (!response.ok) {
    throw new Error(`Request failed: HTTP ${String(response.status)}`)
  }

  const data: unknown = await response.json()
  return data
}
