import { useEffect, useState } from 'react'
import { getWeb3NoAccount } from 'utils/web3'

const web3 = getWeb3NoAccount()

const useBlock = () => {
  const [block, setBlock] = useState(0);
  useEffect(() => {
    const interval = setInterval(async () => {
      const latestBlockNumber = await web3.eth.getBlockNumber()
      if (block !== latestBlockNumber) {
        setBlock(latestBlockNumber)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [block])

  return block
}

export default useBlock;
