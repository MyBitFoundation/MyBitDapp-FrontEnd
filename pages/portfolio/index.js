import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import {
  Button,
} from 'antd';
import Loading from 'components/Loading';
import { withBlockchainContext } from 'components/Blockchain'
import { withMetamaskContext } from 'components/MetamaskChecker'
import { withTokenPricesContext } from 'components/TokenPrices'
import ValueDisplay from 'ui/ValueDisplay';
import Asset from 'ui/Asset/';
import PieChart from 'static/chart-pie.svg';
import LineChart from 'static/chart-line.svg';
import Sliders from 'static/sliders.svg';
import {
  formatMonetaryValue,
  fromWeiToEth,
} from 'utils/helpers';
import StyledPortfolioPageValueDisplays from './styledPortfolioPageValueDisplays';
import StyledPortfolioPageNavButtons from './styledPortfolioPageNavButtons';
import StyledPortfolioPageExplore from './styledPortfolioPageExplore';

const ButtonGroup = Button.Group;

const getAllUserAssets = (assets, address, currentEthPrice) =>
  assets
    .filter(asset => (asset.ownershipUnits !== '0' || asset.isAssetManager))

const calculateAssetValue = (currentValue, asset, currentEthPrice) => {
  if(asset.ownershipUnits !== '0'){
    currentValue += fromWeiToEth(asset.ownershipUnits) * currentEthPrice;
  } else if(asset.isAssetManager){
    currentValue += asset.amountToBeRaisedInUSD;
  }
  return currentValue;
}

const calculateAssetRevenue = (currentValue, asset, currentEthPrice) => {
  const investorRevenue = ((fromWeiToEth(asset.ownershipUnits) * currentEthPrice) /
      asset.amountToBeRaisedInUSD) * asset.assetIncome;

  const assetManagerRevenue = asset.isAssetManager ? (asset.managerPercentage / 100) * asset.assetIncome : 0;

  // note: an asset manager can invest in its own assets
  return currentValue + investorRevenue + assetManagerRevenue;
}

const getInvestmentDetailsFromAsset = (asset, currentEthPrice) => {
  const { 
    assetId,
    name,
    amountToBeRaisedInUSD,
    amountRaisedInUSD,
    owedToInvestor,
    assetIncome,
    ownershipUnits,
  } = asset;

  const ownership = (
      ((fromWeiToEth(ownershipUnits) * currentEthPrice) /
        amountToBeRaisedInUSD) * 100)

  if(ownership === 0){
    return null;
  }

  if (ownership > 100) {
    ownership = 100;
  }

  const unrealizedProfit = fromWeiToEth(owedToInvestor) * currentEthPrice;
  const totalProfit = (ownership / 100) * assetIncome;

  return {
    ...asset,
    totalProfit,
    ownership,
    unrealizedProfit,
  };
}

const getManagerDetailsFromAsset = (asset, currentEthPrice) => {
  if(!asset.isAssetManager){
    return null;
  }
  const {
    ownershipUnits,
    amountToBeRaisedInUSD,
    managerPercentage,
    managerTotalIncome,
    managerTotalWithdrawn,
    assetIncome,
  } = asset;

  const profit =
    ((fromWeiToEth(ownershipUnits) * currentEthPrice) /
      amountToBeRaisedInUSD) * assetIncome;

  const totalProfitAssetManager = assetIncome * (managerPercentage / 100);

  return {
    ...asset,
    profit,
    totalProfitAssetManager,
    toWithdraw: (fromWeiToEth(managerTotalIncome.toString()) * currentEthPrice) - (0 * currentEthPrice) ,
  };
}

const getPortfolioAssetDetails = (assets, currentEthPrice) => {
  let totalAssetRevenue = 0;
  let totalAssetValue = 0;
  let totalManagementProfit = 0;
  return assets.map(asset => {
    totalAssetValue = calculateAssetValue(totalAssetValue, asset, currentEthPrice);
    totalAssetRevenue = calculateAssetRevenue(totalAssetRevenue, asset, currentEthPrice);
    const managerDetails = getManagerDetailsFromAsset(asset, currentEthPrice);
    totalManagementProfit += asset.isAssetManager ? managerDetails.totalProfitAssetManager : 0;

    return {
      investmentDetails: getInvestmentDetailsFromAsset(asset, currentEthPrice),
      managerDetails,
      totalAssetValue,
      totalAssetRevenue,
      totalManagementProfit,
      assetId: asset.assetId,
    }
  })
}

