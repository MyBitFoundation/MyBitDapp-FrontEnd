import styled, { css } from 'styled-components';
import React from 'react';
import {
  Button,
} from 'antd';
import Fee from 'static/fee.png';
import PieChart from 'static/chart-pie.svg';
import LineChart from 'static/chart-line.svg';
import ValueDisplay from 'UI/ValueDisplay';
import AssetTemplate from 'ui/Asset/AssetTemplate';
import ManageAssetWrapper from './manageAssetWrapper';
import ManageAssetProfitSectionWrapper from './manageAssetProfitSectionWrapper';
import ManageAssetColoredValue from './manageAssetColoredValue';
import ManageAssetCustomRow from './manageAssetCustomRow';
import ManageAssetRectangleContainer from './manageAssetRectangleContainer';
import ManageAssetValueDisplayer from './manageAssetValueDisplayer';
import RevenueGenerator from 'components/RevenueGenerator';
import {
  formatMonetaryValue,
} from 'utils/helpers';

const ValueDisplayWrapper = styled.div`
  width: 90%;
  background-color: white;
  margin: 5px 0px;
  display: flex;
  justify-content: center;
  border-radius: 4px;

  ${({theme}) => theme.laptop`
    width: 80%;
  `}

  ${props => props.multipleItems && css`
    flex-direction: column;
    padding-bottom: 10px;
    align-items: center;

    ${({theme}) => theme.tablet`
      flex-direction: row;
      justify-content: space-around;
      padding-bottom: 0px;
    `}

  `}
`

const ManageAssetAssetInfo = React.memo(({
  imageSrc,
  assetId,
  name,
  city,
  country,
  fundingGoal,
  assetIncome,
  profit,
  averageProfit,
  toWithdraw,
  isWithdrawingAssetManager,
  withdrawProfitAssetManager,
  managerPercentage,
  funded,
  managerHasToCallPayout,
}) => (
  <AssetTemplate
    backgroundImage={imageSrc}
    assetId={assetId}
    name={name}
    city={city}
    country={country}
    height="175px"
  >
    <ManageAssetWrapper>
      <ManageAssetValueDisplayer>
      <ValueDisplayWrapper>
        <ValueDisplay
          text="Asset Value"
          icon={<PieChart />}
          value={formatMonetaryValue(fundingGoal)}
          hasSeparator
          hasIcon
          isBlue
          coloredBackground
        />
      </ValueDisplayWrapper>
      <ValueDisplayWrapper multipleItems>
        <ValueDisplay
          text="Asset Revenue"
          icon={<LineChart />}
          value={formatMonetaryValue(assetIncome)}
          style={{
            margin: '5px 0px',
          }}
          hasSeparator
          hasIcon
          isGreen
          coloredBackground
        />
        <RevenueGenerator
          assetId={assetId}
          managerPercentage={managerPercentage}
        >
          <Button
            type="default"
            disabled={!funded || managerHasToCallPayout}
          >
            Deposit Revenue
          </Button>
        </RevenueGenerator>
       </ValueDisplayWrapper>
      </ManageAssetValueDisplayer>
      <ManageAssetProfitSectionWrapper>
        <ManageAssetCustomRow>
          <ManageAssetRectangleContainer
            isFontSizeSmall
          >
            <b>Total profit</b>
            <ManageAssetColoredValue
              isGreen
            >
              {formatMonetaryValue(profit)}
            </ManageAssetColoredValue>
          </ManageAssetRectangleContainer>
          <ManageAssetRectangleContainer
            isFontSizeSmall
          >
            <b>Average profit</b>
            <ManageAssetColoredValue
              isBlue
            >
             {formatMonetaryValue(averageProfit)}
            </ManageAssetColoredValue>
            <b>Daily</b>
          </ManageAssetRectangleContainer>
        </ManageAssetCustomRow>
        <ManageAssetRectangleContainer
            height="80px"
            alignHorizontally
            isFullWidth
            isFontSizeSmall
          >
          <b>Available to <br />withdraw</b>
          <div>
            <ManageAssetColoredValue
              isBlue
            >
              {formatMonetaryValue(toWithdraw)}
            </ManageAssetColoredValue>
            <br />
          </div>
          <Button
            type="primary"
            disabled={toWithdraw === 0}
            loading={isWithdrawingAssetManager && toWithdraw !== 0}
            onClick={withdrawProfitAssetManager}
          >
            {isWithdrawingAssetManager ? 'Withdrawing' : 'Withdraw'}
          </Button>
        </ManageAssetRectangleContainer>
        </ManageAssetProfitSectionWrapper>
    </ManageAssetWrapper>
  </AssetTemplate>
))

export default ManageAssetAssetInfo;
