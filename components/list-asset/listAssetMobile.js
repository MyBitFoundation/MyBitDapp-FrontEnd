import CarouselWithNavigation from "ui/CarouselWithNavigation";

import IntroSlide from 'components/list-asset/IntroSlide';
import AvailableAssetsSlide from 'components/list-asset/AvailableAssetsSlide';
import AssetLocationSlide from 'components/list-asset/AssetLocationSlide';
import DocsSlide from 'components/list-asset/DocsSlide';
import FeesSlide from 'components/list-asset/FeesSlide';
import CollateralSlide from 'components/list-asset/CollateralSlide';
import ConfirmSlide from 'components/list-asset/ConfirmSlide';
import SuccessSlide from 'components/list-asset/SuccessSlide';
import TermsOfServiceSlide from 'components/list-asset/TermsOfServiceSlide';
import GeneralDescriptionSlide from 'components/list-asset/GeneralDescriptionSlide';


const MAX_WIDTH_DESKTOP = "500px";

const ListAssetMobile = ({
  handleSelectChange,
  handleInputChange,
  handleCitySuggest,
  countries,
  handleDetectLocationClicked,
  loadingAssets,
  formData,
  handleFileUpload,
  handleSelectedTokenChange,
  balances,
  kyberLoading,
  listedAssetId,
  isUserListingAsset,
  setUserListingAsset,
  handleListAsset,
  metamaskErrorsToRender,
  handleSelectSuggest,
  setReadToS,
  readToS,
  shouldShowToSCheckmark,
  setCheckedToS,
  checkedToS,
  tokenWithSufficientBalance,
  loadingBalancesForNewUser,
  loadingConversionInfo,
  tokenSlippagePercentages,
  autoLocationOffline,
  getCategoriesForAssets
}) => {
  const {
    category,
    asset,
    assetValue,
    userCountry,
    assetAddress1,
    assetCity,
    assetProvince,
    assetPostalCode,
    managementFee,
    collateralInSelectedToken,
    collateralInDefaultToken,
    selectedToken,
    collateralPercentage,
    fileList,
    about,
    financials,
    risks,
    hasAdditionalCosts,
    additionalCosts,
    fees
  } = formData;

  return (
    <CarouselWithNavigation
      redirectOnClose="/explore"
      onFinish={() => {}}
      maxWidthDesktop={MAX_WIDTH_DESKTOP}
      nextButtonHasArrow
      disableMovingForward
      slides={[
        {
          toRender: <IntroSlide maxWidthDesktop={MAX_WIDTH_DESKTOP} />,
          buttons: {
            hasNextButton: true,
            hasBackButton: false,
            onSuccessMoveToNextSlide: true
          }
        },
        {
          toRender: (
            <AvailableAssetsSlide
              handleSelectChange={handleSelectChange}
              formData={formData}
              maxWidthDesktop={MAX_WIDTH_DESKTOP}
              loadingAssets={loadingAssets}
              handleInputChange={handleInputChange}
              countries={countries}
              handleDetectLocationClicked={handleDetectLocationClicked}
              handleCitySuggest={handleCitySuggest}
              error={false || metamaskErrorsToRender.render}
              autoLocationOffline={autoLocationOffline}
              getCategoriesForAssets={getCategoriesForAssets}
            />
          ),
          buttons: {
            hasNextButton: true,
            hasBackButton: true,
            nextButtonDisabled:
              !category ||
              !asset ||
              !assetValue ||
              metamaskErrorsToRender.render
          }
        },
        {
          toRender: (
            <GeneralDescriptionSlide
              formData={formData}
              maxWidthDesktop={MAX_WIDTH_DESKTOP}
              handleInputChange={handleInputChange}
            />
          ),
          buttons: {
            hasNextButton: true,
            hasBackButton: true,
            nextButtonDisabled:
              !about ||
              !financials ||
              !risks ||
              (hasAdditionalCosts && (!fees || additionalCosts <= 0))
          }
        },
        {
          toRender: (
            <AssetLocationSlide
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              formData={formData}
              countries={countries}
              maxWidthDesktop={MAX_WIDTH_DESKTOP}
              handleSelectSuggest={handleSelectSuggest}
            />
          ),
          buttons: {
            hasNextButton: true,
            hasBackButton: true,
            nextButtonDisabled:
              userCountry !== "" &&
              assetAddress1 !== "" &&
              assetCity !== "" &&
              assetProvince !== "" &&
              assetPostalCode !== ""
                ? false
                : true
          }
        },
        {
          toRender: (
            <DocsSlide
              fileList={fileList}
              handleFileUpload={handleFileUpload}
              maxWidthDesktop={MAX_WIDTH_DESKTOP}
            />
          ),
          buttons: {
            hasNextButton: true,
            hasBackButton: true
          }
        },
        {
          toRender: (
            <FeesSlide
              handleSelectChange={handleSelectChange}
              managementFee={managementFee}
              maxWidthDesktop={MAX_WIDTH_DESKTOP}
            />
          ),
          buttons: {
            hasNextButton: true,
            hasBackButton: true,
            nextButtonDisabled: managementFee !== 0 ? false : true
          }
        },
        {
          toRender: (
            <CollateralSlide
              selectedToken={selectedToken}
              handleSelectedTokenChange={handleSelectedTokenChange}
              formData={formData}
              maxWidthDesktop={MAX_WIDTH_DESKTOP}
              balances={balances}
              kyberLoading={kyberLoading}
              loadingBalancesForNewUser={loadingBalancesForNewUser}
              loadingConversionInfo={loadingConversionInfo}
              tokenSlippagePercentages={tokenSlippagePercentages}
            />
          ),
          buttons: {
            hasNextButton: true,
            hasBackButton: true,
            nextButtonDisabled: managementFee !== 0 ? false : true
          }
        },
        !readToS
          ? {
              toRender: (
                <TermsOfServiceSlide
                  maxWidthDesktop={MAX_WIDTH_DESKTOP}
                  onClick={setReadToS}
                />
              ),
              buttons: {
                hasNextButton: true,
                hasBackButton: true,
                nextButtonText: "I agree",
                nextButtonHandler: () => {
                  setReadToS();
                }
              }
            }
          : {
              toRender: listedAssetId ? (
                <SuccessSlide
                  maxWidthDesktop={MAX_WIDTH_DESKTOP}
                  assetId={listedAssetId}
                />
              ) : (
                <ConfirmSlide
                  formData={formData}
                  isUserListingAsset={isUserListingAsset}
                  listedAssetId={listedAssetId}
                  maxWidthDesktop={MAX_WIDTH_DESKTOP}
                  error={false || metamaskErrorsToRender.render}
                  shouldShowToSCheckmark={shouldShowToSCheckmark}
                  checkedToS={checkedToS}
                  setCheckedToS={setCheckedToS}
                />
              ),
              error: false || metamaskErrorsToRender.render,
              hideButtons: listedAssetId ? true : false,
              buttons: {
                hasNextButton: true,
                hasBackButton: true,
                nextButtonText: isUserListingAsset
                  ? "Confirming listing"
                  : "Confirm Listing",
                nextButtonLoading: isUserListingAsset,
                nextButtonDisabled:
                  (!checkedToS && readToS) || !tokenWithSufficientBalance,
                nextButtonHandler: () => {
                  setUserListingAsset(true);
                  handleListAsset(formData, setUserListingAsset);
                }
              }
            }
      ]}
    />
  );
};

export default ListAssetMobile;
