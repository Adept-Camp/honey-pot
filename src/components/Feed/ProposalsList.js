import React, { useMemo } from 'react'
import { Button, textStyle } from '@1hive/1hive-ui'
import ProposalCard from './ProposalCard'
import { useAppState } from '../../providers/AppState'

function ProposalsList({
  proposals,
  onStakeToProposal,
  onWithdrawFromProposal,
}) {
  const { increaseProposalCount } = useAppState()

  const sortedProposals = useMemo(
    () => proposals.sort((a, b) => b.currentConviction - a.currentConviction),
    [proposals]
  )

  return (
    <div
      css={`
        flex-basis: 50%;
      `}
    >
      {sortedProposals.length ? (
        <>
          {sortedProposals.map((proposal, index) => {
            return (
              <ProposalCard
                key={index}
                proposal={proposal}
                onStakeToProposal={onStakeToProposal}
                onWithdrawFromProposal={onWithdrawFromProposal}
              />
            )
          })}
          <Button label="Load more" onClick={increaseProposalCount} />
        </>
      ) : (
        <p
          css={`
            ${textStyle('title2')};
            font-weight: 600;
          `}
        >
          No proposals yet!
        </p>
      )}
    </div>
  )
}

export default ProposalsList
