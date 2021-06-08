import Router from 'next/router';
import Watch from 'UI/Watch';
import AssetTemplateWrapper from './assetTemplateWrapper';
import AssetTemplateImageHolder from './assetTemplateImageHolder';
import AssetTemplateLocationIcon from './assetTemplateLocationIcon';
import AssetTemplateName from './assetTemplateName';
import AssetTemplateLocation from './assetTemplateLocation';
import RevenueGenerator from 'components/RevenueGenerator';
import InvestmentLabel from 'UI/InvestmentLabel';

const AssetTemplate = ({
  children,
  backgroundImage,
  handleAssetFavorited,
  assetId,
  name,
  city,
  watchListed,
  country,
  height,
  margin,
  addInvestmentLabel,
  userInvestment,
}) => {
  const loadingModel = !backgroundImage;
  return (
    <AssetTemplateWrapper
      margin={margin}
      loadingModel={loadingModel}
    >
      <AssetTemplateImageHolder
        backgroundImage={backgroundImage}
        height={height}
        onClick={() => Router.push(`/asset?id=${assetId}`, `/asset/${assetId}`)}
      >
        {(addInvestmentLabel && userInvestment > 0) && (
          <InvestmentLabel
            value={userInvestment}
          />
        )}
        {handleAssetFavorited && (
          <Watch
            active={watchListed}
            handleClick={handleAssetFavorited}
            assetId={assetId}
            bottom={addInvestmentLabel}
          />
        )}
        <AssetTemplateLocationIcon />
        <AssetTemplateName>{name}</AssetTemplateName>
        <AssetTemplateLocation>
          {country}, <span>{city}</span>
        </AssetTemplateLocation>
      </AssetTemplateImageHolder>
      {children}
    </AssetTemplateWrapper>
  )
}

export default AssetTemplate;
