import React from 'react';
import BN from 'bignumber.js';
import { withKyberContext } from 'components/KyberContext';
import { withMetamaskContext } from 'components/MetamaskContext';
import {
  DEFAULT_TOKEN,
  DEFAULT_TOKEN_MAX_DECIMALS,
  getDefaultTokenContract,
} from 'constants/app';
import {
  MYBIT_FOUNDATION_SHARE,
  MYBIT_FOUNDATION_FEE,
  FIAT_TO_CRYPTO_CONVERSION_FEE,
} from 'constants/platformFees';
import {
  fromWeiToEth,
  convertFromTokenToDefault,
  toWei,
} from 'utils/helpers';
import { calculateSlippage } from 'constants/calculateSlippage';

BN.config({ EXPONENTIAL_AT: 80 });

const GAS_FUNDING = require('@mwood77/network.js/gas').buyAssetOrderERC20;
const GAS_APPROVE = require('@mwood77/network.js/gas').approve;

class AssetFundingModule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingConversionInfo: true,
      selectedToken: DEFAULT_TOKEN,
      acceptedToS: false,
      setAcceptedToS: this.setAcceptedToS,
      onChangeContributionDefaultToken: this.onChangeContributionDefaultToken,
      onChangeContributionPercentage: this.onChangeContributionPercentage,
      onChangeSelectedToken: this.onChangeSelectedToken,
      loadExchangeRateForAmountToPay: this.loadExchangeRateForAmountToPay,
      handleDeadlineHit: this.handleDeadlineHit,
      maxInvestment: 0,
      maxOwnership: 0,
      selectedAmountDefaultToken: 0,
    };
  }

  componentWillMount = () => {
    this.setStaticParameters();
  }

  componentWillReceiveProps = (nextProps) => {
    const { asset } = this.props;
    const { loading } = this.props.blockchainContext;
    const { loadingUserInfo } = loading;
    const { loadingBalancesForNewUser } = this.props.metamaskContext;
    if (nextProps.blockchainContext.loading.loadingUserInfo !== loadingUserInfo) {
      this.setState({ loadingUserInfo });
    }
    // if the user changed, recalculate exchange rate for the tokens the new user has
    if (!nextProps.metamaskContext.loadingBalancesForNewUser && loadingBalancesForNewUser) {
      this.loadExchangeRateForAmountToPay(nextProps.metamaskContext.user.balances);
    }

    // update due to changes in the asset
    if (asset.fundingProgress !== nextProps.asset.fundingProgress) {
      this.setStaticParameters(nextProps);
    }
  }

  setStaticParameters = (props) => {
    const { asset } = props || this.props;

    const {
      managerPercentage,
      funded,
      pastDate,
      percentageOwnedByUser,
      fundingGoal,
      availableShares,
      totalSupply,
    } = asset;

    const ended = pastDate || funded;

    let maxInvestment = Number(availableShares.toFixed(2));
    let minInvestment = 0.01;

    if (ended) {
      minInvestment = 0;
      maxInvestment = 0;
    } else if (maxInvestment < 0.01) {
      minInvestment = 0.01;
      maxInvestment = 0.01;
    }

    // Total fee: manager fee + platform fees (1%)
    const maxPercentageAfterFees = 100 - (managerPercentage * 100 + (MYBIT_FOUNDATION_SHARE * 100));
    const maxOwnership = ((maxInvestment * maxPercentageAfterFees) / fundingGoal).toFixed(2);
    const totalGas = this.calculateGasCost();
    const gasInDefaultToken = parseFloat(convertFromTokenToDefault('ETH', this.props.supportedTokensInfo, totalGas).toFixed(DEFAULT_TOKEN_MAX_DECIMALS));

    this.setState({
      maxInvestment,
      minInvestment,
      maxOwnership,
      ended,
      totalGas,
      gasInDefaultToken,
    });
  }

  /*
  * Exchange rate varies with the amount to pay.
  * We calculate the exchange rate for all the tokens the user has.
  */
  loadExchangeRateForAmountToPay = (newBalances) => {
    this.setState({ loadingConversionInfo: true });
    const {
      amountToPayDefaultToken,
    } = this.state;
    const { metamaskContext } = this.props;
    const { user, network } = metamaskContext;
    let { balances } = user;
    balances = newBalances || balances;
    const DEFAULT_TOKEN_CONTRACT = getDefaultTokenContract(network);
    // const tokenSlippagePercentages = calculateSlippage(balances, DEFAULT_TOKEN_CONTRACT, amountToPayDefaultToken, true)
    //   .then(tokenSlippagePercentages => this.setState({tokenSlippagePercentages, loadingConversionInfo: false}))
  }

  /*
  * Calculate total gas. Note that we may or not call approve
  * so we need to account for that when estimating the total gas cost
  */
  calculateGasCost = () => {
    const { gasPrice } = this.props;
    const { selectedToken } = this.state;
    const gasPriceInEth = fromWeiToEth(gasPrice);
    const approveGastCost = selectedToken === 'ETH' ? 0 : gasPriceInEth * GAS_APPROVE;
    const transactionGasCost = gasPriceInEth * GAS_FUNDING;
    const totalGas = approveGastCost + transactionGasCost;
    return totalGas;
  }

  getOwnershipOffSelectedAmountAndTotalSupply = (amount, totalSupply) => ((amount / totalSupply) * 100).toFixed(2)

  handleDeadlineHit = () => {
    console.warn('Hit deadline');
  }

  setAcceptedToS = acceptedToS => this.setState({ acceptedToS })

  onChangeSelectedToken = (selectedToken) => {
    const { selectedToken: currentSelectedToken } = this.state;
    this.setState({ selectedToken }, () => {
      // the gas cost changes depending on whether we need to call approve(), which we do only for when selectedToken !== ETH
      if (currentSelectedToken !== 'ETH' && selectedToken === 'ETH' || currentSelectedToken === 'ETH' && selectedToken !== 'ETH') {
        const totalGas = this.calculateGasCost();
        this.setState({ totalGas });
      }
    });
  }

  getAmountToPayAndFees = (amount, asset) => {
    const amountInBn = BN(amount);
    const mybitPlatformFeeDefaultToken = amountInBn.times(MYBIT_FOUNDATION_FEE).toNumber();
    const amountToPayDefaultToken = amountInBn.plus(mybitPlatformFeeDefaultToken).toNumber();
    return {
      mybitPlatformFeeDefaultToken,
      amountToPayDefaultToken,
    };
  }

  onChangeContributionDefaultToken = (value) => {
    value = value || 0;
    const {
      maxInvestment,
      totalGas,
    } = this.state;

    if (value <= maxInvestment) {
      const {
        asset,
        kyberLoading,
        supportedTokensInfo,
      } = this.props;
      const { totalSupply } = asset;

      const amountToPayAndFee = this.getAmountToPayAndFees(value, asset);
      this.setState({
        selectedAmountDefaultToken: Number(value),
        selectedOwnership: value > 0 ? this.getOwnershipOffSelectedAmountAndTotalSupply(value, totalSupply) : 0,
        selectedMaxValue: false,
        ...amountToPayAndFee,
      });
    }
  }

  onChangeContributionPercentage = (value) => {
    value = value || 0;
    const { maxOwnership } = this.state;

    if (value <= maxOwnership) {
      const {
        asset,
        kyberLoading,
        supportedTokensInfo,
      } = this.props;
      const {
        fundingGoal,
        totalSupply,
        totalGas,
      } = asset;

      // calculate the new amount considering the percentage changed
      const selectedAmountDefaultToken = value > 0 ? parseFloat((totalSupply * (value / 100)).toFixed(DEFAULT_TOKEN_MAX_DECIMALS)) : 0;
      // calculate total amount to  pay and the platform fee
      const amountToPayAndFee = this.getAmountToPayAndFees(selectedAmountDefaultToken, asset);

      this.setState({
        selectedMaxValue: false,
        selectedOwnership: Number(value),
        selectedAmountDefaultToken,
        ...amountToPayAndFee,
      });
    }
  }

  render = () => {
    const props = { ...this.state, ...this.props };
    return this.props.children(props);
  }
}

export default withMetamaskContext(withKyberContext(AssetFundingModule));
