import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import {
  Tooltip,
} from 'antd';
import AssetManagerProfile from 'UI/AssetManagerProfile';
import Divider from 'UI/Divider';

const GlobalStyle = createGlobalStyle`
  .AssetManagerTooltip .ant-tooltip-inner{
    max-width: unset;
    background-color: rgba(17, 17, 17, 0.95);
    height: auto;
    width: auto;
    color: #FFFFFF;
    font-size: 14px;
    line-height: 22px

    ${({theme}) => theme.tablet`
      width: 460px;
    `}

    a {
      color: #FFFFFF;
    }
  }

  .AssetManagerTooltip .ant-tooltip-arrow{
    display: none;
  }

  .AssetManagerTooltip svg{
    width: 18px;
    height: 18px;
  }
`

const AssetManagerTooltip = ({
  children,
  totalAssets,
  startDate,
  totalRevenue,
  collateralLocked,
}) => (
  <span>
    <GlobalStyle />
    <Tooltip
      overlayClassName="AssetManagerTooltip"
      arrowPointAtCenter
      placement="bottom"
      destroyTooltipOnHide
      title={
        <AssetManagerProfile
          totalAssets={totalAssets}
          startDate={startDate}
          totalRevenue={totalRevenue}
          collateralLocked={collateralLocked}
          styling={{
            divider: {
              opacity: 0.2,
              margin: '5px 0px',
            }
          }}
        />
      }
    >
      {children}
    </Tooltip>
  </span>
)

export default AssetManagerTooltip;
