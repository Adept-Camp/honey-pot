import { useMemo } from 'react'
import BigNumber from '../lib/bigNumber'
import { useLatestBlock } from './useBlock'
import {
  calculateThreshold,
  getCurrentConviction,
  getCurrentConvictionByEntity,
  getConvictionTrend,
  getMaxConviction,
  getMinNeededStake,
  getRemainingTimeToPass,
} from '../lib/conviction'
import { useAppState } from '../providers/AppState'
import {
  useProposalSubscription,
  useProposalsSubscription,
} from './useSubscriptions'
import { useWallet } from '../providers/Wallet'

const TIME_UNIT = (60 * 60 * 24) / 15

export function useProposals() {
  const { account } = useWallet()
  const { config, isLoading, vaultBalance, effectiveSupply } = useAppState()

  const latestBlock = useLatestBlock()
  const proposals = useProposalsSubscription()

  const proposalsWithData = useMemo(() => {
    if (isLoading) {
      return proposals
    }

    return proposals.map(proposal =>
      processProposal(
        proposal,
        latestBlock,
        effectiveSupply,
        vaultBalance,
        account,
        config?.conviction
      )
    )
  }, [
    account,
    config,
    effectiveSupply,
    isLoading,
    latestBlock,
    proposals,
    vaultBalance,
  ])

  return [proposalsWithData, latestBlock.number !== 0]
}

export function useProposal(proposalId, appAddress) {
  const { account } = useWallet()
  const proposal = useProposalSubscription(proposalId, appAddress)
  const { config, isLoading, vaultBalance, effectiveSupply } = useAppState()

  const latestBlock = useLatestBlock()
  const blockHasLoaded = latestBlock.number !== 0

  if (isLoading || !proposal) {
    return [null, blockHasLoaded]
  }

  const proposalWithData = processProposal(
    proposal,
    latestBlock,
    effectiveSupply,
    vaultBalance,
    account,
    config?.conviction
  )

  return [proposalWithData, blockHasLoaded]
}

function processProposal(
  proposal,
  latestBlock,
  effectiveSupply,
  vaultBalance,
  account,
  config
) {
  const { alpha, maxRatio, totalStaked, weight } = config || {}

  let threshold = null
  let neededConviction = null
  let minTokensNeeded = null
  let neededTokens = null
  let remainingTimeToPass = null

  const maxConviction = getMaxConviction(
    effectiveSupply || new BigNumber('0'),
    alpha
  )
  const currentConviction = getCurrentConviction(
    proposal.stakesHistory,
    latestBlock.number,
    alpha
  )
  const userConviction = getCurrentConvictionByEntity(
    proposal.stakesHistory,
    account,
    latestBlock.number,
    alpha
  )

  const userStakedConviction = userConviction.div(maxConviction)

  const stakedConviction = currentConviction.div(maxConviction)
  const futureConviction = getMaxConviction(totalStaked, alpha)
  const futureStakedConviction = futureConviction.div(maxConviction)
  const convictionTrend = getConvictionTrend(
    proposal.stakesHistory,
    maxConviction,
    latestBlock.number,
    alpha,
    TIME_UNIT
  )

  // Funding proposal needed values
  if (proposal.requestedAmount.gt(0)) {
    threshold = calculateThreshold(
      proposal.requestedAmount,
      vaultBalance || new BigNumber('0'),
      effectiveSupply || new BigNumber('0'),
      alpha,
      maxRatio,
      weight
    )

    neededConviction = threshold?.div(maxConviction)

    minTokensNeeded = getMinNeededStake(threshold, alpha)

    neededTokens = minTokensNeeded.minus(totalStaked)

    remainingTimeToPass = getRemainingTimeToPass(
      threshold,
      currentConviction,
      totalStaked,
      alpha
    )
  }

  return {
    ...proposal,
    currentConviction,
    userConviction,
    userStakedConviction,
    stakedConviction,
    futureConviction,
    futureStakedConviction,
    neededConviction,
    maxConviction,
    threshold,
    minTokensNeeded,
    neededTokens,
    remainingTimeToPass,
    convictionTrend,
    totalStaked,
  }
}
