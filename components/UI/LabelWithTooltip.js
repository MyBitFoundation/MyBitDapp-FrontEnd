import styled from 'styled-components';
import TooltipWithQuestionMarkGrey from 'UI/TooltipWithQuestionMarkGrey';

const TooltipWrapper = styled(TooltipWithQuestionMarkGrey)`
  margin-left: 5px;
`
const LabelWithTooltipWrapper = styled.div`
  display: flex;
  align-items: center;
`

const LabelWithTooltip = ({
  title,
  tooltipText,
  isDark,
  style,
}) => (
  <LabelWithTooltipWrapper style={style}>
    {title}
    <TooltipWrapper
      overlayClassName={isDark ? 'AssetManagerTooltip' : ''}
      arrowPointAtCenter
      placement="top"
      destroyTooltipOnHide
      title={tooltipText}
    />
  </LabelWithTooltipWrapper>
);

export default LabelWithTooltip;
