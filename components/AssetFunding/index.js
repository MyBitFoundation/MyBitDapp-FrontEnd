import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
} from 'antd';
import AssetDetailsManagerInfo from 'components/AssetDetailsManagerInfo';
import AssetDetailsInfo from 'components/AssetDetailsInfo';
import AssetFundingSelector from 'components/AssetFundingSelector';
import AssetFundingConfirm from 'components/AssetFundingConfirm';
import AssetFundingConfirming from 'components/AssetFundingConfirming';
import {
  formatMonetaryValue,
  shortenAddress,
  fromWeiToEth,
  toWei,
} from 'utils/helpers';
import {
  MYBIT_FOUNDATION_SHARE,
  MYBIT_FOUNDATION_FEE,
} from 'constants/platformFees';
import {
  DEFAULT_TOKEN_MAX_DECIMALS,
} from 'constants/app';
import { TERMS_OF_SERVICE } from 'constants/termsOfService';
import { withTermsOfServiceContext } from 'components/TermsOfServiceContext';
import Panel from 'UI/Panel';
import BN from 'bignumber.js';

BN.config({ EXPONENTIAL_AT: 80 });

class AssetFunding extends React.Component {
  state = {
    step: 0,
    renderToS: false,
  };

  changeStep = (step) => {
    if (step === 1) {
      this.props.loadExchangeRateForAmountToPay();
    }
    this.setState({ step });
  }

  resetStep = () => this.changeStep(0);

  fundAsset = (amountToPay, amountContributed, paymentToken, selectedToken) => {
    const {
      readToS,
      setReadToS,
    } = this.props.ToSContext;

    const handleUIUpdate = () => {
      this.changeStep(2);

      this.props.blockchainContext.fundAsset(
        this.props.asset.assetId,
        this.props.asset.name,
        amountToPay,
        amountContributed,
        paymentToken,
        selectedToken,
      );
    };

    if (!readToS) {
      this.setState({
        renderToS: (
          <Modal
            visible
            okButtonProps={{
              type: 'primary',
              text: 'Confirm',
            }}
            okText="I Agree"
            onOk={() => {
              this.setState({ renderToS: undefined });
              handleUIUpdate(),
              setReadToS();
            }}
            onCancel={() => this.setState({ renderToS: undefined })}
            title="Terms of Service"
          >
            {TERMS_OF_SERVICE}
          </Modal>
        ),
      });
    } else {
      handleUIUpdate();
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const {
      asset: currentAsset,
    } = this.props;

    const {
      asset: newAsset,
    } = nextProps;

    if (!currentAsset.funded && newAsset.funded) {
      this.changeStep(0);
    }
  }

  render() {
    const {
      step,
      renderToS,
    } = this.state;

    const {
      ToSContext,
    } = this.props;

    const { readToS } = ToSContext;

    return (
      <Panel maximizeForMobile>
        {renderToS || null}
        {step === 0 && (
          <AssetFundingSelector
            formatMonetaryValue={formatMonetaryValue}
            handleConfirmationClicked={this.changeStep.bind(this, 1)}
            {...this.props}
          />
        )}
        {step === 1 && (
          <AssetFundingConfirm
            fundAsset={this.fundAsset}
            onCancel={this.resetStep}
            readToS={readToS}
            {...this.props}
          />
        )}
        {step === 2 && (
          <AssetFundingConfirming cancel={this.resetStep} />
        )}
      </Panel>
    );
  }
}


export default withTermsOfServiceContext(AssetFunding);
