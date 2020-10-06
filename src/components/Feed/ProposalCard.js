import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { GU, textStyle, useTheme } from '@1hive/1hive-ui'

import Balance from '../Balance'
import { ConvictionBar } from '../ConvictionVisuals'
import ProposalCreator from './ProposalCreator'
import ProposalFooter from './ProposalFooter'

import { useAppState } from '../../providers/AppState'

import { ProposalTypes } from '../../types'
import honeySvg from '../../assets/honey.svg'

export default function ProposalCard({ proposal }) {
  const theme = useTheme()
  const history = useHistory()
  const { requestToken } = useAppState()

  const handleSelectProposal = useCallback(() => {
    history.push(`${history.location.pathname}/proposal/${proposal.number}`)
  }, [history, proposal.number])

  return (
    <div
      css={`
        border: 1px solid ${theme.border};
        background: ${theme.surface};
        margin-bottom: ${2 * GU}px;
        padding: ${3 * GU}px;
        border-radius: ${2 * GU}px;
        cursor: pointer;
      `}
      onClick={handleSelectProposal}
    >
      <ProposalCreator proposal={proposal} />
      <div
        css={`
          margin-bottom: ${3 * GU}px;
          ${textStyle('body1')};
        `}
      >
        {proposal.name}
      </div>
      {proposal.type === ProposalTypes.Proposal && (
        <div
          css={`
            margin-bottom: ${2 * GU}px;
            display: flex;
            align-items: center;
            color: ${theme.contentSecondary};
          `}
        >
          <span
            css={`
              margin-right: ${1 * GU}px;
            `}
          >
            Request:
          </span>
          <Balance
            amount={proposal.requestedAmount}
            decimals={requestToken.decimals}
            icon={honeySvg}
            symbol={requestToken.symbol}
          />
        </div>
      )}
      <div
        css={`
          margin-bottom: ${2 * GU}px;
        `}
      >
        <div
          css={`
            ${textStyle('label2')};
            color: ${theme.contentSecondary};
          `}
        >
          Current{' '}
          {proposal.type !== ProposalTypes.Decision ? 'support' : 'votes'}
        </div>
        {proposal.type !== ProposalTypes.Decision ? (
          <ProposalInfo proposal={proposal} requestToken={requestToken} />
        ) : (
          <div>Decision support</div> // TODO: Add current votes
        )}
      </div>
      <ProposalFooter proposal={proposal} />
    </div>
  )
}

const ProposalInfo = ({ proposal, requestToken }) => {
  return (
    <div>
      <ConvictionBar
        proposal={proposal}
        withThreshold={Boolean(requestToken)}
      />
    </div>
  )
}
