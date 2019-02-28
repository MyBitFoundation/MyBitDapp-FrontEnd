/* eslint-disable  react/no-unused-state */
/* eslint-disable  camelcase */

import { compose } from 'recompose'
import Web3 from 'web3';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withAirtableContext } from 'components/Airtable';
import { withNotificationsContext } from 'components/Notifications';
import { withMetamaskContext } from 'components/MetamaskChecker';
import { withTokenPricesContext } from 'components/TokenPrices';
import * as Brain from '../apis/brain';

import {
  ErrorTypes,
  InternalLinks,
  NotificationTypes,
  NotificationsMetamask,
  NotificationStatus,
  MYBIT_TICKER_COINMARKETCAP,
  ETHEREUM_TICKER_COINMARKETCAP,
  FETCH_ASSETS_TIME,
  LOAD_METAMASK_USER_DETAILS_TIME,
  FETCH_TRANSACTION_HISTORY_TIME,
} from 'constants';

import {
  debug,
} from 'utils/helpers';

const { Provider, Consumer } = React.createContext({});

// Required so we can trigger getInitialProps in our exported pages
export const withBlockchainContext = (Component) => {
  return class Higher extends React.Component{
    static getInitialProps(ctx) {
      if(Component.getInitialProps)
        return Component.getInitialProps(ctx);
      else return {};
    }
    render(){
      return (
        <Consumer>
          {state => <Component {...this.props} blockchainContext={state} />}
        </Consumer>
      )
    }
  }
}

class BlockchainProvider extends React.Component {
  constructor(props) {
    super(props);
    this.fetchAssets = this.fetchAssets.bind(this);
    this.fetchTransactionHistory = this.fetchTransactionHistory.bind(this);
    this.fundAsset = this.fundAsset.bind(this);
    this.handleMetamaskUpdate = this.handleMetamaskUpdate.bind(this);
    this.handleAssetFavorited = this.handleAssetFavorited.bind(this);
    this.handleListAsset = this.handleListAsset.bind(this);
    this.withdrawInvestorProfit = this.withdrawInvestorProfit.bind(this);
    this.withdrawCollateral = this.withdrawCollateral.bind(this);
    this.withdrawProfitAssetManager = this.withdrawProfitAssetManager.bind(this);
    this.airtableContextUpdates = 0;
    this.state = {
      loading: {
        assets: true,
        transactionHistory: true,
      },
      transactions: [],
      assets: [],
      fetchAssets: this.fetchAssets,
      fetchTransactionHistory: this.fetchTransactionHistory,
      fundAsset: this.fundAsset,
      handleAssetFavorited: this.handleAssetFavorited,
      handleListAsset: this.handleListAsset,
      withdrawInvestorProfit: this.withdrawInvestorProfit,
      withdrawCollateral: this.withdrawCollateral,
      withdrawProfitAssetManager: this.withdrawProfitAssetManager,
      isUserContributing: false,
      withdrawingAssetIds: [],
      withdrawingCollateral: [],
      withdrawingAssetManager: [],
      isLoadingUserInfo: false,
    };
  }

  componentDidMount = async () => {
    try {
      this.fetchAssets();
      this.fetchTransactionHistory();

    } catch (err) {
      debug(err);
    }
    this.createIntervals();
  }

  // handle case where account, login or enabled variable change
  componentDidUpdate = (prevProps) => {
    const {
      metamaskContext: oldProps,
    } = prevProps;

    const {
      metamaskContext: newProps,
    } = this.props;

    const oldEnabled = oldProps.privacyModeEnabled;
    const oldUsername = oldProps.user.address;
    const oldUserIsLoggedIn = oldProps.userIsLoggedIn;

    const newUserAddress = newProps.user.address;
    const newIsUserLoggedIn = newProps.userIsLoggedIn;
    const newEnabled = newProps.privacyModeEnabled;

    if((newUserAddress && (oldUsername !== newUserAddress)) || (oldUserIsLoggedIn !== newIsUserLoggedIn) || (oldEnabled !== newEnabled)){
      console.log("Updating assets due to a change in: address or login or privacy mode")
      this.handleMetamaskUpdate();
    }
  }

  componentWillUnmount = () => {
    this.resetIntervals();
  }

