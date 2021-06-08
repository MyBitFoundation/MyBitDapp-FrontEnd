import styled from 'styled-components';
import TooltipWithQuestionMark from 'UI/TooltipWithQuestionMark';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 0 auto;
  width: max-content;
  margin-bottom: 20px;
  img{
    height: 15px;
    width: 15px;
  }
`

const LabelWrapper = styled.span`
  font-size: 18px;
  font-weight: 500;
  color: ${({theme}) => theme.colors.grayBase};
  margin-right: 5px;
`

const PercentageWrapper = styled.span`
  font-size: 20px;
  font-weight: 500;
  margin-right: 5px;
  color: ${({theme}) => theme.colors.black};
`

const LabelWithValueAndTooltip = ({
  collateralBasedOnHistory,
  collateralCryptoPurchase,
  collateralCryptoPayouts,
  collateralPercentage,
  totalFundedAssets,
}) => {
  return (
    <Wrapper>
      <LabelWrapper>Your Escrow:</LabelWrapper>
      <PercentageWrapper>{collateralPercentage}%</PercentageWrapper>
      {collateralPercentage > 0 && (
        <TooltipWithQuestionMark
          overlayClassName="AssetManagerTooltip"
          arrowPointAtCenter
          placement="top"
          destroyTooltipOnHide
          style={{
            maxWidth: '400px',
          }}
          title={
            <div>
              <div>For having {totalFundedAssets} funded assets: +{collateralBasedOnHistory}%</div>
              <div>{collateralCryptoPurchase > 0 ? 'Manual Purchase' : 'Crypto Purchase'}: +{collateralCryptoPurchase}%</div>
              <div>{collateralCryptoPayouts > 0 ? 'Manual Payouts' : 'Crypto Payouts'}: +{collateralCryptoPayouts}%</div>
            </div>
          }
        />
      )}
    </Wrapper>
  )
}

export default LabelWithValueAndTooltip;
