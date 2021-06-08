import {
  InputNumber,
  Button,
  Modal,
} from 'antd';
import styled from 'styled-components';
import NumericInput from 'UI/NumericInput';
import {
  DEFAULT_TOKEN_MAX_DECIMALS,
  DEFAULT_TOKEN,
} from 'constants/app';
import { MYBIT_FOUNDATION_SHARE } from 'constants/platformFees';

const PLATFORM_FEE = MYBIT_FOUNDATION_SHARE * 100;

const InputRevenueGeneratorNumber = styled(NumericInput)`
  width: 167px;
  margin-bottom: 15px;
`

const InputRevenueGeneratorWarning = styled.p`
  font-size: 16px;
`

const InputRevenueGeneratorLabel = styled.span`
  font-weight: 500;
  display: block;
  color: ${({theme}) => theme.colors.grayBase};
`

const FundsSplitWrapper = styled.div`
  color: ${({theme}) => theme.colors.black3};
  line-height: 22px;
`

const MessageToManager = styled.p`
  line-height: 20px;
  color: ${({theme}) => theme.colors.black3};
`

const InputRevenueGenerator = ({
  onConfirm,
  onCancel,
  currentValue,
  onValueChange,
  managerPercentage,
}) => (
  <Modal
    visible={true}
    footer={null}
    onOk={onConfirm}
    onCancel={onCancel}
    title={`Deposit Revenue`}
    style={{width: '387px'}}
  >
    <InputRevenueGeneratorLabel>
      Revenue to Deposit
    </InputRevenueGeneratorLabel>
    <InputRevenueGeneratorNumber
      value={currentValue}
      label={DEFAULT_TOKEN}
      onChange={onValueChange}
      min={1}
      decimalPlaces={2}
      step={1}
    />
    <MessageToManager>Deposit all of the revenue. Your Manager’s Fee will be sent back to you to withdraw.
     We know that it sounds a bit funny but we really believe in your honesty.</MessageToManager>
    <FundsSplitWrapper>
      <div>Funds are split as follows:</div>
      <div>Your Share - {managerPercentage}%</div>
      <div>Platform Fee - {PLATFORM_FEE}%</div>
      <div>Split between the Investors - {100 - managerPercentage - PLATFORM_FEE}%</div>
    </FundsSplitWrapper>
    <Button
      key="submit"
      type="primary"
      onClick={onConfirm}
      size="large"
      style={{width: '100%', display: 'block', marginTop: '25px'}}
      disabled={isNaN(currentValue) || currentValue === 0}
    >
      Deposit Revenue
    </Button>
  </Modal>
);

export default InputRevenueGenerator;