  createIntervals = () => {
    this.intervalFetchAssets =
      setInterval(this.fetchAssets, FETCH_ASSETS_TIME);
    this.intervalFetchTransactionHistory =
      setInterval(this.fetchTransactionHistory, FETCH_TRANSACTION_HISTORY_TIME);
  }

  resetIntervals = () => {
    clearInterval(this.intervalFetchAssets);
    clearInterval(this.intervalFetchTransactionHistory);
  }

  pullFileInfoForAssets = async (assets) => {
    try{
      const response = await axios(InternalLinks.S3_ASSET_FILES);

      const filesByassetId = response.data.filesByAssetId;

      for(const asset of assets){
        const assetId = asset.assetId;
        if(filesByassetId[assetId]){
          asset.files = filesByassetId[assetId];
        }
      }
      return assets;
    }catch(err){
      debug("Error pulling files from server");
      debug(err)
      return assets;
    }
  }

  withdrawProfitAssetManager = async (asset, amount) => {
    const {
      assetId,
      name: assetName,
    } = asset;

    const {
      buildNotification,
    } = this.props.notificationsContext;

    const notificationId = Date.now();

    //update state so users can't trigger the withdrawal multiple times
    const withdrawingAssetManager = this.state.withdrawingAssetManager.slice();
    withdrawingAssetManager.push(assetId);
    this.setState({
      withdrawingAssetManager,
    });

    buildNotification(notificationId, NotificationTypes.METAMASK, NotificationStatus.INFO, {
      operationType: NotificationsMetamask.WITHDRAW_MANAGER,
      assetName,
    });

    const onTransactionHash = () => {
      buildNotification(notificationId, NotificationTypes.WITHDRAW_MANAGER, NotificationStatus.INFO, {
        assetName,
      });
    }

    const onReceipt = (wasSuccessful) => {
      if(wasSuccessful){
        onSuccess();
      } else{
        onError(ErrorTypes.ETHEREUM);
      }
    }

    const onError = (type) => {
      updatewithdrawingAssetManager();
      if(type === ErrorTypes.METAMASK){
        buildNotification(notificationId, NotificationTypes.METAMASK, NotificationStatus.ERROR, {
          operationType: NotificationsMetamask.WITHDRAW_MANAGER,
          assetName,
        });
      } else {
        buildNotification(notificationId, NotificationTypes.WITHDRAW_MANAGER, NotificationStatus.ERROR, {
          assetName,
        });
      }
    }

    const updatewithdrawingAssetManager = () => {
      let withdrawingAssetManager = this.state.withdrawingAssetManager.slice();
      withdrawingAssetManager = withdrawingAssetManager.filter(assetIdTmp => assetIdTmp !== assetId);
      this.setState({
        withdrawingAssetManager,
      });
    }

    const onSuccess = () => {
      updatewithdrawingAssetManager();
      buildNotification(notificationId, NotificationTypes.WITHDRAW_MANAGER, NotificationStatus.SUCCESS, {
        assetName,
        amount,
      });
    }

    await Brain.withdrawAssetManager(
      this.props.metamaskContext.user.address,
      assetId,
      onTransactionHash,
      onReceipt,
      onError,
    );
  }

