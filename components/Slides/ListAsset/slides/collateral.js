import React from 'react';
import Link from 'next/link';
import styled, { css } from 'styled-components';
import {
  CarouselSlide,
  CarouselSlideMainTitle,
  CarouselSlideParagraph,
  CarouselNextButton,
} from 'components/CarouselSlide/';
import {
  convertTokenAmount,
  getDecimalsForToken,
  formatValueForToken,
} from 'utils/helpers';
import {
  getPlatformToken, DEFAULT_TOKEN, LISTING_FEE_IN_DEFAULT_TOKEN,
} from 'constants/app';
import { withMetamaskContext, useMetamaskContext } from 'components/MetamaskContext';
import TokenSelector from 'components/TokenSelector';
import NumericInput from 'UI/NumericInput';
import Spin from 'static/spin.svg';
import TooltipWithQuestionMarkGrey from 'UI/TooltipWithQuestionMarkGrey';

const formatter = value => `${value}%`;

const StyledTooltip = styled(TooltipWithQuestionMarkGrey)`
  margin-left: 5px;
`;

const SlippageWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0% 2%;
  margin-top: 20px;
  font-size: 16px;
  line-height: 24px;
`;

const SlippageLabel = styled.div`
  display: flex;
  align-items: center;
`;

const SlippageValue = styled.div`
  ${props => props.value >= 5 && css`
    color: #F7861C;
  `}
  ${props => props.value >= 10 && css`
    color: #FF0000;
  `}
`;

const Separator = styled.span`
  position: relative;
  top: 5px;
  left: 5px;
`;

const MybitInput = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const EscrowInput = styled(MybitInput)`
  width: 35%;
  display: inline-block;
`;

const TokenSelectorWrapper = styled(MybitInput)`
  button{
    background-color: transparent;
    border: none;
    height: auto;
    padding: 0px 5px;

    .anticon {
      margin: 0px 3px;
    }
  }

  .ant-input-group-addon{
    padding: 0px 0px;
    ${props => props.selectorIsDisabled && css`
      background-color: #f5f5f5;
      border-color: #d9d9d9;
    `}
  }
`;

const Text = styled.div`
  margin: 0% 2%;
  margin-top: 20px;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
`;

const Line = styled.div`
  margin: 10px auto;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .ant-slider{
    margin-bottom: 20px;
  }

  & > span{
    margin: 0% 2%;
  }

  ${({ theme }) => theme.tablet`
    width: 90%;
  `}
`;

const Label = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: ${({ theme }) => theme.colors.grayBase};
`;

const Loading = styled(Spin)`
  display: block;
  margin: 0 auto;
  height: 32px;
  width: 32px;
`;

const NumberInput = styled(NumericInput)`
  width: 150px;
`;

export const CollateralSlide = ({
  maxWidthDesktop,
  handleInputChange,
  formData,
  handleSelectedTokenChange,
  selectedToken,
  balances,
  kyberLoading,
  desktopMode,
  onClick,
  nextButtonDisabled,
  loadingBalancesForNewUser,
  loadingConversionInfo,
  tokenSlippagePercentages,
}) => {
  const {
    collateralInPlatformToken,
    paymentInDefaultToken,
    paymentInSelectedToken,
    minimumCollateralInPlatformToken,
  } = formData;
  const { network } = useMetamaskContext();

  const noBalance = !balances || Object.keys(balances).length === 0;
  const decimalsOfSelectedTokens = getDecimalsForToken(selectedToken);

  let buttonText = 'Next';
  if (loadingBalancesForNewUser) {
    buttonText = 'Loading Balances';
  } else if (noBalance) {
    buttonText = 'Insufficient Funds';
  } else if (loadingConversionInfo) {
    buttonText = 'Loading Slippage Info';
  }

  const isBalanceEnough = balances?.[selectedToken]?.balance >= paymentInSelectedToken && minimumCollateralInPlatformToken <= collateralInPlatformToken;

  const slippagePercentage = (!tokenSlippagePercentages || loadingConversionInfo) ? 0 : tokenSlippagePercentages[selectedToken];

  return (
    <CarouselSlide
      maxWidthDesktop={maxWidthDesktop}
      hasBoxShadow={desktopMode}
      desktopMode={desktopMode}
    >
      <CarouselSlideMainTitle
        isLong
        isSmallMobile
        isCentered
        maxWidthDesktop={maxWidthDesktop}
      >
        Asset collateral
      </CarouselSlideMainTitle>
      <CarouselSlideParagraph
        isCentered
        maxWidthDesktop={maxWidthDesktop}
        removeFocus
      >
        This is a type of decentralised insurance for investors.
        <a href="/help#How%20is%20asset%20manager%20collateral%20calculated?" target="_blank">
          Learn More
        </a>
      </CarouselSlideParagraph>
      {kyberLoading && (
        <React.Fragment>
          <CarouselSlideParagraph
            isCentered
            maxWidthDesktop={maxWidthDesktop}
            style={{ marginTop: '60px' }}
          >
            Loading data from Kyber
          </CarouselSlideParagraph>
          <Loading />
        </React.Fragment>
      )}
      {!kyberLoading && (
        <React.Fragment>
          <Text>
            The minimum collateral amount is {minimumCollateralInPlatformToken.toFixed(2)} {getPlatformToken(network)}
          </Text>
          <Line>
            <MybitInput>
              <Label>Choose Collateral Amount</Label>
              <NumberInput
                defaultValue={collateralInPlatformToken}
                max={100}
                min={0}
                onChange={e => handleInputChange({ target: { value: +e, name: 'collateralInPlatformToken' } })}
                value={collateralInPlatformToken}
                label={getPlatformToken(network)}
                decimalPlaces={2}
                step={1}
              />
            </MybitInput>
          </Line>
          <Line>
            <div>Listing fee</div>
            <div>{LISTING_FEE_IN_DEFAULT_TOKEN} {DEFAULT_TOKEN}</div>
          </Line>
          <Line>
            <TokenSelectorWrapper
              selectorIsDisabled={noBalance}
            >
              <Label>Currency you pay in</Label>
              <NumberInput
                defaultValue={paymentInSelectedToken}
                value={paymentInSelectedToken}
                min={0}
                disabled
                step={decimalsOfSelectedTokens.step}
                decimalPlaces={decimalsOfSelectedTokens.decimals}
                label={(
                  <TokenSelector
                    balances={balances}
                    amountToPay={paymentInDefaultToken}
                    onChange={handleSelectedTokenChange}
                    loading={loadingBalancesForNewUser}
                    selectedToken={selectedToken}
                  />
                  )}
              />
            </TokenSelectorWrapper>
          </Line>
          <SlippageWrapper>
            <SlippageLabel>
                Slippage rate
              <StyledTooltip
                arrowPointAtCenter
                placement="top"
                destroyTooltipOnHide
                title="Slippage is a necessary part of automated trading reserves.
                  As the relative balance of the two currencies shift due to a purchase,
                  so does the price."
              />
            </SlippageLabel>
            <SlippageValue value={slippagePercentage}>
              {slippagePercentage}
                %
            </SlippageValue>
          </SlippageWrapper>
          {desktopMode && (
            <CarouselNextButton
              loading={loadingBalancesForNewUser || loadingConversionInfo}
              desktopMode={desktopMode}
              onClick={onClick}
              disabled={nextButtonDisabled || noBalance || slippagePercentage === Infinity || !isBalanceEnough}
              style={{
                marginTop: '40px',
              }}
            >
              {buttonText}
            </CarouselNextButton>
          )}
        </React.Fragment>
      )}
    </CarouselSlide>
  );
};
