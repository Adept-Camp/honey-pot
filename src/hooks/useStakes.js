import { useMemo } from 'react'
import { useAppState } from '../providers/AppState'
import { useSupporterSubscription } from './useSubscriptions'
import { PROPOSAL_STATUS_ACTIVE_STRING } from '../constants'

export function useAccountStakes(account) {
  const { honeypot, stakeToken } = useAppState()
  const supporter = useSupporterSubscription(honeypot, account)

  return useMemo(() => {
    if (!stakeToken || !supporter) {
      return []
    }

    return supporter.stakes.reduce((acc, stake) => {
      if (stake.proposal.status !== PROPOSAL_STATUS_ACTIVE_STRING) {
        return acc
      }

      return [
        ...acc,
        {
          proposalId: stake.proposal.id,
          proposalName: stake.proposal.name,
          amount: stake.amount,
        },
      ]
    }, [])
  }, [stakeToken, supporter])
}