  withdrawCollateral = async (asset, percentage, amount, updateAssetCollateralPage) => {
    const {
      assetId,
      name: assetName,
    } = asset;

    const {
      buildNotification,
    } = this.props.notificationsContext;

    const notificationId = Date.now();

    //update state so users can't trigger the withdrawal multiple times
    const withdrawingCollateral = this.state.withdrawingCollateral.slice();
    withdrawingCollateral.push(assetId);
    this.setState({
      withdrawingCollateral,
    });

    buildNotification(notificationId, NotificationTypes.METAMASK, NotificationStatus.INFO, {
      operationType: NotificationsMetamask.WITHDRAW_COLLATERAL,
      assetName,
    });

    const onTransactionHash = () => {
      buildNotification(notificationId, NotificationTypes.WITHDRAW_COLLATERAL, NotificationStatus.INFO, {
        assetName,
      });
    }

    const onReceipt = (wasSuccessful) => {
      if(wasSuccessful){
        onSuccess();
      } else{
        onError(ErrorTypes.ETHEREUM);
      }
    }

    const onError = (type) => {
      updateWithdrawingCollateral();
      if(type === ErrorTypes.METAMASK){
        buildNotification(notificationId, NotificationTypes.METAMASK, NotificationStatus.ERROR, {
          operationType: NotificationsMetamask.WITHDRAW_COLLATERAL,
          assetName,
        });
      } else {
        buildNotification(notificationId, NotificationTypes.WITHDRAW_COLLATERAL, NotificationStatus.ERROR, {
          assetName,
        });
      }
    }

    const updateWithdrawingCollateral = () => {
      let withdrawingCollateral = this.state.withdrawingCollateral.slice();
      withdrawingCollateral = withdrawingCollateral.filter(assetIdTmp => assetIdTmp !== assetId);
      this.setState({
        withdrawingCollateral,
      });
    }

    const onSuccess = () => {
      updateWithdrawingCollateral();
      buildNotification(notificationId, NotificationTypes.WITHDRAW_COLLATERAL, NotificationStatus.SUCCESS, {
        assetName,
        percentage,
        amount,
      });
    }

    await Brain.withdrawEscrow(
      this.props.metamaskContext.user.address,
      assetId,
      onTransactionHash,
      onReceipt,
      onError,
    );

  }

  handleListAsset = async (formData, setUserListingAsset) => {
    const {
      asset: assetName,
      userCountry: country,
      userCity: city,
      managementFee,
      category,
      fileList,
      collateralMyb,
      collateralPercentage
    } = formData;

    const {
      categoriesAirTable,
    } = this.props.airtableContext;

    const {
      buildNotification,
    } = this.props.notificationsContext;

    const userAddress =  this.props.metamaskContext.user.address;
    const notificationId = Date.now();

    buildNotification(notificationId, NotificationTypes.METAMASK, NotificationStatus.INFO, {
      operationType: NotificationsMetamask.LIST_ASSET,
      assetName,
    });

    const onTransactionHash = () => {
      buildNotification(notificationId, NotificationTypes.LIST_ASSET, NotificationStatus.INFO, {
        assetName,
      });
    }

    const onReceipt = (wasSuccessful, assetId) => {
      if(wasSuccessful){
        onSuccess(assetId);
      } else{
        onError(ErrorTypes.ETHEREUM);
      }
    }

    const onSuccess = async (assetId) => {
      const {
        airtableContext,
      } = this.props;
      console.log("here0")
      const numberOfInternalActions = 2;
      const numberOfInternalActionsWithFileUpload = numberOfInternalActions + 1;
      const filesUploaded = fileList.length > 0;
      const requiredCallsToInternalActions = filesUploaded ? numberOfInternalActionsWithFileUpload : numberOfInternalActions;
      let counterCallsToInternalActions = 0;

      // we need to perform a few actions before declaring the listing of the asset as successful
      const performInternalAction = async () => {
        counterCallsToInternalActions++;
        if(counterCallsToInternalActions === requiredCallsToInternalActions){
          console.log("here")
          await airtableContext.forceRefresh();
          console.log("here2")
          await this.fetchAssets();
          console.log("here3")
          buildNotification(notificationId, NotificationTypes.LIST_ASSET, NotificationStatus.SUCCESS, {
            assetName,
            assetId,
          });
          setUserListingAsset(false, assetId);
        }
      }

      const collateral = window.web3js.utils.toWei(collateralMyb.toString(), 'ether');

      Brain.updateAirTableWithNewAsset(assetId, assetName, country, city, collateralMyb, collateralPercentage, performInternalAction)
      Brain.createEntryForNewCollateral(userAddress, collateral, assetId, performInternalAction);
      filesUploaded && Brain.uploadFilesToAWS(assetId, fileList, performInternalAction);
    }

    const onError = (type) => {
      setUserListingAsset(false);
      if(type === ErrorTypes.METAMASK){
        buildNotification(notificationId, NotificationTypes.METAMASK, NotificationStatus.ERROR, {
          assetName,
          operationType: NotificationsMetamask.LIST_ASSET,
        });
      } else {
        buildNotification(notificationId, NotificationTypes.LIST_ASSET, NotificationStatus.ERROR, {
          assetName,
        });
      }
    }

    const {
      getAssetByName,
      assetsAirTable,
    } = this.props.airtableContext;

    await Brain.createAsset(onTransactionHash, onReceipt, onError, {
      managerPercentage: managementFee,
      assetType: categoriesAirTable[category].encoded,
      amountToBeRaisedInUSD: getAssetByName(assetName, assetsAirTable).amountToBeRaisedInUSDAirtable,
      assetName,
      country,
      city,
      fileList,
      collateralMyb,
      collateralPercentage,
      userAddress,
    });
  }

