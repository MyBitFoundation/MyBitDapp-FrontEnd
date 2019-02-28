import styled from 'styled-components';

const StyledMobileCloseButton = styled.div`
  position: absolute;
  top: 20px;
  right: 0px;

  .anticon-close{
    font-size: 19px;
    font-weight: 600;
    position: absolute;
    right: 20px;
    cursor: pointer;
  }

  svg{
    fill: black;
  }
}`

export default StyledMobileCloseButton;