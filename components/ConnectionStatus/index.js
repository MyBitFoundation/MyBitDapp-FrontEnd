import React from 'react';
import styled, { css } from 'styled-components';
import ConnectionStatusWrapper from './connectionStatusWrapper';
import Tooltip from 'UI/Tooltip';
import InfoIcon from 'static/info-icon-dark.svg';

const StyledTooltip = styled(Tooltip)`
  margin-left: 10px;
  width: 20px;
  height: 20px;
  position: relative;
  top: -1px;
`

const Label = styled.div`
  :before{
    content: ' ';
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #24F281;
    position: absolute;
    left: 10px;
    top: 10px;
  }

  ${props => !props.connected && css`
    :before{
      background-color: red;
    }
  `}
`
const LabelAndIconWrapper = styled.div`
  display: flex;
  align-items: center;

  svg{
    margin-left: 5px;
  }
`

const ConnectionStatus = ({
  metamaskErrors,
}) => {
  const connected = !metamaskErrors.error || false;
  return connected ? null : (
    <LabelAndIconWrapper>
      <ConnectionStatusWrapper>
        <Label
          connected={connected}
        >
          {connected ? 'Connected' : 'Not Connected'}
        </Label>
      </ConnectionStatusWrapper>
      {!connected && (
        <StyledTooltip
          tooltipProps={{
            placement: 'bottomLeft',
            title: metamaskErrors.render,
            arrowPointAtCenter: true,
          }}
        >
          <InfoIcon />
        </StyledTooltip>
      )}
    </LabelAndIconWrapper>
  )
}

export default ConnectionStatus;
