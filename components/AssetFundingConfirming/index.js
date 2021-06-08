import Link from 'next/link';
import AssetFundingTitle from 'components/AssetFunding/assetFundingTitle';
import AssetFundingButton from 'components/AssetFunding/assetFundingButton';
import AssetFundingConfirmingMessage from './assetFundingConfirmingMessage';
import Separator from 'UI/Separator';

const separatorStyleFullWidth = {
  position: 'absolute',
  left: '0px',
  marginTop: '10px',
}

const AssetFundingConfirming = ({
  cancel,
}) => {
  return (
    <React.Fragment>
      <AssetFundingTitle
        text="Confirming on the Blockchain"
        onClick={cancel}
      />
      <Separator style={separatorStyleFullWidth}/>
      <div style={{padding: '0% 10%'}}>
        <AssetFundingConfirmingMessage>
          Please follow our notifications that will guide you through the process of contributing.
          Your portfolio will update as soon as the contribution is successful.
        </AssetFundingConfirmingMessage>
        <Link
          href="/portfolio"
        >
          <AssetFundingButton
            size="large"
            type="primary"
          >
            Explore your Portfolio
          </AssetFundingButton>
        </Link>
      </div>
    </React.Fragment>
  )
}

export default AssetFundingConfirming;
