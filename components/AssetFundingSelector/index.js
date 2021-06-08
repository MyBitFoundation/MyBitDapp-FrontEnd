import AssetDeadline from 'UI/AssetDeadline';
import AssetFundingDetails from 'UI/AssetFundingDetails';
import FundingCalculator from 'components/FundingCalculator';
import AssetFundingButton from 'components/AssetFunding/assetFundingButton';
import Separator from 'UI/Separator';
import AssetFundingSelectorFooter from './assetFundingSelectorFooter';

const separatorStyleFullWidth = {
  position: 'absolute',
  left: '0px',
  marginTop: '15px',
}

const separatorStyle = {
  margin: '20px 0px',
};

const AssetFundingSelector = ({
  asset,
  ended,
  loadingUserInfo,
  maxOwnership,
  formatMonetaryValue,
  selectedOwnership,
  minInvestment,
  maxInvestment,
  selectedAmountDefaultToken,
  onChangeContributionPercentage,
  onChangeContributionDefaultToken,
  handleDeadlineHit,
  handleConfirmationClicked,
  selectedMaxValue,
}) => (
  <div>
    <AssetDeadline
      {...asset}
      handleDeadlineHit={handleDeadlineHit}
    />
    <Separator style={separatorStyleFullWidth}/>
    <div style={{marginTop: '35px'}}>
      <AssetFundingDetails
        numberOfInvestors={asset.numberOfInvestors}
        funded={asset.funded}
        fundingGoal={formatMonetaryValue(asset.fundingGoal)}
        fundingProgress={formatMonetaryValue(asset.fundingProgress)}
        style={{marginTop: '20px'}}
      />
    </div>
    <Separator style={separatorStyle}/>
    <FundingCalculator
      {...asset}
      onChangeContributionDefaultToken={onChangeContributionDefaultToken}
      onChangeContributionPercentage={onChangeContributionPercentage}
      selectedAmountDefaultToken={selectedAmountDefaultToken}
      maxInvestment={maxInvestment}
      minInvestment={minInvestment}
      selectedOwnership={selectedOwnership}
      ended={ended}
      userInvestment={asset.userInvestment}
      userOwnership={asset.percentageOwnedByUser}
      maxOwnership={maxOwnership}
      loadingUserInfo={loadingUserInfo}
    />
    {(!asset.pastDate && !asset.funded) && (
      <React.Fragment>
        <AssetFundingButton
          type="primary"
          onClick={handleConfirmationClicked}
          disabled={maxInvestment === 0 || selectedAmountDefaultToken < minInvestment || selectedAmountDefaultToken === 0}
          size="large"
          style={{
            margin: '20px 0px',
          }}
        >
          Contribute
        </AssetFundingButton>
        <AssetFundingSelectorFooter>
          You'll be able to select your preferred token of payment in the next step. <br />
          We use MetaMask & Kyber for payments
        </AssetFundingSelectorFooter>
      </React.Fragment>
    )}
  </div>
);

export default AssetFundingSelector;