class PortfolioPage extends React.Component {
  constructor(props) {
    super(props);
    this.displayOwned = this.displayOwned.bind(this);
    this.displayManaged = this.displayManaged.bind(this);
    this.state = {
      currentView: "portfolioManaged",
    };
  }

  displayOwned() {
    this.setState({ currentView: "portfolioInvestment" });
  }

  displayManaged() {
    this.setState({ currentView: "portfolioManaged" });
  }

  render() {
    const {
      blockchainContext,
      metamaskContext,
      pricesContext,
    } = this.props;

    const {
      loading,
      assets,
      withdrawInvestorProfit,
      withdrawingAssetIds,
    } = blockchainContext;

    const {
      user,
    } = metamaskContext;

    const {
      prices,
      loading: pricesLoading,
    } = pricesContext;

    const { currentView } = this.state;

    if (loading.assets || pricesLoading || loading.userAssetsInfo) {
      return <Loading message="Loading portfolio" />;
    }

    const { ethereum } = prices;
    const ownedAssets = getAllUserAssets(assets, user.address);
    const processedFinantialDetails = getPortfolioAssetDetails(ownedAssets, ethereum.price);

    const assetsToRender = currentView === 'portfolioInvestment' ?
      processedFinantialDetails.filter(assetFinantialDetails =>
        assetFinantialDetails.investmentDetails || false
      ) : processedFinantialDetails.filter(assetFinantialDetails =>
        assetFinantialDetails.managerDetails || false
      )

    return (
      <div>
        <StyledPortfolioPageValueDisplays
          isManagedPage={currentView === 'portfolioManaged'}
        >
          <StyledPortfolioPageNavButtons>
            <ButtonGroup size="large">
              <Button onClick={this.displayOwned}
                type={currentView === "portfolioInvestment" ? "primary" : "secondary"}>Investments</Button>
              <Button onClick={this.displayManaged}
                type={currentView === "portfolioManaged" ? "primary" : "secondary"}>Managed assets</Button>
            </ButtonGroup>
          </StyledPortfolioPageNavButtons>
          <ValueDisplay
            text="Total Portfolio Value"
            value={formatMonetaryValue(assetsToRender.length > 0 ? assetsToRender[assetsToRender.length - 1].totalAssetValue : 0)}
            icon={<PieChart />}
            hasSeparator
            hasIcon
            hasShadow
            isBlue
            coloredBackground
            customClassName="PortfolioPage__ValueDisplay--is-portfolioRevenue"
          />
          <ValueDisplay
            text="Total Revenue"
            value={formatMonetaryValue(assetsToRender.length > 0 ? assetsToRender[assetsToRender.length - 1].totalAssetRevenue : 0)}
            icon={<LineChart />}
            hasSeparator
            hasIcon
            hasShadow
            isGreen
            coloredBackground
            customClassName="PortfolioPage__ValueDisplay--is-totalRevenue"
          />
          {currentView === 'portfolioManaged' && (
            <ValueDisplay
              text="Total Management Profit"
              value={formatMonetaryValue(assetsToRender.length > 0 ? assetsToRender[assetsToRender.length - 1].totalManagementProfit : 0)}
              icon={<Sliders />}
              hasSeparator
              hasIcon
              hasShadow
              isBlue
              coloredBackground
              customClassName="PortfolioPage__ValueDisplay--is-managementProfit"
            />
          )}
        </StyledPortfolioPageValueDisplays>
        {assetsToRender.length > 0 && (
          <StyledPortfolioPageExplore>
            {assetsToRender.map(asset =>
              <Asset
                type={currentView}
                {...asset.managerDetails}
                {...asset.investmentDetails}
                key={asset.assetId}
                withdrawInvestorProfit={withdrawInvestorProfit}
                withdrawing={withdrawingAssetIds.includes(asset.assetId)}
              />
            )}
          </StyledPortfolioPageExplore>
        )}
      </div>
    );
  }
};

PortfolioPage.propTypes = {
  loading: PropTypes.shape({}).isRequired,
  assets: PropTypes.arrayOf(PropTypes.object).isRequired,
  prices: PropTypes.shape({}).isRequired,
};

const enhance = compose(
  withMetamaskContext,
  withBlockchainContext,
  withTokenPricesContext,
);

export default enhance(PortfolioPage);