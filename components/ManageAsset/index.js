import React from 'react';
import {
  Button,
  Col,
  Row,
} from 'antd';
import Loading from 'components/Loading';
import {
  InternalLinks,
} from 'constants/links';
import ManageAssetNavButtons from './manageAssetNavButtons';
import ManageAssetContentWrapper from './manageAssetContentWrapper';
import ManageAssetAssetInfo from './manageAssetAssetInfo';
import ManageAssetGraphs from './manageAssetGraphs';
import ManageAssetUpdates from './manageAssetUpdates';
import ManageAssetDocsButton from './manageAssetDocsButton';
import { withMetamaskErrors } from 'components/MetamaskErrors';
import {
  getErrorMessage,
} from './errorMessages';
import ErrorPage from 'components/ErrorPage';
import DocumentsManager from 'components/DocumentsManager';
import BackButton from 'UI/BackButton';
import GeneralDescriptionEditor from 'components/GeneralDescriptionEditor';

const COLUMN_SIZE = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 12,
  xl: 12,
};

class ManageAsset extends React.Component {
  constructor(props) {
    super(props);
    this.displayProfit = this.displayProfit.bind(this);
    this.displayCollateral = this.displayCollateral.bind(this);
    this.state = {
      chartBoxView: 'profit',
      profitChartView: 'weekly',
      supportingDocuments: false,
      generalDocuments: false,
    };
  }

  displayProfit(type) {
    this.setState({ chartBoxView: 'profit', profitChartView: type });
  }

  displayCollateral() {
    this.setState({ chartBoxView: 'collateral' });
  }

  getFilesToRender(files, assetId) {
    if (!files || files.length === 0) {
      return <span>None</span>;
    }
    const toReturn = files.map(file => (
      <a
        href={`${InternalLinks.S3}${assetId}:${file}`}
      >
        {file}
      </a>
    ));

    return toReturn;
  }

  getNavBarButtons = (asset, error, isCallingPayout, payoutAsset) => {
    const {
      assetId,
      managerHasToCallPayout,
    } = asset;

    const sendFundsToOperatorButton = managerHasToCallPayout ? (
      <Button
        type="primary"
        onClick={() => payoutAsset()}
        loading={isCallingPayout}
        disabled={isCallingPayout}
      >
        Send Funds To Operator
      </Button>
    ) : undefined;

    return (
      <ManageAssetNavButtons>
        <BackButton
          as="/portfolio/managed-assets"
          href="/portfolio?type=managed-assets"
        />
        {!error && (
          <React.Fragment>
            <ManageAssetDocsButton
              type="secondary"
              selected={this.state.supportingDocuments}
              onClick={() => this.setState(prevProps => ({
                supportingDocuments: !prevProps.supportingDocuments,
                generalDocuments: false,
              }))}
            >
              Supporting Documents
            </ManageAssetDocsButton>
            <ManageAssetDocsButton
              type="secondary"
              selected={this.state.generalDocuments}
              onClick={() => this.setState(prevProps => ({
                generalDocuments: !prevProps.generalDocuments,
                supportingDocuments: false,
              }))}
            >
              General Description
            </ManageAssetDocsButton>
            {sendFundsToOperatorButton}
          </React.Fragment>
        )}
      </ManageAssetNavButtons>
    );
  }