  fundAsset(assetId, amount, onSuccessConfirmationPopup, onFailureContributionPopup, amountDollars) {
    try {
      const currentAsset = this.state.assets.find(item => item.assetId === assetId);
      const notificationId = Date.now();
      const {
        name : assetName,
      } = currentAsset;

      const {
        buildNotification,
      } = this.props.notificationsContext;

      buildNotification(notificationId, NotificationTypes.METAMASK, NotificationStatus.INFO, {
        operationType: NotificationsMetamask.FUNDING,
        assetName,
      });

      const onTransactionHash = () => {
        buildNotification(notificationId, NotificationTypes.FUNDING, NotificationStatus.INFO, {
          assetName,
          amount: amountDollars,
        });
      }

      const onReceipt = (wasSuccessful) => {
        if(wasSuccessful){
          onSuccessRefreshData();
        } else {
          onError(ErrorTypes.ETHEREUM)
        }
      }

      const onError = (type) => {
        onFailureContributionPopup();
        if(type === ErrorTypes.METAMASK){
          buildNotification(notificationId, NotificationTypes.METAMASK, NotificationStatus.ERROR, {
            operationType: NotificationsMetamask.FUNDING,
          });
        } else {
          buildNotification(notificationId, NotificationTypes.FUNDING, NotificationStatus.ERROR, {
            assetName,
          });
        }
      }

      const onSuccessRefreshData = async () => {
        await Promise.all([this.fetchAssets(), this.fetchTransactionHistory()]);
        onSuccessConfirmationPopup();
        buildNotification(notificationId, NotificationTypes.FUNDING, NotificationStatus.SUCCESS, {
          assetName,
          amount: amountDollars,
        });
      }

      Brain.fundAsset(
        this.props.metamaskContext.user.address,
        assetId,
        amount,
        onTransactionHash,
        onReceipt,
        onError,
      );

    } catch (err) {
      debug(err);
    }
  }

  withdrawInvestorProfit = async (assetId, amount) => {
    try {
      const currentAsset = this.state.assets.find(item => item.assetId === assetId);
      const{
        name: assetName,
      } = currentAsset;

      const {
        buildNotification,
      } = this.props.notificationsContext;

      const notificationId = Date.now();

      // save the the assetId so the user doesn't trigger twice while we
      // perform the action
      const withdrawingAssetIds = this.state.withdrawingAssetIds.slice();
      withdrawingAssetIds.push(assetId);
      this.setState({
        withdrawingAssetIds,
      })

      buildNotification(notificationId, NotificationTypes.METAMASK, NotificationStatus.INFO, {
        operationType: NotificationsMetamask.WITHDRAW_INVESTOR,
        assetName,
      });

      const onTransactionHash = () => {
        buildNotification(notificationId, NotificationTypes.WITHDRAW_INVESTOR, NotificationStatus.INFO, {
          assetName,
          amount,
        });
      }

      const onReceipt = (wasSuccessful) => {
        if(wasSuccessful){
          onSuccessRefreshData();
        } else {
          onError(ErrorTypes.ETHEREUM);
        }
      }

      const onError = (type) => {
        removeassetIdFromList();
        if(type === ErrorTypes.METAMASK){
          buildNotification(notificationId, NotificationTypes.METAMASK, NotificationStatus.ERROR, {
            operationType: NotificationsMetamask.WITHDRAW_INVESTOR,
          });
        } else {
          buildNotification(notificationId, NotificationTypes.WITHDRAW_INVESTOR, NotificationStatus.ERROR, {
            assetName,
          });
        }
      }

      const removeassetIdFromList = () => {
        let withdrawingAssetIds = this.state.withdrawingAssetIds.slice();
        withdrawingAssetIds = withdrawingAssetIds.filter(assetIdTmp => assetIdTmp !== assetId);
        this.setState({
          withdrawingAssetIds,
        })
      }

      const onSuccessRefreshData = async () => {
        await Promise.all([this.fetchAssets(), this.fetchTransactionHistory()]);
        removeassetIdFromList();
        buildNotification(notificationId, NotificationTypes.WITHDRAW_INVESTOR, NotificationStatus.SUCCESS, {
          assetName,
          amount,
        });
      }

      await Brain.withdrawInvestorProfit(
        this.props.metamaskContext.user.address,
        currentAsset.assetId,
        onTransactionHash,
        onReceipt,
        onError,
      );

    } catch (err) {
      debug(err);
    }
  }

