import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useProducts() {
  const { data, error, mutate } = useSWR('/api/products', fetcher)

  return {
    products: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}

export function useProduct(id: number) {
  const { data, error, mutate } = useSWR(`/api/products/${id}`, fetcher)

  return {
    product: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}

export async function createProduct(data: any) {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function updateProduct(id: number, data: any) {
  const response = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteProduct(id: number) {
  await fetch(`/api/products/${id}`, {
    method: 'DELETE',
  })
}