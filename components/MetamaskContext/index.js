/* eslint-disable class-methods-use-this */

import React, { Component, useContext } from 'react';
import PropTypes from 'prop-types';
import Web3 from 'web3';
import { withKyberContext } from 'components/KyberContext';
import {
  METAMASK_FIREFOX,
  METAMASK_CHROME,
  METAMASK_OPERA,
  METAMASK_ERRORS,
  NETWORKS,
} from './constants';
import {
  getDefaultTokenContract,
  getPlatformTokenContract,
} from 'constants/app';

import {
  getBalanceOfERC20Token,
  getBalanceInDai,
} from './utils';
import { FALLBACK_NETWORK } from 'constants/supportedNetworks';
import SupportedBrowsers from 'UI/SupportedBrowsers';

const metamaskContext = React.createContext({});
const { Provider, Consumer } = metamaskContext;

export const useMetamaskContext = () => useContext(metamaskContext);

// Required so we can trigger getInitialProps in our exported pages
export const withMetamaskContextPageWrapper = Component => class Higher extends React.Component {
  render() {
    return (
      <Consumer>
        {state => <Component {...this.props} metamaskContext={state} />}
      </Consumer>
    );
  }
};

export const getStaticProps = () => ({
  props: {},
});

export const withMetamaskContext = Component => function WrapperComponent(props) {
  return (
    <Consumer>
      {state => <Component {...props} metamaskContext={state} />}
    </Consumer>
  );
};

class MetamaskProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userHasMetamask: undefined,
      userIsLoggedIn: undefined,
      privacyModeEnabled: undefined,
      isReadOnlyMode: undefined,
      extensionUrl: undefined,
      user: { balances: {} },
      metamaskErrors: this.metamaskErrors,
      loadingBalances: true,
    };
    this.hasSetInitialState = false;
  }

  metamaskErrors = (className) => {
    const {
      userHasMetamask,
      extensionUrl,
      userIsLoggedIn,
      network,
      privacyModeEnabled,
    } = this.state;

    const {
      supportedNetworks,
    } = this.props;

    let toRender = null;
    let error;
    if (!userHasMetamask && extensionUrl) {
      error = METAMASK_ERRORS.NO_METAMASK;
      toRender = (
        <span>
Please connect via
          {' '}
          <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">MetaMask</a>
          {' '}
to be able to view, fund and list assets.
          You can download the extension via
          {' '}
          <a href={extensionUrl} target="_blank" rel="noopener noreferrer">this</a>
          {' '}
link.
        </span>
      );
    } else if (!userHasMetamask && !extensionUrl) {
      error = METAMASK_ERRORS.NOT_SUPPORTED;
      toRender = (
        <div>
          <span>
Your browser is not supported. MetaMask supports the following browsers:
            <SupportedBrowsers />
          </span>
        </div>
      );
    } else if (userHasMetamask && !userIsLoggedIn) {
      error = METAMASK_ERRORS.NO_LOGIN;
      toRender = (
        <span>Please login in MetaMask.</span>
      );
    } else if (privacyModeEnabled === undefined) {
      error = METAMASK_ERRORS.NOT_CONNECTED;
      toRender = (
        <span>
          <span className="MetamaksErrors__connect" onClick={window.ethereum.enable}>Connect</span>
          {' '}
your MetaMask account to get started.
        </span>
      );
    } else if (!supportedNetworks.includes(network)) {
      error = METAMASK_ERRORS.NOT_NETWORK;
      toRender = (
        <span>
          The selected network is not supported at the moment, please use MetaMask to change to one of the following networks:
          <span style={{ display: 'block' }}>
            {supportedNetworks.map((network, index) => (index === supportedNetworks.length - 1 ? network : `${network}, `))}
          </span>
        </span>
      );
    }
    return {
      render: toRender && (
        <div className={className}>
          {toRender}
        </div>
      ),
      error,
    };
  }

  componentDidMount = async () => {
    try {
      if (typeof window !== 'undefined') {
        this.detect = require('detect-browser');
      }
      // Modern dapp browsers...
      if (window.ethereum) {
        this.props.setUserHasMetamask(true);
        const { ethereum } = window;
        window.web3js = new Web3(ethereum);
        // don't auto refresh
        ethereum.autoRefreshOnNetworkChange = false;
        ethereum.on('networkChanged', (network) => {
          network = NETWORKS[network];
          const {
            setNetwork,
          } = this.props;

          if (setNetwork) {
            setNetwork(network);
          }
        });
        const accessToAccounts = await this.haveAccessToAccounts() ? true : undefined;
        await this.userHasMetamask(accessToAccounts);
      } else if (window.web3) {
        window.web3js = new Web3(window.ethereum);
        await this.userHasMetamask(false);
        this.props.setUserHasMetamask(true);
      } else {
        if (this.props.backupProvider) {
          window.web3js = new Web3(new Web3.providers.HttpProvider(this.props.backupProvider));
        }
        this.isBrowserSupported();
        this.props.setUserHasMetamask(false);
      }
    } catch (err) {
      console.error(err);
    }
  }

  componentWillReceiveProps = (nextProps, nextState) => {
    const {
      supportedTokensInfo: oldSupportedTokensInfo,
    } = this.props;

    const {
      supportedTokensInfo: newSupportedTokensInfo,
    } = nextProps;

    /*
    * Updates when it receives a new object containing the supported tokens
    * when it didn't have one or when the object is new (kyberContext updated)
    */
    if (!oldSupportedTokensInfo && newSupportedTokensInfo || (oldSupportedTokensInfo && (oldSupportedTokensInfo.key !== newSupportedTokensInfo.key))) {
      this.getUserInfo(this.state.privacyModeEnabled, this.state.network, nextProps.supportedTokensInfo);
    }
  }

  fetchUserBalances = async (supportedTokensInfo, ethBalance, userAddress) => {
    const { user } = this.state;
    const { supportedNetworks } = this.props;
    const { kyberNetwork } = this.props;
    const network = await this.checkNetwork();
    const currentAvgBalance = user.avgBalance;
    const currentBalances = user.balances || {};
    const updatedTokensWithBalance = {};
    let sumOfBalances = 0;
    let shouldUpdateState = false;
    let avgBalance = 0;
    if (supportedNetworks.includes(network) && kyberNetwork === network) {
      const PLATFORM_TOKEN_CONTRACT = getPlatformTokenContract(network);
      const DEFAULT_TOKEN_CONTRACT = getDefaultTokenContract(network);
      const balances = await Promise.all(Object.entries(supportedTokensInfo).map(async ([
        symbol,
        tokenData,
      ]) => {
        let balance = 0;
        if (symbol === 'ETH') {
          balance = ethBalance;
        } else {
          balance = await getBalanceOfERC20Token(tokenData.contractAddress, tokenData.decimals, userAddress);
        }
        // we are only interested in listing balances > 0
        if (balance > 0) {
          let balanceInDai = 0;
          let balanceInPlatformToken = 0;
          const exchangeRateDefaultToken = tokenData.exchangeRateDefaultToken;
          const exchangeRatePlatformToken = tokenData.exchangeRatePlatformToken;

          if (exchangeRateDefaultToken) {
            balanceInDai = tokenData.contractAddress === DEFAULT_TOKEN_CONTRACT ? balance : balance * exchangeRateDefaultToken.expectedRate;
          }

          if (exchangeRatePlatformToken) {
            balanceInPlatformToken = tokenData.contractAddress === PLATFORM_TOKEN_CONTRACT ? balance : balance * exchangeRatePlatformToken.expectedRate;
          }

          sumOfBalances += balanceInDai;
          updatedTokensWithBalance[symbol] = {
            ...tokenData,
            balance,
            balanceInDai,
            balanceInPlatformToken,
          };
        }
      }));
      avgBalance = Number(parseFloat(sumOfBalances.toFixed(2)));
      if (avgBalance !== currentAvgBalance || Object.keys(currentBalances).length !== Object.keys(updatedTokensWithBalance).length) {
        shouldUpdateState = true;
      } else {
        for (const token of Object.entries(updatedTokensWithBalance)) {
          const [
            symbol,
            tokenInfo,
          ] = token;
          if (currentBalances[symbol].balance !== tokenInfo.balance) {
            shouldUpdateState = true;
          }
        }
      }
    } else {
      shouldUpdateState = true;
      avgBalance = 0;
    }
    /*
    * Temp fix for a race condition between componentDidMount and componentWillReceiveProps
    */
    let privacyModeEnabled = this.state.privacyModeEnabled;
    if (!privacyModeEnabled) {
      privacyModeEnabled = await this.haveAccessToAccounts() ? true : undefined;
    }
    if (shouldUpdateState) {
      this.setState({
        ...this.state,
        network,
        privacyModeEnabled,
        isReadOnlyMode: this.isReadOnlyMode(true, this.state.userIsLoggedIn, network, privacyModeEnabled),
        loadingBalances: false,
        loadingBalancesForNewUser: false,
        user: {
          ...this.state.user,
          balances: updatedTokensWithBalance,
          avgBalance: Number(parseFloat(sumOfBalances.toFixed(2))),
        },
      });
    }
  }

  isReadOnlyMode = (userHasMetamask, userIsLoggedIn, network, privacyModeEnabled) => !userHasMetamask || !userIsLoggedIn || !this.props.supportedNetworks.includes(network) || privacyModeEnabled === undefined

  updateStateWithUserInfo = (privacyModeEnabled, network, ethBalance, address, userIsLoggedIn, supportedTokensInfo) => {
    const {
      privacyModeEnabled: oldPrivacyModeEnabled,
      network: oldNetwork,
      user: oldUser,
    } = this.state;

    const {
      address: oldAddress,
    } = oldUser;

    const supportedTokens = supportedTokensInfo || this.props.supportedTokensInfo;

    if (supportedTokens) {
      this.fetchUserBalances(supportedTokens, ethBalance, address);
    }

    const addressChanged = oldUser.address !== address;
    if (oldPrivacyModeEnabled !== privacyModeEnabled || oldNetwork !== network || addressChanged) {
      this.setState({
        network,
        user: {
          ...this.state.user,
          address,
        },
        userHasMetamask: true,
        privacyModeEnabled,
        userIsLoggedIn,
        isReadOnlyMode: this.isReadOnlyMode(true, userIsLoggedIn, network, privacyModeEnabled),
        loadingBalancesForNewUser: addressChanged,
      });
    }
  }

  updateStateNoAccess = (privacyModeEnabled, network, userIsLoggedIn) => {
    const {
      privacyModeEnabled: oldPrivacyModeEnabled,
      network: oldNetwork,
      userIsLoggedIn: oldUserIsLoggedIn,
    } = this.state;

    if (oldPrivacyModeEnabled !== privacyModeEnabled || oldNetwork !== network || oldUserIsLoggedIn !== userIsLoggedIn) {
      this.setState({
        network,
        user: {},
        userHasMetamask: true,
        userIsLoggedIn,
        privacyModeEnabled,
        isReadOnlyMode: this.isReadOnlyMode(true, userIsLoggedIn, network, privacyModeEnabled),
      });
    }
  }

  getUserInfo = async (privacyModeEnabled, network, supportedTokensInfo) => {
    try {
      network = network || this.state.network;
      const accounts = await window.web3js.eth.getAccounts();
      const userIsLoggedIn = await this.checkIfLoggedIn();
      if (accounts && accounts.length > 0) {
        let ethBalance;
        while (!ethBalance) {
          ethBalance = await window.web3js.eth.getBalance(accounts[0]);
        }
        ethBalance = Number(window.web3js.utils.fromWei(ethBalance, 'ether'));

        this.updateStateWithUserInfo(privacyModeEnabled, network, ethBalance, accounts[0], userIsLoggedIn, supportedTokensInfo);
      } else {
        this.updateStateNoAccess(privacyModeEnabled, network, userIsLoggedIn);
      }
    } catch (err) {
      console.error(err);
      this.getUserInfo(privacyModeEnabled, network, supportedTokensInfo);
    }
  }

  async haveAccessToAccounts() {
    if (window.ethereum && this.props.userIsLoggedIn) {
      return true;
    } else if (window.ethereum) {
      ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(
          this.handleAddressChanged(),
          this.props.setUserIsLoggedIn(true)
          )
        .catch((error) => {
          if (error.code === 4001) {
            // EIP-1193 userRejectedRequest error
            console.log('Please connect to MetaMask.');
          } else {
            console.error(error);
          }
        });
    }

  }

  async userHasMetamask(privacyModeEnabled) {
    const network = await this.checkNetwork();
    const { setNetwork } = this.props;
    const { network: stateNetwork } = this.state;
    if (!stateNetwork && network && setNetwork) {
      setNetwork(network);
    }
    // subscribe to metamask updates
    // window.web3js.currentProvider.publicConfigStore.on('update', () => this.handleAddressChanged());
    ethereum.on('update', () => this.handleAddressChanged());

    await this.getUserInfo(privacyModeEnabled, network);
  }

  async handleAddressChanged() {
    const privacyModeEnabled = this.props.userIsLoggedIn;
    const network = await this.checkNetwork();
    this.getUserInfo(privacyModeEnabled, network);
  }

  async checkIfLoggedIn() {
    const { ethereum } = window;
    if (ethereum) {
      return await window.ethereum._metamask.isUnlocked();
    }

    const accounts = await window.web3js.eth.getAccounts();
    if (accounts && accounts.length > 0) {
      return true;
    }
    return false;
  }

  async checkNetwork() {
    let network = await window.web3js.eth.net.getNetworkType();
    if (network === 'main') {
      network = 'mainnet';
    }
    return network;
  }

  isBrowserSupported() {
    const browser = this.detect.detect();
    let extensionUrl;
    switch (browser.name) {
      case 'chrome':
        extensionUrl = METAMASK_CHROME;
        break;
      case 'opera':
        extensionUrl = METAMASK_OPERA;
        break;
      case 'firefox':
        extensionUrl = METAMASK_FIREFOX;
        break;
      default:
        break;
    }
    this.setState({
      isReadOnlyMode: true,
      userHasMetamask: false,
      userIsLoggedIn: false,
      loadingBalances: false,
      extensionUrl,
    });
  }

  render() {
    if (this.state.userHasMetamask === undefined || this.state.userIsLoggedIn === undefined) {
      return null;
    }

    return (
      <Provider value={this.state}>
        {this.props.children}
      </Provider>
    );
  }
}

MetamaskProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default withKyberContext(MetamaskProvider);
