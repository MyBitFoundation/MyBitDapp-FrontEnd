/* eslint-disable jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Switch,
  Icon,
} from 'antd';
import { withAssetsContext } from 'components/AssetsContext'
import Loading from 'components/Loading';
import {
  getValueFromLocalStorage,
  setValueLocalStorage,
} from 'utils/helpers';
import {
  FundingStages,
} from 'constants/fundingStages';
import { LocalStorageKeys } from 'constants/localStorageKeys';
import WatchListFilters from './watchListFilters';
import WatchListSwitch from './watchListSwitch';
import NoResults from 'components/NoResults';
import AssetDisplayer from 'components/AssetDisplayer';
import { DefaultAsset } from 'UI/Asset';
const assetsPerPage = 12;

class WatchListPage extends React.Component {
  state = {
    currentPage: 0,
    fundingActive: getValueFromLocalStorage(LocalStorageKeys.WATCH_LIST_FUNDING_ACTIVE, 'true') === 'true',
  };

  render = () => {
    const {
      assetsContext,
     } = this.props;

     const {
      loadingAssets,
      assets = [],
     } = assetsContext;

    if (loadingAssets) {
      return <Loading message="Loading Watch List" />;
    }

    const { currentPage, fundingActive } = this.state;
    let assetsFiltered = assets.slice();

    // filter by categories and whether active
    assetsFiltered = assetsFiltered.filter((asset) => {
      if (((fundingActive && asset.fundingStage === FundingStages.IN_PROGRESS && !asset.pastDate) || (!fundingActive && (asset.funded || asset.pastDate))) && asset.watchListed) {
        return true;
      }
      return false;
    });

    return (
      <React.Fragment>
        <WatchListFilters>
          <WatchListSwitch>
            <span>Funding Active</span>
            <Switch
              onChange={isFundingActive => {
                this.setState({ fundingActive: isFundingActive })
                setValueLocalStorage(LocalStorageKeys.WATCH_LIST_FUNDING_ACTIVE, isFundingActive)
              }}
              checked={fundingActive}
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
            />
          </WatchListSwitch>
        </WatchListFilters>
        <AssetDisplayer
          assets={assetsFiltered}
          assetToRender={DefaultAsset}
          addInvestmentLabel
        />
      </React.Fragment>
    );
  }
}

export default withAssetsContext(WatchListPage);
