import PropTypes from 'prop-types';
import Link from 'next/link';
import {
  Button,
  Icon,
  Progress,
} from 'antd';
import { formatMonetaryValue } from 'utils/helpers';
import {
  FundingStages,
} from 'constants/fundingStages';
import ValueDisplay from 'UI/ValueDisplay';
import AssetPortfolioManagedWrapper from './assetPortfolioManagedWrapper';
import AssetPortfolioManagedSection from './assetPortfolioManagedSection';
import AssetPortfolioManagedButtons from './assetPortfolioManagedButtons';
import AssetPortfolioManagedValue from './assetPortfolioManagedValue';
import AssetPortfolioManagedValueDisplays from './assetPortfolioManagedValueDisplays';
import AssetPortfolioManagedFundedLabel from './assetPortfolioManagedFundedLabel';
import AssetPortfolioManagedFundedValue from './assetPortfolioManagedFundedValue';

const AssetPortfolioManaged = ({
  funded,
  assetId,
  fundingStage,
  toWithdraw,
  managerPercentage,
  totalProfitAssetManager,
  assetIncome,
  pastDate,
  fundingGoal,
  fundingProgress,
}) => {
  const button = (
    <Button
      type="secondary"
    >
      Manage asset
    </Button>
  )

  const buttonWithLink = (
    <Link
      href={`/manage?id=${assetId}`}
      as={`/manage/${assetId}`}
    >
      {button}
    </Link>
  );

  return (
    <AssetPortfolioManagedWrapper>
      <AssetPortfolioManagedValueDisplays>
        <ValueDisplay
          text="Value"
          value={formatMonetaryValue(fundingGoal)}
          isBlue
          coloredBackground
        />
        {funded && (
          <ValueDisplay
            text="Revenue"
            value={formatMonetaryValue(assetIncome)}
            isGreen
            coloredBackground
          />
        )}
      </AssetPortfolioManagedValueDisplays>
      <AssetPortfolioManagedSection>
        <span>Your management fee:</span>
        <AssetPortfolioManagedValue>
          {parseFloat((managerPercentage * 100).toFixed(2))}%
        </AssetPortfolioManagedValue>
      </AssetPortfolioManagedSection>
      <AssetPortfolioManagedSection>
        <span>
          Total profit:
        </span>
        <div>
          <AssetPortfolioManagedValue
            isGray={!funded}
            isSmallMobile={!funded}
          >
            {funded ? formatMonetaryValue(totalProfitAssetManager) : pastDate ? 'Funding failed' : 'Funding in progress'}
          </AssetPortfolioManagedValue>
        </div>
      </AssetPortfolioManagedSection>
      <AssetPortfolioManagedSection
        hasExtraMarginBottom
      >
        <span>Available for withdrawal:</span>
        <div>
          <AssetPortfolioManagedValue
            isGray={!funded}
            isSmallMobile={!funded}
          >
            {funded ? formatMonetaryValue(toWithdraw) : pastDate ? 'Funding failed' : 'Funding in progress'}
          </AssetPortfolioManagedValue>
        </div>
      </AssetPortfolioManagedSection>
      <AssetPortfolioManagedSection>
        <div>
          {funded && (
            <span>
              Fully funded
            </span>
          )}
          {(!pastDate && fundingStage === FundingStages.IN_PROGRESS) && (
            <div>
              <AssetPortfolioManagedFundedLabel>
                Funded:
              </AssetPortfolioManagedFundedLabel>
              <AssetPortfolioManagedFundedValue>
                {`${formatMonetaryValue(fundingProgress, undefined, false)}/${formatMonetaryValue(fundingGoal)}`}
              </AssetPortfolioManagedFundedValue>
            </div>
          )}
          {(pastDate && !funded) && (
            <span>
              Funding failed
            </span>
          )}
        </div>
        <AssetPortfolioManagedButtons>
          {buttonWithLink}
        </AssetPortfolioManagedButtons>
      </AssetPortfolioManagedSection>
    </AssetPortfolioManagedWrapper>
  )
};

export default React.memo(AssetPortfolioManaged);
