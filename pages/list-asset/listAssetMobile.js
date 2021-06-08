import CarouselWithNavigation from 'UI/CarouselWithNavigation';
import {
  IntroSlide,
  AvailableAssetsSlide,
  DocsSlide,
  FeesSlide,
  CollateralSlide,
  ConfirmSlide,
  SuccessSlide,
  TermsOfServiceSlide,
  GeneralDescriptionSlide,
  CoverPictureSlide,
} from 'components/Slides/ListAsset/slides';

const MAX_WIDTH_DESKTOP = '500px';

const ListAssetMobile = ({
  dev,
  handleSelectChange,
  handleInputChange,
  handleCitySuggest,
  countries,
  handleDetectLocationClicked,
  loadingAssets,
  formData,
  handleCoverPicture,
  handleFileUpload,
  handleSelectedTokenChange,
  balances,
  kyberLoading,
  listedAssetId,
  isUserListingAsset,
  setUserListingAsset,
  handleListAsset,
  metamaskErrorsToRender,
  setReadToS,
  readToS,
  shouldShowToSCheckmark,
  setCheckedToS,
  checkedToS,
  tokenWithSufficientBalance,
  airtableContext,
  loadingBalancesForNewUser,
  loadingConversionInfo,
  tokenSlippagePercentages,
  autoLocationOffline,
  getCategoriesForAssets,
}) => {
  const {
    asset,
    assetValue,
    userCountry,
    userCity,
    managementFee,
    selectedToken,
    coverPicture,
    fileList,
    about,
    financials,
    risks,
    paymentInSelectedToken,
    collateralInPlatformToken,
    minimumCollateralInPlatformToken,
  } = formData;

  const isSelectedBalanceEnough = () => balances?.[selectedToken]?.balance >= paymentInSelectedToken
    && collateralInPlatformToken >= minimumCollateralInPlatformToken;

  return (
    <CarouselWithNavigation
      redirectOnClose="/explore"
      onFinish={() => {}}
      maxWidthDesktop={MAX_WIDTH_DESKTOP}
      nextButtonHasArrow
      disableMovingForward
      slides={[{
        toRender: (
          <IntroSlide maxWidthDesktop={MAX_WIDTH_DESKTOP} />
        ),
        buttons: {
          hasNextButton: true,
          hasBackButton: false,
          onSuccessMoveToNextSlide: true,
        },
      }, {
        toRender: (
          <AvailableAssetsSlide
            handleSelectChange={handleSelectChange}
            formData={formData}
            maxWidthDesktop={MAX_WIDTH_DESKTOP}
            loadingAssets={loadingAssets}
            handleInputChange={handleInputChange}
            countries={countries}
            handleCitySuggest={handleCitySuggest}
            error={false || metamaskErrorsToRender.render}
            airtableContext={airtableContext}
            autoLocationOffline={autoLocationOffline}
            getCategoriesForAssets={getCategoriesForAssets}
          />
        ),
        buttons: {
          hasNextButton: true,
          hasBackButton: true,
          nextButtonDisabled: !userCountry || !userCity || !asset || !assetValue,
        },
      }, {
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
          nextButtonDisabled: !about || !financials || !risks,
        },
      }, {
        toRender: (
          <CoverPictureSlide
            coverPicture={coverPicture}
            handleCoverPicture={handleCoverPicture}
            maxWidthDesktop={MAX_WIDTH_DESKTOP}
          />
        ),
        buttons: {
          hasNextButton: true,
          hasBackButton: true,
          nextButtonDisabled: !coverPicture,
        },
      }, {
        toRender: (
          <DocsSlide
            fileList={fileList}
            handleFileUpload={handleFileUpload}
            maxWidthDesktop={MAX_WIDTH_DESKTOP}
          />
        ),
        buttons: {
          hasNextButton: true,
          hasBackButton: true,
        },
      }, {
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
          nextButtonDisabled: managementFee === 0,
        },
      }, {
        toRender:
          (<CollateralSlide
            selectedToken={selectedToken}
            handleSelectedTokenChange={handleSelectedTokenChange}
            formData={formData}
            handleInputChange={handleInputChange}
            maxWidthDesktop={MAX_WIDTH_DESKTOP}
            balances={balances}
            kyberLoading={kyberLoading}
            loadingBalancesForNewUser={loadingBalancesForNewUser}
            loadingConversionInfo={loadingConversionInfo}
            tokenSlippagePercentages={tokenSlippagePercentages}
          />),
        buttons: {
          hasNextButton: true,
          hasBackButton: true,
          nextButtonDisabled: !isSelectedBalanceEnough(),
          nextButtonDisabledText: 'Insufficient balance',
        },
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
            nextButtonText: 'I agree',
            nextButtonHandler: () => {
              setReadToS();
            },
          },
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
          hideButtons: !!listedAssetId,
          buttons: {
            hasNextButton: true,
            hasBackButton: true,
            nextButtonText: isUserListingAsset
              ? 'Confirming listing'
              : 'Confirm Listing',
            nextButtonLoading: isUserListingAsset,
            nextButtonDisabled:
                  (!checkedToS && readToS) || !tokenWithSufficientBalance,
            nextButtonHandler: () => {
              setUserListingAsset(true);
              handleListAsset(formData, setUserListingAsset);
            },
          },
        },
      ]}
    />
  );
};

export default ListAssetMobile;
