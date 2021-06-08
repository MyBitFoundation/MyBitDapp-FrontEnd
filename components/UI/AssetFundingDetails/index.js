import styled, { css } from 'styled-components';
import { memo } from 'react';
import Item from './Item';
import LabelWithTooltip from 'UI/LabelWithTooltip';

const FundingDetailsWrapper = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: auto auto;
  grid-row-gap: 20px;
  ${({theme}) => theme.mobileL`
    grid-template-columns: auto auto auto;
  `}
`

const AssetFundingDetails = memo(({
  fundingGoal,
  fundingProgress,
  funded,
  numberOfInvestors,
  cryptoPayout,
  cryptoPurchase,
}) => (
  <FundingDetailsWrapper>
    <Item
      funded={funded}
      title="Funds raised"
      value={fundingProgress}
    />
    <Item
      title="Funding goal"
      value={fundingGoal}
    />
    <Item
      title="Investors"
      value={numberOfInvestors}
    />
    <Item
      title="Payout"
      value={
        <LabelWithTooltip
          title={cryptoPayout ? 'Crypto' : 'Fiat'}
          tooltipText={cryptoPayout ?
            `Asset generates revenue in Crypto, not requiring any manual work to pay the investors` :
            `Asset generates revenue in Fiat and the Asset Manager handles the conversion to Crypto,
            manually paying the investors`}
          isDark
        />
      }
    />
    <Item
      title="Acquired"
      value={
        <LabelWithTooltip
          title={cryptoPurchase ? 'Via Crypto' : 'Via Fiat'}
          tooltipText={cryptoPurchase ?
            `No extra fees, this is the ideal case scenario` :
            `The asset incurs an additional 8% fee on top of the total investment to cover most exchanges
            fees in order to transfer the money into its fiat equivalent.`}
          isDark
        />
      }
    />
  </FundingDetailsWrapper>
))

export default AssetFundingDetails;
