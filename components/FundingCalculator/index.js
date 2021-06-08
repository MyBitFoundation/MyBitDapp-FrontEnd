import React, { memo } from 'react';
import styled from 'styled-components';
import {
  Slider,
  InputNumber,
} from 'antd';
import { DEFAULT_TOKEN } from 'constants/app';
import { MYBIT_FOUNDATION_SHARE } from 'constants/platformFees';
import {
  formatMonetaryValue,
  getDecimalsForToken,
} from 'utils/helpers';
import NumericInput from 'UI/NumericInput';
import FundingCalculatorTitle from './fundingCalculatorTitle';
import FundingCalculatorEqualsSeparator from './fundingCalculatorEqualsSeparator';
import FundingCalculatorLabel from './fundingCalculatorLabel';
import FundingCalculatorSeparator from './fundingCalculatorSeparator';
import FundingCalculatorValue from './fundingCalculatorValue';
import FundingCalculatorSpin from './fundingCalculatorSpin';
import FundingCalculatorGrid from './fundingCalculatorGrid';
import FundingCalculatorSliderLabel from './fundingCalculatorSliderLabel';
import TooltipWithQuestionMarkGrey from 'UI/TooltipWithQuestionMarkGrey';
const decimalsForDefaultToken = getDecimalsForToken(DEFAULT_TOKEN);

const PLATFORM_FEE = MYBIT_FOUNDATION_SHARE * 100;

const ToolTipWrapper = styled.div`
  display: flex;
  align-items: center;

  svg{
    margin-left: 5px;
  }
`

const FundingCalculator = memo(({
  onChangeContributionDefaultToken,
  onChangeContributionPercentage,
  selectedAmountDefaultToken,
  maxInvestment,
  minInvestment,
  selectedOwnership,
  ended,
  userOwnership,
  loadingUserInfo,
  userInvestment,
  managerPercentage,
  percentageOwnedByUser,
}) => {
  const managerInPercentage = managerPercentage * 100;
  const investorsPercentage = 100 - managerInPercentage - PLATFORM_FEE;
  return(
    <React.Fragment>
      <FundingCalculatorTitle>
        {ended ? 'Your investment' :
          <ToolTipWrapper>
            <span>Calculate your investment</span>
            <TooltipWithQuestionMarkGrey
              overlayClassName={''}
              arrowPointAtCenter
              placement="top"
              destroyTooltipOnHide
              title={
                <div style={{width: '220px'}}>
                  <p>Distribution of Shares:</p>
                  <div>
                    Investors: {investorsPercentage}%{percentageOwnedByUser > 0 ? ` (you own ${(percentageOwnedByUser * 100).toFixed(2)}%)` : ''}<br />
                    Asset Manager: {managerInPercentage}%<br />
                    MyBit Platform: {PLATFORM_FEE}%

                  </div>
                </div>
              }
            />
          </ToolTipWrapper>
        }
      </FundingCalculatorTitle>
      {!ended && (
        <React.Fragment>
          <div style={{display: 'flex'}}>
            <NumericInput
              placeholdertext={`Amount in ${DEFAULT_TOKEN}`}
              value={selectedAmountDefaultToken > 0 ? selectedAmountDefaultToken : null}
              label={DEFAULT_TOKEN}
              onChange={onChangeContributionDefaultToken}
              min={0}
              decimalPlaces={decimalsForDefaultToken.decimals}
              step={decimalsForDefaultToken.step}
            />
            <FundingCalculatorEqualsSeparator>
              =
            </FundingCalculatorEqualsSeparator>
            <NumericInput
              placeholdertext="Amount %"
              value={selectedOwnership > 0 ? selectedOwnership : null}
              min={0}
              label="%"
              decimalPlaces={2}
              step={0.01}
              onChange={onChangeContributionPercentage}
            />
          </div>
          <Slider
            id="slider"
            step={decimalsForDefaultToken.step}
            defaultValue={0}
            value={selectedAmountDefaultToken}
            min={0}
            max={maxInvestment}
            onChange={onChangeContributionDefaultToken}
            disabled={ended}
          />
          <FundingCalculatorGrid
            style={{marginTop: '10px'}}
          >
            <FundingCalculatorSliderLabel>
            Min. <span>{formatMonetaryValue(minInvestment)}</span>
            </FundingCalculatorSliderLabel>
            <FundingCalculatorSliderLabel>
            Max. <span>{formatMonetaryValue(maxInvestment)}</span>
            </FundingCalculatorSliderLabel>
          </FundingCalculatorGrid>
        </React.Fragment>
      )}
      <FundingCalculatorGrid
        style={{marginTop: '20px'}}
      >
        <div>
          <FundingCalculatorLabel>
            Your contribution
          </FundingCalculatorLabel>
          <FundingCalculatorValue>
            {(loadingUserInfo && ended) && (
              <FundingCalculatorSpin />
            )}
            {(loadingUserInfo && ended) ? null : ended ? formatMonetaryValue(parseFloat(userInvestment)) : selectedAmountDefaultToken ? formatMonetaryValue(parseFloat(selectedAmountDefaultToken)) : 0}
          </FundingCalculatorValue>
        </div>
        <div>
          <FundingCalculatorLabel>
            Your ownership
          </FundingCalculatorLabel>
          <FundingCalculatorValue>
            {(loadingUserInfo && ended) && (
              <FundingCalculatorSpin />
            )}
            {(loadingUserInfo && ended) ? null : ended ? parseFloat((userOwnership * 100).toFixed(2)) : selectedAmountDefaultToken ? selectedOwnership : 0}%
          </FundingCalculatorValue>
        </div>
      </FundingCalculatorGrid>
    </React.Fragment>
  )
})

export default FundingCalculator;
