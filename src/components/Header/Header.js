import React from 'react'
import { GU, useTheme } from '@1hive/1hive-ui'
import AccountModule from '../Account/AccountModule'
import BalanceModule from '../BalanceModule'
import Layout from '../Layout'
import { useWallet } from '../../providers/Wallet'

import beeSvg from '../../assets/bee.svg'
import logoSvg from '../../assets/logo.svg'

function Header({ compact }) {
  const theme = useTheme()
  const { account } = useWallet()
  const BeeIcon = <img src={beeSvg} height={compact ? 40 : 60} alt="" />

  return (
    <header
      css={`
        position: relative;
        z-index: 3;
        background: #fff;
        box-shadow: rgba(0, 0, 0, 0.05) 0 2px 3px;
      `}
    >
      <Layout>
        <div
          css={`
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: ${8 * GU}px;
          `}
        >
          <div
            css={`
              display: flex;
              align-items: center;
            `}
          >
            {compact ? BeeIcon : <img src={logoSvg} height="40" alt="" />}
            <nav
              css={`
                display: flex;
                align-items: center;

                height: 100%;
                margin-left: ${6.5 * GU}px;
              `}
            >
              <a
                href="#/home"
                css={`
                  text-decoration: none;
                  color: ${theme.contentSecondary};
                `}
              >
                Home
              </a>
              <a
                href="#/gethoney"
                css={`
                  text-decoration: none;
                  color: ${theme.contentSecondary};
                  margin-left: ${4 * GU}px;
                `}
              >
                Get Honey
              </a>
            </nav>
          </div>

          <div
            css={`
              display: flex;
              align-items: center;
              ${account && `min-width: ${42.5 * GU}px`};
            `}
          >
            <AccountModule compact={compact} />
            {account && (
              <>
                <div
                  css={`
                    width: 0.5px;
                    height: ${3.5 * GU}px;
                    border-left: 0.5px solid ${theme.border};
                  `}
                />
                <BalanceModule />
              </>
            )}
          </div>
        </div>
      </Layout>
    </header>
  )
}

export default Header
