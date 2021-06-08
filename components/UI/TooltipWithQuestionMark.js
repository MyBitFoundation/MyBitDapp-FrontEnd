import styled from 'styled-components';
import questionTooltip from "static/list-asset/questionTooltip.png";
import Tooltip from 'UI/Tooltip';

const Img = styled.img`
  width: 20px;
  height: 20px;
`

const TooltipWithQuestionMark = (props) => (
  <Tooltip tooltipProps={{...props}}>
    <Img src={questionTooltip} />
  </Tooltip>
)

export default TooltipWithQuestionMark;
