import BigNumber from 'bignumber.js'
import jawsMinterABI from 'config/abi/jawsMinter.json'
import multicall from 'utils/multicall'

export type MintRates = [string, string]

export const fetchMintRates = async (): Promise<MintRates> => {
  const calls = [
    // JAWS MINTER
    {
      address: '0x342afF01fe4781FC15eE6977C20cC55Ad8da3121',
      name: 'jawsPerProfitBNB',
    },
    {
      address: '0x342afF01fe4781FC15eE6977C20cC55Ad8da3121',
      name: 'PERFORMANCE_FEE',
    },
  ]

  const mintInfo = await multicall(jawsMinterABI, calls)

  return [new BigNumber(mintInfo?.[0]?.[0]._hex).toJSON(), new BigNumber(mintInfo?.[1]?.[0]._hex).toJSON()]
}