  handleAssetFavorited = (assetId) => {
    const searchQuery = `mybit_watchlist_${assetId}`;
    const alreadyFavorite = window.localStorage.getItem(searchQuery) === 'true';
    if (alreadyFavorite) {
      localStorage.removeItem(searchQuery);
    } else {
      localStorage.setItem(searchQuery, true);
    }

    const assets = this.state.assets.slice();
    const asset = assets.filter(assetToFilter => assetToFilter.assetId === assetId)[0];

    asset.watchListed = !alreadyFavorite;

    this.setState({
      assets,
    });
  }

  resetNotifications = () => {
    this.setState({
      notifications: [],
    });
  }

  handleMetamaskUpdate = async () => {
    const {
      userIsLoggedIn,
    } = this.state;

    this.fetchAssets();
    this.fetchTransactionHistory();
    this.resetNotifications();

    this.setState({
      loading: {
        ...this.state.loading,
        userAssetsInfo: true,
        transactionHistory: !userIsLoggedIn ? false : true,
      },
    });
  }

  fetchTransactionHistory = async () =>  {
    if(!this.props.metamaskContext.user.address){
      this.setState({
        transactions: [],
        loading: {
          ...this.state.loading,
          transactionHistory: false,
        },
      })
      return;
    }
    await Brain.fetchTransactionHistory(this.props.metamaskContext.user.address)
      .then((response) => {
        this.setState({
          transactions: response,
          loading: { ...this.state.loading, transactionHistory: false },
        });
      })
      .catch((err) => {
        debug(err);
        if (this.state.userIsLoggedIn) {
          setTimeout(this.fetchTransactionHistory, 5000);
        }
      });
  }

  fetchAssets = async () => {
    const {
      pricesContext,
      metamaskContext,
    } = this.props;

    const {
      user,
      userIsLoggedIn,
    } = metamaskContext;

    const {
      prices,
    } = pricesContext;

    const {
      categoriesAirTable,
      assetsAirTableById,
    } = this.props.airtableContext;

    if (!prices.ethereum || !assetsAirTableById || !categoriesAirTable) {
      setTimeout(this.fetchAssets, 2000);
      return;
    }

    console.log("Going to fetch assets")
    await Brain.fetchAssets(user.address, prices.ethereum.price, assetsAirTableById, categoriesAirTable)
      .then( async (response) => {
        const updatedAssets = await this.pullFileInfoForAssets(response);
        console.log("updating state with new assets")
        this.setState({
          assets: updatedAssets,
          loading: {
            ...this.state.loading,
            assets: false,
            userAssetsInfo: false,
          },
        });
      })
      .catch((err) => {
        console.log(err)
        debug(err);
        if (userIsLoggedIn) {
          setTimeout(this.fetchAssets, 5000);
        }
      });
  }

  render = () => {
    console.log("Rerendering blockchain")
    return (
      <Provider value={this.state}>
        {this.props.children}
      </Provider>
    );
  }
}

BlockchainProvider.defaultProps = {
  isBraveBrowser: false,
  isLoggedIn: false,
  network: undefined,
  isMetamaskInstalled: false,
  extensionUrl: undefined,
};

BlockchainProvider.propTypes = {
  children: PropTypes.node.isRequired,
  isMetamaskInstalled: PropTypes.bool,
  network: PropTypes.string,
  isBraveBrowser: PropTypes.bool,
  extensionUrl: PropTypes.string,
  isLoggedIn: PropTypes.bool,
};

const enhance = compose(
  withNotificationsContext,
  withMetamaskContext,
  withTokenPricesContext,
  withAirtableContext,
);

export default enhance(BlockchainProvider);