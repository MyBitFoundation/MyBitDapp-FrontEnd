import React, { useContext } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import AssetDetailsMananagerInfo from './assetDetailsMananagerInfo';
import AssetDetailsManagerInfoTitle from './assetDetailsManagerInfoTitle';
import AssetDetailsManagerInfoAddress from './assetDetailsManagerInfoAddress';
import AssetDetailsManagerInfoPercentages from './assetDetailsManagerInfoPercentages';
import ThreeBoxProfile from 'components/ThreeBoxProfile';
import ValueDisplay from 'UI/ValueDisplay';
import MyBitLogo from 'static/mybit-blue.svg';
import Sliders from 'static/sliders.svg';
import { InternalLinks } from 'constants/links';
import { getPlatformToken } from 'constants/app';
import AssetManagerProfile from 'UI/AssetManagerProfile';
import {
  formatMonetaryValue,
} from 'utils/helpers';
import Theming from 'components/Theme/theming';
import Divider from 'UI/Divider';
import Panel from 'UI/Panel';
import { useMetamaskContext } from 'components/MetamaskContext';

const Colors = Theming.colors;

const UserWrapper = styled.a`
  display: flex;
  align-items: center;
  font-size: 16px;
  ${({ theme }) => theme.mobileM`
    font-size: 16px;
  `}

  span {
    position: relative;
    top: 2px;
  }
`;

const AssetDetailsManagerInfo = ({
  address,
  managerPercentage,
  collateralAmount,
  assetManager,
  isAssetManager,
}) => {
  const { network } = useMetamaskContext();

  return (
    <Panel
      maximizeForMobile
      style={{ marginTop: '20px' }}
    >
      <div>
        <AssetDetailsManagerInfoTitle>
        Asset manager
        </AssetDetailsManagerInfoTitle>
        <Link
          as={`/asset-managers/${address}`}
          href={`/asset-managers?id=${address}`}
        >
          <UserWrapper>
            <ThreeBoxProfile address={address} name icon showDefault={isAssetManager} />
          </UserWrapper>
        </Link>
        <Divider />
        <AssetManagerProfile
          {...assetManager}
          totalRevenue={formatMonetaryValue(assetManager.totalRevenue)}
          collateralLocked={formatMonetaryValue(assetManager.collateralLocked, getPlatformToken(network))}
          styling={{
            labelColor: Colors.grayBase,
            valueColor: Colors.black,
          }}
          showCollateral={false}
        />
      </div>
      <Divider />
      <AssetDetailsManagerInfoPercentages>
        <ValueDisplay
          text="Total Management Fee"
          icon={<Sliders />}
          value={`${parseFloat((managerPercentage * 100).toFixed(2))}%`}
          style={{
            margin: '5px 0',
          }}
          hasSeparator
          hasIcon
          isBlue
          hasShadow
        />
        <ValueDisplay
          text="Asset Collateral"
          icon={<MyBitLogo />}
          value={`${collateralAmount.toFixed(2)} ${getPlatformToken(network)}`}
          style={{
            margin: '5px 0',
          }}
          hasSeparator
          hasIcon
          isBlue
          hasShadow
        />
      </AssetDetailsManagerInfoPercentages>
    </Panel>
  );
};

export default AssetDetailsManagerInfo;
