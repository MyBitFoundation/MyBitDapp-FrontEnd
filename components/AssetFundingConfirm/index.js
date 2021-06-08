import {
  Button,
} from 'antd';
import styled, { css } from 'styled-components';
import Separator from 'UI/Separator';
import AssetFundingTitle from 'components/AssetFunding/assetFundingTitle';
import AssetFundingConfirmListWrapper from './assetFundingConfirmListWrapper';
import AssetFundingConfirmTotalLabel from './assetFundingConfirmTotalLabel';
import TokenSelector from 'components/TokenSelector';
import AssetFundingConfirmDropdownButton from './assetFundingConfirmDropdownButton';
import AssetFundingConfirmPayWith from './assetFundingConfirmPayWith';
import TermsAndConditions from 'UI/TermsAndConditions';
import AssetFundingFooter from './assetFundingFooter';
import Item, { AssetFundingConfirmItemValue } from './Item';
import {
  AssetFundingConfirmFooterMessage,
  AssetFundingConfirmFooterMessageUrl,
} from './assetFundingConfirmFooterMessage';
import {
  getFooter,
} from './footer';
import {
  DEFAULT_TOKEN,
  DEFAULT_TOKEN_MAX_DECIMALS,
} from 'constants/app';
import {
  MYBIT_FOUNDATION_FEE,
  FIAT_TO_CRYPTO_CONVERSION_FEE,
} from 'constants/platformFees';
import {
  formatMonetaryValue,
  convertFromDefaultToken,
  convertFromTokenToDefault,
  getDecimalsForToken,
  fromWeiToEth,
} from 'utils/helpers';
import AssetFundingButton from 'components/AssetFunding/assetFundingButton';
import LabelWithTooltip from 'UI/LabelWithTooltip';

const separatorStyleFullWidth = {
  position: 'absolute',
  left: '0px',
  marginTop: '10px',
};

const separatorStyle = {
  marginTop: '15px',
  marginBottom: '10px',
};

const StyledSlippageValue = styled.span`
  ${props => props.value >= 5 && css`
    color: #F7861C;
  `}
  ${props => props.value >= 10 && css`
    color: #FF0000;
  `}
`;

