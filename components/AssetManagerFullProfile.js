import styled from 'styled-components';
import Media from 'react-media';
import AssetExplorer from 'components/AssetExplorer';
import Loading from 'components/Loading';
import AssetManagerProfile from 'UI/AssetManagerProfile';
import ThreeBoxProfile from 'components/ThreeBoxProfile';
import Theming from 'components/Theme/theming';
import {
  ExternalLinks,
} from 'constants/links';
import { Sizes } from 'components/Theme/mediaQueries';
import Divider from 'UI/Divider';
import GoBackTextAndArrow from 'components/GoBackTextAndArrow';
import {
  formatMonetaryValue,
  shortenAddress,
} from 'utils/helpers';
import { getPlatformToken } from 'constants/app';
import ErrorPage from 'components/ErrorPage';
import PageTitle from 'UI/PageTitle';

const Colors = Theming.colors;

const ProfileWrapper = styled.div`
  background-color: #FFFFFF;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.12), 0px 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 0px 0px 4px 4px;
  ${({ theme }) => theme.tablet`
    width: 650px;
  `}
  margin: 0 auto;
  padding: 10px;
`;

const Title = styled.p`
  font-weight: bold;
  font-size: 20px;
  line-height: 24px;
`;

const AddressWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  ${({ theme }) => theme.mobileM`
    font-size: 16px;
  `}

  span, a {
    position: relative;
    top: 2px;
  }
`;

const ThreeBoxProfileWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const AssetManagerFullProfile = ({
  assetsContext,
  metamaskContext,
  managerAddress,
}) => {
  const {
    loadingAssets,
    assets,
    assetManagers,
  } = assetsContext;

  const {
    network,
    user,
  } = metamaskContext;

  if (loadingAssets) {
    return (
      <Loading
        message="Loading Asset Manager"
        hasBackButton
      />
    );
  }

  const assetManager = assetManagers[managerAddress];
  if (!assetManager) {
    return (
      <ErrorPage
        title="Asset Manager not found"
        description={`No assets have ever been listed by an Asset Manager with the provided address: ${managerAddress}`}
        href="/asset-managers"
        hasBackButton
      />
    );
  }

  const assetsByManager = assets.filter(asset => asset.assetManager === managerAddress);

  // if the asset manager does not have any live assets, then show all the funded assets instead
  const fundingActive = assetsByManager.find(asset => asset.funded === false) !== undefined;
  const isAssetManager = managerAddress === user.address;
  return (
    <div>
      <PageTitle>Asset Manager</PageTitle>
      <GoBackTextAndArrow
        href="/asset-managers"
        style={{
          margin: 'auto',
          marginBottom: '10px',
        }}
      />
      <ProfileWrapper>
        <AddressWrapper>
          <Media query={`(min-width: ${Sizes.tablet}px`}>
            {matches => (matches
              ? <ThreeBoxProfileWrapper><ThreeBoxProfile address={managerAddress} icon name long showDefault={isAssetManager} /></ThreeBoxProfileWrapper>
              : <ThreeBoxProfileWrapper><ThreeBoxProfile address={managerAddress} icon name showDefault={isAssetManager} /></ThreeBoxProfileWrapper>)
            }
          </Media>
          <a
            href={ExternalLinks.getEtherscanAddressURL(network, managerAddress)}
            target="_blank"
            rel="noreferrer"
          >
View on Etherscan
          </a>
        </AddressWrapper>
        <Divider />
        <AssetManagerProfile
          {...assetManager}
          totalRevenue={formatMonetaryValue(assetManager.totalRevenue)}
          collateralLocked={formatMonetaryValue(assetManager.collateralLocked, getPlatformToken(network))}
          styling={{
            labelColor: Colors.grayBase,
            valueColor: Colors.black,
          }}
        />
      </ProfileWrapper>
      <div style={{ height: '50px' }} />
      <AssetExplorer
        assets={assetsByManager}
        fundingActive={fundingActive}
      />
    </div>
  );
};

export default AssetManagerFullProfile;
