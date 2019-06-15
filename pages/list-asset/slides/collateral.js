import React from 'react';
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
  PLATFORM_TOKEN,
} from 'constants/app';
import { withMetamaskContext } from 'components/MetamaskContext';
import TokenSelector from 'components/TokenSelector';
import NumericInput from 'ui/NumericInput';
import Spin from 'static/spin.svg';
import LabelWithValueAndTooltip from 'ui/LabelWithValueAndTooltip';

const formatter = (value) => {
  return `${value}%`;
}

const InputsWrapper = styled.div`
  margin: 0 auto;

  .ant-slider{
    margin-bottom: 20px;
  }

  span{
    margin: 0% 2%;
  }

  ${({theme}) => theme.tablet`
    width: 95%;
  `}
`;

const Separator = styled.span`
  position: relative;
  top: 5px;
  left: 5px;
`

const MybitInput = styled.div`
  width: 46%;
  display: inline-block;
`
const TokenSelectorWrapper = styled.div`
  width: 46%;
  display: inline-block;

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
`

const Label = styled.div`
  margin-left: 6px;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: ${({theme}) => theme.colors.grayBase};
`

const Loading = styled(Spin)`
  display: block;
  margin: 0 auto;
  height: 32px;
  width: 32px;
`

export const CollateralSlide = ({
  maxWidthDesktop,
  collateralPercentage,
  formData,
  handleSelectedTokenChange,
  selectedToken,
  balances,
  kyberLoading,
  desktopMode,
  onClick,
  nextButtonDisabled,
  loadingBalancesForNewUser,
}) => {
  const {
    collateralInPlatformToken,
    collateralInDefaultToken,
    collateralInSelectedToken,
  } = formData;

  const noBalance = !balances || Object.keys(balances).length === 0;
  const decimalsOfSelectedTokens = getDecimalsForToken(selectedToken);
  const decimalsOfPlatformToken = getDecimalsForToken(PLATFORM_TOKEN);
  const collateralSelectedTokenFormatted = formatValueForToken(collateralInSelectedToken, selectedToken);

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
      >
        This a type of decentralised insurance for investors. It is calculated
        based on the type of asset and your history as an asset manager. <a>Learn More</a>
      </CarouselSlideParagraph>
      {kyberLoading && (
        <React.Fragment>
          <CarouselSlideParagraph
            isCentered
            maxWidthDesktop={maxWidthDesktop}
            style={{marginTop: '60px'}}
          >
            Loading data from Kyber
          </CarouselSlideParagraph>
           <Loading />
        </React.Fragment>
      )}
      {!kyberLoading && (
        <React.Fragment>
          <LabelWithValueAndTooltip
            {...formData}
          />
          <InputsWrapper>
            <MybitInput>
              <Label>Required Escrow</Label>
              <NumericInput
                defaultValue={collateralInPlatformToken}
                value={collateralInPlatformToken}
                label={PLATFORM_TOKEN}
                decimalPlaces={2}
                step={1}
                disabled
              />
            </MybitInput>
            <Separator>=</Separator>
            <TokenSelectorWrapper
              selectorIsDisabled={noBalance}
            >
              <Label>Currency you pay in</Label>
              <NumericInput
                defaultValue={collateralInSelectedToken}
                value={collateralInSelectedToken}
                min={0}
                disabled
                step={decimalsOfSelectedTokens.step}
                decimalPlaces={decimalsOfSelectedTokens.decimals}
                label={
                  <TokenSelector
                    balances={balances}
                    amountToPay={collateralInDefaultToken}
                    onChange={handleSelectedTokenChange}
                    loading={loadingBalancesForNewUser}
                  />
                }
              />

            </TokenSelectorWrapper>
          </InputsWrapper>
          {desktopMode && (
            <CarouselNextButton
              loading={loadingBalancesForNewUser}
              desktopMode={desktopMode}
              onClick={onClick}
              disabled={nextButtonDisabled || noBalance}
              style={{
                marginTop: '40px',
              }}
            >
              {loadingBalancesForNewUser ? 'Loading balances' : noBalance ? 'Insufficient Funds' : 'Next'}
            </CarouselNextButton>
          )}
        </React.Fragment>
      )}
    </CarouselSlide>
  )}
