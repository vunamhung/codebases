import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'

export const approve = async (lpContract, masterChefContract, account) => {
  return lpContract.methods
    .approve(masterChefContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account })
}

export const approveVault = async (lpContract, jetswapVaultContract, account) => {
  return lpContract.methods
    .approve(jetswapVaultContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account })
}

export const stake = async (masterChefContract, pid, amount, account, decimals = 18) => {
  if (pid === 0) {
    return masterChefContract.methods
      .enterStaking(
        new BigNumber(amount).times(new BigNumber(10).pow(decimals)).integerValue(BigNumber.ROUND_FLOOR).toString(),
      )
      .send({ from: account })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }

  return masterChefContract.methods
    .deposit(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(decimals)).integerValue(BigNumber.ROUND_FLOOR).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const sousStake = async (sousChefContract, amount, decimals = 18, account) => {
  return sousChefContract.methods
    .deposit(
      new BigNumber(amount).times(new BigNumber(10).pow(decimals)).integerValue(BigNumber.ROUND_FLOOR).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const sousStakeBnb = async (sousChefContract, amount, account) => {
  return sousChefContract.methods
    .deposit()
    .send({
      from: account,
      value: new BigNumber(amount).times(new BigNumber(10).pow(18)).integerValue(BigNumber.ROUND_FLOOR).toString(),
    })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const unstake = async (masterChefContract, pid, amount, account, decimals = 18) => {
  if (pid === 0) {
    return masterChefContract.methods
      .leaveStaking(
        new BigNumber(amount).times(new BigNumber(10).pow(decimals)).integerValue(BigNumber.ROUND_FLOOR).toString(),
      )
      .send({ from: account })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }

  return masterChefContract.methods
    .withdraw(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(decimals)).integerValue(BigNumber.ROUND_FLOOR).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const sousUnstake = async (sousChefContract, amount, decimals = 18, account) => {
  // shit code: hard fix for old CTK and BLK
  if (sousChefContract.options.address === '0xFD919978845247e147364F0A1f1565AAC4Fcd472') {
    return sousChefContract.methods
      .emergencyWithdraw()
      .send({ from: account })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }
  if (sousChefContract.options.address === '0xBb2B66a2c7C2fFFB06EA60BeaD69741b3f5BF831') {
    return sousChefContract.methods
      .emergencyWithdraw()
      .send({ from: account })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }
  if (sousChefContract.options.address === '0x8825a44182b94641f9299C32EF44D21235563EF7') {
    return sousChefContract.methods
      .emergencyWithdraw()
      .send({ from: account })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }

  return sousChefContract.methods
    .withdraw(
      new BigNumber(amount).times(new BigNumber(10).pow(decimals)).integerValue(BigNumber.ROUND_FLOOR).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const sousEmegencyUnstake = async (sousChefContract, amount, account) => {
  return sousChefContract.methods
    .emergencyWithdraw()
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const harvest = async (masterChefContract, pid, account) => {
  if (pid === 0) {
    return masterChefContract.methods
      .leaveStaking('0')
      .send({ from: account })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }

  return masterChefContract.methods
    .deposit(pid, '0')
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const soushHarvest = async (sousChefContract, account) => {
  return sousChefContract.methods
    .deposit('0')
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const soushHarvestBnb = async (sousChefContract, account) => {
  return sousChefContract.methods
    .deposit()
    .send({ from: account, value: new BigNumber(0) })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const harvestVault = async (jetswapStrategyContract, account) => {
  return jetswapStrategyContract.methods
    .harvest()
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const stakeVault = async (isMATIC, jetswapVaultContract, amount, account, depositAll, decimals = 18) => {
  if (depositAll && !isMATIC) {
    return jetswapVaultContract.methods
      .depositAll()
      .send({ from: account })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }

  if (isMATIC) {
    return jetswapVaultContract.methods
      .depositBNB()
      .send({
        from: account,
        value: new BigNumber(amount)
          .times(new BigNumber(10).pow(decimals))
          .integerValue(BigNumber.ROUND_FLOOR)
          .toString(),
      })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }
  return jetswapVaultContract.methods
    .deposit(
      new BigNumber(amount).times(new BigNumber(10).pow(decimals)).integerValue(BigNumber.ROUND_FLOOR).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const unstakeVault = async (isMATIC, jetswapVaultContract, amount, account, withdrawAll, decimals = 18) => {
  if (withdrawAll && !isMATIC) {
    return jetswapVaultContract.methods
      .withdrawAll()
      .send({ from: account })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }

  if (withdrawAll && isMATIC) {
    return jetswapVaultContract.methods
      .withdrawAllBNB()
      .send({ from: account })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }

  const pricePerFullShareWei = await jetswapVaultContract.methods.getPricePerFullShare().call()
  const shares = new BigNumber(amount).times(new BigNumber(10).pow(decimals)).div(pricePerFullShareWei).toString()
  if (isMATIC) {
    return jetswapVaultContract.methods
      .withdrawBNB(
        new BigNumber(shares).times(new BigNumber(10).pow(decimals)).integerValue(BigNumber.ROUND_FLOOR).toString(),
      )
      .send({ from: account })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }

  return jetswapVaultContract.methods
    .withdraw(
      new BigNumber(shares).times(new BigNumber(10).pow(decimals)).integerValue(BigNumber.ROUND_FLOOR).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const buyTickets = async (lotteryContract, lotteryId, ticketAmount, ticketNumbers, account) => {
  return lotteryContract.methods
    .batchBuyLottoTicket(lotteryId, ticketAmount, ticketNumbers)
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const claimReward = async (lotteryContract, lotteryId, ticketIds, account) => {
  return lotteryContract.methods
    .batchClaimRewards(lotteryId, ticketIds)
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}