const AssetFundingConfirm = ({
  metamaskContext,
  selectedOwnership,
  supportedTokensInfo,
  kyberLoading,
  gasPrice,
  readToS,
  loadingConversionInfo,
  selectedToken,
  setAcceptedToS,
  acceptedToS,
  mybitPlatformFeeDefaultToken,
  selectedAmountDefaultToken,
  amountToPayDefaultToken,
  gasInDefaultToken,
  fundAsset,
  onCancel,
  onChangeSelectedToken,
  tokenSlippagePercentages,
}) => {
  const {
    user,
    extensionUrl,
    loadingBalancesForNewUser,
  } = metamaskContext;
  const {
    balances,
    address: userAddress,
  } = user;

  // total the user pays (contribution + platform fee + transaction fee)
  const totalToPayInDefaultToken = amountToPayDefaultToken + gasInDefaultToken;

  const amountInSelectedToken = selectedToken === DEFAULT_TOKEN ? selectedAmountDefaultToken : convertFromDefaultToken(selectedToken, supportedTokensInfo, selectedAmountDefaultToken);
  const gasInSelectedToken = selectedToken === DEFAULT_TOKEN ? gasInDefaultToken : kyberLoading ? 0 : convertFromDefaultToken(selectedToken, supportedTokensInfo, gasInDefaultToken);
  const totalToPayInSelectedToken = selectedToken === DEFAULT_TOKEN ? totalToPayInDefaultToken : kyberLoading ? 0 : convertFromDefaultToken(selectedToken, supportedTokensInfo, totalToPayInDefaultToken);
  const amountToPaySelectedToken = selectedToken === DEFAULT_TOKEN ? amountToPayDefaultToken : kyberLoading ? 0 : convertFromDefaultToken(selectedToken, supportedTokensInfo, amountToPayDefaultToken);
  const mybitPlatformFeeSelectedToken = selectedToken === DEFAULT_TOKEN ? mybitPlatformFeeDefaultToken : kyberLoading ? 0 : convertFromDefaultToken(selectedToken, supportedTokensInfo, mybitPlatformFeeDefaultToken);

  const metamaskErrors = metamaskContext.metamaskErrors();
  const footer = getFooter(
    metamaskErrors.error,
    extensionUrl,
    amountToPaySelectedToken.toFixed(18),
    selectedAmountDefaultToken,
    balances,
    fundAsset,
    !kyberLoading && supportedTokensInfo[selectedToken]?.contractAddress,
    selectedToken,
    kyberLoading,
  );

  const slippage = tokenSlippagePercentages && tokenSlippagePercentages[selectedToken];

  const {
    buttonProps,
    messageProps,
  } = footer;

  const footerButton = (
    <AssetFundingButton
      size="large"
      type={buttonProps.error ? 'default' : 'primary'}
      onClick={buttonProps.onClick}
      disabled={buttonProps.error || ((!acceptedToS && readToS) && !buttonProps.href && buttonProps.text !== 'Connect MetaMask')}
      href={buttonProps.href}
      target={buttonProps.href && '_blank'}
      loading={buttonProps.loading}
    >
      {buttonProps.text}
    </AssetFundingButton>
  );

  const footerMessage = messageProps
    ? !messageProps.href ? (
      <AssetFundingConfirmFooterMessage>
        {messageProps.text}
      </AssetFundingConfirmFooterMessage>
    ) : (
      <AssetFundingConfirmFooterMessageUrl
        href={messageProps.href}
        target="_blank"
        rel="noreferrer"
      >
        {messageProps.text}
      </AssetFundingConfirmFooterMessageUrl>
    ) : null;

  return (
    <React.Fragment>
      <AssetFundingTitle
        text={`You will own ${selectedOwnership}% of the asset`}
        onClick={onCancel}
      />
      <Separator style={separatorStyleFullWidth} />
      <AssetFundingConfirmListWrapper>
        <Item
          title="Contribution"
          firstValue={formatMonetaryValue(selectedAmountDefaultToken)}
          secondValue={formatMonetaryValue(amountInSelectedToken, selectedToken)}
          loading={loadingConversionInfo || !selectedToken}
        />
        <Separator style={separatorStyle} />
        <Item
          title={`MyBit Foundation Fee (${MYBIT_FOUNDATION_FEE * 100}%)`}
          firstValue={formatMonetaryValue(mybitPlatformFeeDefaultToken)}
          secondValue={formatMonetaryValue(mybitPlatformFeeSelectedToken, selectedToken)}
          loading={loadingConversionInfo || !selectedToken}
        />
        <Separator style={separatorStyle} />
        <Item
          title="Gas Fee"
          firstValue={formatMonetaryValue(gasInDefaultToken)}
          secondValue={formatMonetaryValue(gasInSelectedToken, selectedToken)}
          loading={loadingConversionInfo || !selectedToken}
        />
        {slippage > 0 && (
          <React.Fragment>
            <Separator style={separatorStyle} />
            <Item
              title={(
                <LabelWithTooltip
                  title="Slippage rate"
                  tooltipText="Slippage is a necessary part of automated trading reserves.
                    As the relative balance of the two currencies shift due to a purchase,
                    so does the price."
                  isDark
                />
)}
              firstValue={(
                <StyledSlippageValue
                  value={tokenSlippagePercentages[selectedToken]}
                >
                  {tokenSlippagePercentages[selectedToken]}
%
                </StyledSlippageValue>
)}
            />
          </React.Fragment>
        )}
        <Separator style={separatorStyle} />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
        >
          <AssetFundingConfirmTotalLabel>
            Total to pay:
          </AssetFundingConfirmTotalLabel>
          <AssetFundingConfirmItemValue
            isLarge
          >
            <p>{formatMonetaryValue(totalToPayInDefaultToken)}</p>
            <p>{!selectedToken ? <span>loading</span> : formatMonetaryValue(totalToPayInSelectedToken, selectedToken)}</p>
          </AssetFundingConfirmItemValue>
        </div>
        <AssetFundingConfirmDropdownButton>
          <AssetFundingConfirmPayWith>
            Pay with
          </AssetFundingConfirmPayWith>
          <TokenSelector
            balances={balances}
            amountToPay={amountToPayDefaultToken}
            onChange={onChangeSelectedToken}
            userAddress={userAddress}
            loading={loadingBalancesForNewUser}
          />
        </AssetFundingConfirmDropdownButton>
        <Separator style={separatorStyleFullWidth} />
        <AssetFundingFooter>
          {readToS && (
          <TermsAndConditions
            checked={acceptedToS}
            onChange={event => setAcceptedToS(event.target.checked)}
          />
          )}
          {footerButton}
          {footerMessage}
        </AssetFundingFooter>
      </AssetFundingConfirmListWrapper>
    </React.Fragment>
  );
};

export default AssetFundingConfirm;
