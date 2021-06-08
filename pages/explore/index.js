import { compose } from 'recompose';
import { withMetamaskContextPageWrapper } from 'components/MetamaskContext';
import { withAssetsContextPageWrapper } from 'components/AssetsContext';
import { LocalStorageKeys } from 'constants/localStorageKeys';
import {
  getValueFromLocalStorage,
} from 'utils/helpers';
import AssetExplorer from 'components/AssetExplorer';
import Loading from 'components/Loading';
import { METAMASK_ERRORS } from 'components/MetamaskContext/constants';
import MetamaskErrors from 'components/MetamaskErrors';

const Explore = ({
  assetsContext,
  metamaskContext,
}) => {
  const {
    assets,
    loadingAssets,
  } = assetsContext;

  const hasMetamaskErrors = metamaskContext.metamaskErrors();
  if (loadingAssets) {
    return <Loading message="Loading assets" />;
  }
  return (
    <AssetExplorer
      assets={assets}
      EXPLORE_PAGE_FUNDING_ACTIVE={LocalStorageKeys.EXPLORE_PAGE_FUNDING_ACTIVE}
      EXPLORE_PAGE_SORT_BY={LocalStorageKeys.EXPLORE_PAGE_SORT_BY}
      EXPLORE_PAGE_SELECTED_FILTERS={LocalStorageKeys.EXPLORE_PAGE_SELECTED_FILTERS}
      useLocalStorage
    />
  );
};

const enhance = compose(
  withAssetsContextPageWrapper,
  withMetamaskContextPageWrapper,
);

export default enhance(Explore);
