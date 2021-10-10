import useSWR from 'swr'
// import { fetcher } from "../utils/fetcher";
export const fetcher = (url: string) => fetch(url).then((r) => r.json())

export const poster = (url: string, body: string) =>
  fetch(url, {
    method: 'POST',
    credentials: 'include',
    body,
  })

export default function useGetSingleTokenPrice(token: string) {
  const { data } = useSWR<{ priceUSD?: string }>(`https://api.dex.guru/v1/tokens/${token}-bsc`, fetcher)
  const priceLoading = !data
  const price = Number.parseFloat(data?.priceUSD ?? '0')
  return { priceLoading, price }
}
