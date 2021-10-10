import { useEffect, useState, useCallback } from 'react'
import { AbiItem } from 'web3-utils'
import { getWeb3NoAccount } from 'utils/web3'
import UniV2LPABI from 'constants/abis/UniV2LP.json'
import BigNumber from 'bignumber.js'
import useBlock from './useBlock'

const web3 = getWeb3NoAccount()
const MaticUSDTPairAddress = '0x101640e107C4a72DeC79826768C239F1eB48cc85'
const MaticUsdtPairContract = new web3.eth.Contract(UniV2LPABI as unknown as AbiItem, MaticUSDTPairAddress)

const WingsMaticPairAddress = '0xA0A6e9A5185d5737CF6F7920CB417EA2F07F03B3'
const WingsMaticPairContract = new web3.eth.Contract(UniV2LPABI as unknown as AbiItem, WingsMaticPairAddress)

const useWingsPrice = () => {
  const [price, setPrice] = useState(0)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    try {
      const maticObj = await MaticUsdtPairContract.methods.getReserves().call();
      if (!new BigNumber(maticObj._reserve0).eq(new BigNumber(0))) {
        const maticPrice = new BigNumber(maticObj._reserve1).div(maticObj._reserve0).times(1e12)
        const wingsObj = await WingsMaticPairContract.methods.getReserves().call();
        if (!new BigNumber(wingsObj._reserve1).eq(new BigNumber(0))) {
          const wingsPrice = new BigNumber(wingsObj._reserve0).div(wingsObj._reserve1).times(maticPrice)
          if (!wingsPrice.isEqualTo(price)) {
            setPrice(wingsPrice.toNumber())
          }
        }
      }
    } catch (e) { 
      setPrice(0)
     }
  }, [price])

  useEffect(() => {
    if (MaticUsdtPairContract && WingsMaticPairContract) {
      fetchBalance()
    }
  }, [setPrice, fetchBalance, block])

  return price
}

export default useWingsPrice
