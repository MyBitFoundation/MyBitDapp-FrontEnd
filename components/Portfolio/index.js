import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Router from 'next/router';
import {
  Button,
} from 'antd';
import ValueDisplay from 'UI/ValueDisplay';
import { PortfolioAsset, ManagedAsset } from 'UI/Asset';
import PieChart from 'static/chart-pie.svg';
import LineChart from 'static/chart-line.svg';
import Sliders from 'static/sliders.svg';
import RealisedProfit from 'static/realised-profit.svg';
import UnrealisedProfit from 'static/unrealised-profit.svg';
import {
  formatMonetaryValue,
  fromWeiToEth,
} from 'utils/helpers';
import {
  PortfolioTypes,
} from 'constants/portfolioTypes';
import PortfolioPageValueDisplays from './portfolioPageValueDisplays';
import PortfolioPageNavButtons from './portfolioPageNavButtons';
import PortfolioPageExplore from './portfolioPageExplore';
import Loading from 'components/Loading';
import ErrorPage from 'components/ErrorPage';
import Pagination from 'components/AssetDisplayer/pagination';

const ButtonGroup = Button.Group;
const assetsPerPage = 6;

class PortfolioPage extends React.Component {
  state = {
    currentPage: 0,
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.type !== this.props.type) {
      this.setState({ currentPage: 0 });
    }
  }

  render = () => {
    const {
      loading,
      portfolioData,
      withdrawInvestorProfit,
      withdrawingAssetIds,
      payoutAsset,
      callingPayout,
      type,
    } = this.props;

    const {
      currentPage,
    } = this.state;

    if (loading) {
      return <Loading message="Loading Portfolio" />;
    }

    const {
      assets,
      stats,
    } = portfolioData;

    const {
      unrealisedProfitInvestor,
      unrealisedProfitManager,
      realisedProfitInvestor,
      realisedProfitManager,
      totalAssetValue,
      totalAssetRevenue,
    } = stats;

    const currentView = type;

    const assetsToRender = currentView === PortfolioTypes.INVESTMENTS
      ? assets.filter(assetFinantialDetails => assetFinantialDetails.investmentDetails || false) : assets.filter(assetFinantialDetails => assetFinantialDetails.managerDetails || false);

    let AssetToRender = PortfolioAsset;
    if (currentView === PortfolioTypes.MANAGED_ASSETS) {
      AssetToRender = ManagedAsset;
    }

    // slice results for pagination
    const startIndex = currentPage * assetsPerPage;
    const endIndex = (currentPage + 1) * assetsPerPage;
    const assetsToDisplay = assetsToRender.slice(startIndex, endIndex);

    const error = assetsToRender.length === 0 && (
    <ErrorPage
      title="Empty Portfolio"
      description={currentView === PortfolioTypes.MANAGED_ASSETS
        ? (
          <span>You don't manage any assets yet. Click{' '}
            <Link href="/list-asset">
                    here
            </Link>{' '}to list an asset.
          </span>
        )
        : 'You haven\'t invested in any assets yet.'}
    />
    );

    return (
      <div>
        <PortfolioPageValueDisplays
          isManagedPage={currentView === 'managed-assets'}
        >
          <PortfolioPageNavButtons>
            <ButtonGroup size="large">
              <Button
                onClick={() => Router.push(`/portfolio?type=${PortfolioTypes.INVESTMENTS}`, `/portfolio/${PortfolioTypes.INVESTMENTS}`)}
                type={currentView === PortfolioTypes.INVESTMENTS ? 'primary' : 'secondary'}
              >Investments</Button>
              <Button
                onClick={() => Router.push(`/portfolio?type=${PortfolioTypes.MANAGED_ASSETS}`, `/portfolio/${PortfolioTypes.MANAGED_ASSETS}`)}
                type={currentView === PortfolioTypes.MANAGED_ASSETS ? 'primary' : 'secondary'}
              >Managed assets</Button>
            </ButtonGroup>
          </PortfolioPageNavButtons>
          <ValueDisplay
            text={currentView === PortfolioTypes.MANAGED_ASSETS ? 'Total Portfolio Revenue' : 'Total Portfolio Value'}
            value={formatMonetaryValue(currentView === PortfolioTypes.MANAGED_ASSETS ? stats.totalAssetRevenue : stats.totalAssetValue)}
            icon={currentView === PortfolioTypes.MANAGED_ASSETS ? <LineChart /> : <PieChart />}
            hasSeparator
            hasIcon
            hasShadow
            isBlue={currentView === PortfolioTypes.INVESTMENTS}
            isGreen={currentView === PortfolioTypes.MANAGED_ASSETS}
            coloredBackground
            customClassName="PortfolioPage__ValueDisplay--is-valueOrRevenue"
          />
          <ValueDisplay
            text="Unrealised Profit"
            value={formatMonetaryValue(currentView === PortfolioTypes.MANAGED_ASSETS ? unrealisedProfitManager : unrealisedProfitInvestor)}
            icon={<UnrealisedProfit />}
            hasSeparator
            hasIcon
            hasShadow
            isBlue
            coloredBackground
            customClassName="PortfolioPage__ValueDisplay--is-unrealisedProfit"
          />
          <ValueDisplay
            text="Realised Profit"
            value={formatMonetaryValue(currentView === PortfolioTypes.MANAGED_ASSETS ? realisedProfitManager : realisedProfitInvestor)}
            icon={<RealisedProfit />}
            hasSeparator
            hasIcon
            hasShadow
            isGreen
            coloredBackground
            customClassName="PortfolioPage__ValueDisplay--is-realisedProfit"
          />
        </PortfolioPageValueDisplays>
        {assetsToDisplay.length > 0 && (
          <React.Fragment>
            <PortfolioPageExplore>
              {assetsToDisplay.map(asset => (
                <AssetToRender
                  {...asset.managerDetails}
                  {...asset.investmentDetails}
                  key={asset.assetId}
                  withdrawInvestorProfit={withdrawInvestorProfit}
                  withdrawing={withdrawingAssetIds.includes(asset.assetId)}
                  callingPayout={callingPayout.includes(asset.assetId)}
                  payoutAsset={payoutAsset}
                />
              ))}
            </PortfolioPageExplore>
            <Pagination
              onChange={newPage => this.setState({ currentPage: newPage - 1 })}
              total={assetsToRender.length}
              current={currentPage + 1}
              pageSize={assetsPerPage}
              defaultCurrent={1}
            />
          </React.Fragment>
        )}
        {error && error}
      </div>
    );
  }
}

export default PortfolioPage;
