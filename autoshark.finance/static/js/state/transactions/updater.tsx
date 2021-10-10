import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Text, Flex, Link } from '@autoshark-finance/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { getBscScanLink } from 'utils'
import useToast from 'hooks/useToast'
import TelegramButton from 'components/SocialButtons/TelegramButton'
import TwitterButton from 'components/SocialButtons/TwitterButton'
import RedditButton from 'components/SocialButtons/RedditButton'
import { useTranslation } from 'contexts/Localization'
import { twitterHashtagsWithTradingContest, socialLinks, socialLinksTwitter, tradingContestText, swapSuccessSharingDesc } from 'config/constants/socialSharing'
import { useBlockNumber } from '../application/hooks'
import { AppDispatch, AppState } from '../index'
import { checkedTransaction, finalizeTransaction } from './actions'

export function shouldCheck(
  lastBlockNumber: number,
  tx: { addedTime: number; receipt?: any; lastCheckedBlockNumber?: number },
): boolean {
  if (tx.receipt) return false
  if (!tx.lastCheckedBlockNumber) return true
  const blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber
  if (blocksSinceCheck < 1) return false
  const minutesPending = (new Date().getTime() - tx.addedTime) / 1000 / 60
  if (minutesPending > 60) {
    // every 10 blocks if pending for longer than an hour
    return blocksSinceCheck > 9
  }
  if (minutesPending > 5) {
    // every 3 blocks if pending more than 5 minutes
    return blocksSinceCheck > 2
  }
  // otherwise every block
  return true
}

export default function Updater(): null {
  const { t } = useTranslation()
  const { library, chainId } = useActiveWeb3React()

  const lastBlockNumber = useBlockNumber()

  const dispatch = useDispatch<AppDispatch>()
  const state = useSelector<AppState, AppState['transactions']>((s) => s.transactions)

  const transactions = useMemo(() => (chainId ? state[chainId] ?? {} : {}), [chainId, state])

  const { toastError, toastSuccess } = useToast()

  useEffect(() => {
    if (!chainId || !library || !lastBlockNumber) return
    Object.keys(transactions)
      .filter((hash) => shouldCheck(lastBlockNumber, transactions[hash]))
      .forEach((hash) => {
        library
          .getTransactionReceipt(hash)
          .then((receipt) => {
            if (receipt) {
              dispatch(
                finalizeTransaction({
                  chainId,
                  hash,
                  receipt: {
                    blockHash: receipt.blockHash,
                    blockNumber: receipt.blockNumber,
                    contractAddress: receipt.contractAddress,
                    from: receipt.from,
                    status: receipt.status,
                    to: receipt.to,
                    transactionHash: receipt.transactionHash,
                    transactionIndex: receipt.transactionIndex,
                  },
                }),
              )

              const toast = receipt.status === 1 ? toastSuccess : toastError

              if (receipt.status === 1 && transactions[hash]?.summary.includes("Swapped")) {
                const socialTitle = t(
                  swapSuccessSharingDesc,
                  {
                    summary: transactions[hash]?.summary,
                    transactionHash: getBscScanLink(hash, 'transaction', chainId),
                  },
                )
                toast(
                  'Transaction Complete',
                  <Flex flexDirection="column">
                    {chainId && (
                      <Link external href={getBscScanLink(hash, 'transaction', chainId)}>
                        {t('View on BscScan')}
                      </Link>
                    )}
                    <Text>{t(tradingContestText)}</Text>
                    <Flex justifyContent="center" mt="10px">
                      <TelegramButton title={socialTitle + socialLinks} url="https://autoshark.finance" />
                      <div style={{ marginRight: '10px' }} />
                      <TwitterButton
                        title={`${socialTitle}${socialLinksTwitter}`}
                        url="#AutoShark"
                        hashtags={twitterHashtagsWithTradingContest}
                      />
                      <div style={{ marginRight: '10px' }} />
                      <RedditButton title={socialTitle + socialLinks} url="https://autoshark.finance" />
                    </Flex>
                  </Flex>,
                )
              } else {
                toast(
                  'Transaction receipt',
                  <Flex flexDirection="column">
                    <Text>{transactions[hash]?.summary ?? `Hash: ${hash.slice(0, 8)}...${hash.slice(58, 65)}`}</Text>
                    {chainId && (
                      <Link external href={getBscScanLink(hash, 'transaction', chainId)}>
                        {t('View on BscScan')}
                      </Link>
                    )}
                  </Flex>,
                )
              }
            } else {
              dispatch(checkedTransaction({ chainId, hash, blockNumber: lastBlockNumber }))
            }
          })
          .catch((error) => {
            console.error(`failed to check transaction hash: ${hash}`, error)
          })
      })
  }, [chainId, library, transactions, lastBlockNumber, dispatch, toastSuccess, toastError, t])

  return null
}
