import React from 'react';
import dayjs from 'dayjs';
import styled, { css } from 'styled-components';
import CheckMark from 'static/ic_unreal.svg';
import Divider from 'UI/Divider';

const AssetManagerProfileDataWrapper = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: ${props => (props.showCollateral ? "auto auto" : "auto")};
  grid-row-gap: 15px;

  ${({ theme }) => theme.tablet`
    grid-template-columns: auto auto auto;
  `}
`;

const PoweredBy = styled.p`
  display: flex;
  align-items: center;

  svg {
    margin: 0 5px;
  }

  a:focus {
    text-decoration: none;
  }
`

const DataWrapper = styled.div`
  display: flex;
  flex-direction: column;

  p:nth-child(1) {
    color: ${props => (props.styling ? props.styling.labelColor : "#FFFFFF")};
    opacity: 0.8;
    margin-right: 20px;
    margin-bottom: 5px;
  }

  div {
    color: ${props => (props.styling ? props.styling.valueColor : "inherit")};
  }
`;

const Data = ({ text, value, styling }) => (
  <DataWrapper styling={styling}>
    <p>{text}</p>
    <div>{value}</div>
  </DataWrapper>
);

const AssetManagerProfile = ({
  totalAssets,
  totalRevenue,
  startDate,
  collateralLocked,
  styling,
  showCollateral = true
}) => {
  return (
    <div>
      <Divider styling={{
        ...styling.divider,
      }}/>
      <AssetManagerProfileDataWrapper showCollateral={showCollateral}>
        <Data text="Managing Assets" value={totalAssets} styling={styling} />
        <Data
          text="Started as Manager"
          value={dayjs(startDate).format("DD-MM-YY")}
          styling={styling}
        />
        <Data text="Total Revenue" value={totalRevenue} styling={styling} />
        {showCollateral && (
          <Data
            text="Collateral Locked"
            value={collateralLocked}
            styling={styling}
          />
        )}
      </AssetManagerProfileDataWrapper>
    </div>
  );
};

export default AssetManagerProfile;
