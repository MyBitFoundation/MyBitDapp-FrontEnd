import styled, { css } from 'styled-components';

import IntroSlide from 'components/list-asset/IntroSlide';
import AvailableAssetsSlide from 'components/list-asset/AvailableAssetsSlide';
import AssetLocationSlide from 'components/list-asset/AssetLocationSlide';
import DocsSlide from 'components/list-asset/DocsSlide';
import FeesSlide from 'components/list-asset/FeesSlide';
import CollateralSlide from 'components/list-asset/CollateralSlide';
import ConfirmSlideDesktop from 'components/list-asset/ConfirmSlideDesktop';
import SuccessSlide from 'components/list-asset/SuccessSlide';
import TermsOfServiceSlide from 'components/list-asset/TermsOfServiceSlide';
import GeneralDescriptionSlide from 'components/list-asset/GeneralDescriptionSlide';

import CustomTimeline from './customTimeline';

const MAX_WIDTH_DESKTOP = "450px";

const ListAssetDesktopWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-around;
  margin: 0px auto;
  margin-top: 90px;
  max-width: 850px;

  & > ul{
   margin-left: 20px;
   width: 30%;
  }

  & > div{
    width: 60%;
  }

  ${({theme}) => theme.laptop`
    & > ul{
     margin-left: auto;
     margin-right: 50px;
     width: 40%;
    }
  `}
`

const PageTitle = styled.div`
  font-family: Gilroy;
  font-size: 32px;
  line-height: 40px;
  color: ${({theme}) => theme.colors.black};
  position: absolute;
  left: 10px;
  top: -70px;

  ${({theme}) => theme.laptop`
    left: -5px;
  `}
`

const ListAssetDesktop = ({
  step,
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
  goToNextStep,
  goToStep,
  readToS,
  setReadToS,
  checkedToS,
  shouldShowToSCheckmark,
  setCheckedToS,
  tokenWithSufficientBalance,
  userAddress,
  loadingBalancesForNewUser,
  loadingConversionInfo,
  tokenSlippagePercentages,
  autoLocationOffline,
  getCategoriesForAssets,
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
    collateralInPlatformToken,
    fileList,
    about,
    financials,
    risks,
    hasAdditionalCosts,
    additionalCosts,
    fees,
  } = formData;

  if(step === 0){
    return (
      <IntroSlide
        maxWidthDesktop="600px"
        desktopMode
        onClick={goToNextStep}
      />
    )
  }
  return (
    <ListAssetDesktopWrapper>
      <PageTitle>List an Asset</PageTitle>
      <CustomTimeline
        step={step}
        formData={formData}
        goToStep={goToStep}
        listedAssetId={listedAssetId}
        readToS={readToS}
        isUserListingAsset={isUserListingAsset}
        tokenWithSufficientBalance={tokenWithSufficientBalance}
        metamaskErrors={metamaskErrorsToRender.error !== undefined}
      />
      {step === 1 && (
        <AvailableAssetsSlide
          handleSelectChange={handleSelectChange}
          formData={formData}
          maxWidthDesktop={MAX_WIDTH_DESKTOP}
          loadingAssets={loadingAssets}
          handleInputChange={handleInputChange}
          countries={countries}
          handleDetectLocationClicked={handleDetectLocationClicked}
          handleCitySuggest={handleCitySuggest}
          desktopMode
          nextButtonDisabled={!category || !asset || !assetValue || metamaskErrorsToRender.render}
          onClick={goToNextStep}
          error={false || metamaskErrorsToRender.render}
          autoLocationOffline={autoLocationOffline}
          getCategoriesForAssets={getCategoriesForAssets}
        />
      )}
      {step === 2 && (
        <GeneralDescriptionSlide
          handleInputChange={handleInputChange}
          formData={formData}
          maxWidthDesktop={MAX_WIDTH_DESKTOP}
          desktopMode
          onClick={goToNextStep}
          nextButtonDisabled={!about || !financials || !risks || (hasAdditionalCosts && (!fees || additionalCosts <= 0))}
          handleSelectChange={handleSelectChange}
        />
      )}
      {step === 3 && (
        <AssetLocationSlide
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          formData={formData}
          countries={countries}
          maxWidthDesktop={MAX_WIDTH_DESKTOP}
          handleSelectSuggest={handleSelectSuggest}
          desktopMode
          nextButtonDisabled={userCountry !== "" &&
            assetAddress1 !== "" &&
            assetCity !== "" &&
            assetProvince !== "" &&
            assetPostalCode !== ""
              ? false
              : true
          }
          onClick={goToNextStep}
        />
      )}
      {step === 4 && (
        <DocsSlide
          fileList={fileList}
          handleFileUpload={handleFileUpload}
          maxWidthDesktop={MAX_WIDTH_DESKTOP}
          onClick={goToNextStep}
          desktopMode
        />
      )}
      {step === 5 && (
        <FeesSlide
          handleSelectChange={handleSelectChange}
          managementFee={managementFee}
          maxWidthDesktop={MAX_WIDTH_DESKTOP}
          onClick={goToNextStep}
          desktopMode
          nextButtonDisabled={managementFee !== 0 ? false : true}
        />
      )}
      {step === 6 && (
        <CollateralSlide
          selectedToken={selectedToken}
          handleSelectedTokenChange={handleSelectedTokenChange}
          formData={formData}
          maxWidthDesktop={MAX_WIDTH_DESKTOP}
          balances={balances}
          kyberLoading={kyberLoading}
          onClick={goToNextStep}
          desktopMode
          nextButtonDisabled={managementFee !== 0 ? false : true}
          loadingBalancesForNewUser={loadingBalancesForNewUser}
          loadingConversionInfo={loadingConversionInfo}
          tokenSlippagePercentages={tokenSlippagePercentages}
        />
      )}{step === 7 && !readToS && (
        <TermsOfServiceSlide
          maxWidthDesktop={MAX_WIDTH_DESKTOP}
          desktopMode
          onClick={setReadToS}
        />
      )}
      {(step === 7 && listedAssetId && readToS) && (
        <SuccessSlide
          maxWidthDesktop={MAX_WIDTH_DESKTOP}
          assetId={listedAssetId}
          desktopMode
        />
       )}
       {(step === 7 && !listedAssetId && readToS) && (
        <ConfirmSlideDesktop
          formData={formData}
          isUserListingAsset={isUserListingAsset}
          listedAssetId={listedAssetId}
          maxWidthDesktop={MAX_WIDTH_DESKTOP}
          error={false || metamaskErrorsToRender.render}
          onClick={() => {
            setUserListingAsset(true);
            handleListAsset(formData, setUserListingAsset);
          }}
          checkedToS={checkedToS}
          shouldShowToSCheckmark={shouldShowToSCheckmark}
          setCheckedToS={setCheckedToS}
          readToS={readToS}
          tokenWithSufficientBalance={tokenWithSufficientBalance}
        />
      )}
    </ListAssetDesktopWrapper>
  )
}

export default ListAssetDesktop;
