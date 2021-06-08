import React from 'react';
import QuestionTooltip from "static/info.svg";
import Tooltip from 'UI/Tooltip';

const TooltipWithQuestionMarkGrey = (props) => (
  <Tooltip tooltipProps={{...props}}>
    <QuestionTooltip />
  </Tooltip>
)

export default TooltipWithQuestionMarkGrey;