  render() {
    const {
      assetInfo = {},
      threeBox = {},
      error,
      loading,
      metamaskError,
    } = this.props;


    if (loading) {
      return (
        <Loading
          message="Loading asset information"
          hasBackButton
          oldBackButton
        />
      );
    } if (error) {
      const description = getErrorMessage(error.type);
      return (
        <ErrorPage
          title="Error"
          description={description}
        />
      );
    }

    const {
      asset = {},
      finantialDetails = {},
      methods = {},
      userAddress,
    } = assetInfo;

    const {
      authorizeThreeBoxSpace,
      openThreeBoxSpace,
      postUpdateOnThread,
      getPostsFromCurrentThread,
    } = (threeBox.methods || {});

    const {
      hasAuthorizedThreeBox,
      hasOpenedGoSpace,
      syncingThreeBox,
      syncingThreeBoxThread,
      loadingThreeBoxThreadAPIAuthorization,
      loadingThreeBoxSpaceAuthorization,
      loadingThreeBoxThreadPostRequest,
    } = threeBox;

    const {
      withdrawCollateral,
      withdrawProfitAssetManager,
      payoutAsset,
    } = methods;

    const {
      assetManagerProfits,
      averageProfit,
      collateralData,
      percentageMax,
      withdrawMax,
      profit,
      revenueData,
      toWithdraw,
      isWithdrawingCollateral,
      isWithdrawingAssetManager,
      isCallingPayout,
    } = finantialDetails;

    const {
      profitChartView,
      chartBoxView,
      supportingDocuments,
      generalDocuments,
    } = this.state;

    const {
      assetId,
      collateral,
      managerPercentage,
      fundingGoal,
      assetIncome,
      city,
      country,
      name,
      partner,
      files,
      assetManagerCollateral,
      funded,
      managerHasToCallPayout,
      risks,
      about,
      financials,
      fees,
    } = asset;

    const imageSrc = asset.coverPicture.url;

    const assetListingUrl = `/explore/${assetId}`;

    return (
      <div>
        {this.getNavBarButtons(asset, error, isCallingPayout, payoutAsset)}
        {!error && (
        <ManageAssetContentWrapper>
          <Col {...COLUMN_SIZE}>
            <ManageAssetAssetInfo
              assetId={assetId}
              city={city}
              country={country}
              fundingGoal={fundingGoal}
              assetIncome={assetIncome}
              profit={profit}
              averageProfit={averageProfit}
              toWithdraw={toWithdraw}
              isWithdrawingAssetManager={isWithdrawingAssetManager}
              withdrawProfitAssetManager={withdrawProfitAssetManager}
              managerPercentage={managerPercentage}
              funded={funded}
              managerHasToCallPayout={managerHasToCallPayout}
              imageSrc={imageSrc}
            />
            {/* <ManageAssetUpdates
              authorizeThreeBoxSpace={authorizeThreeBoxSpace}
              hasAuthorizedThreeBox={hasAuthorizedThreeBox}
              openThreeBoxSpace={openThreeBoxSpace}
              hasOpenedGoSpace={hasOpenedGoSpace}
              postUpdateOnThread={postUpdateOnThread}
              getPostsFromCurrentThread={getPostsFromCurrentThread}
              syncingThreeBox={syncingThreeBox}
              syncingThreeBoxThread={syncingThreeBoxThread}
              loadingThreeBoxThreadPostRequest={loadingThreeBoxThreadPostRequest}
              loadingThreeBoxThreadAPIAuthorization={loadingThreeBoxThreadAPIAuthorization}
              loadingThreeBoxSpaceAuthorization={loadingThreeBoxSpaceAuthorization}
            /> */}
          </Col>
          {!supportingDocuments && !generalDocuments && (
          <Col {...COLUMN_SIZE}>
            <ManageAssetGraphs
              chartBoxView={chartBoxView}
              revenueData={revenueData}
              profitChartView={profitChartView}
              managerPercentage={managerPercentage}
              displayProfit={this.displayProfit}
              displayCollateral={this.displayCollateral}
              assetManagerCollateral={assetManagerCollateral}
              collateralData={collateralData}
              fundingGoal={fundingGoal}
              isWithdrawingCollateral={isWithdrawingCollateral}
              withdrawCollateral={withdrawCollateral}
            />
          </Col>
          )}
          {supportingDocuments && (
          <Col {...COLUMN_SIZE}>
            <DocumentsManager
              asset={asset}
            />
          </Col>
          )}
          {generalDocuments && (
          <Col {...COLUMN_SIZE}>
            <GeneralDescriptionEditor
              asset={asset}
            />
          </Col>
          )}
        </ManageAssetContentWrapper>
        )}
      </div>
    );
  }
}

export default withMetamaskErrors(ManageAsset, false, true);
