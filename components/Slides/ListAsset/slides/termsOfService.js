import styled from 'styled-components';
import {
  CarouselSlide,
  CarouselSlideMainTitle,
  CarouselSlideParagraph,
  CarouselNextButton,
} from 'components/CarouselSlide/';
import AlertMessage from 'UI/AlertMessage';
import { TERMS_OF_SERVICE } from 'constants/termsOfService';

const InformationWrapper = styled.div`
  b{
    font-size: 16px;
    font-weight: 500;
  }

  p{
    font-size: 14px;
  }

  ${({theme}) => theme.tablet`
    width: 90%;
    margin: 0 auto;
  `}
`;

const AlertMessageWrapper = styled.div`
  .ant-alert{
    padding: 8px 10px 8px 37px;
  }

  .ant-alert-message p {
    margin: 0px 0px !important;
  }

`

export const TermsOfServiceSlide = ({
  maxWidthDesktop,
  desktopMode,
  onClick,
}) => {
  return (
    <CarouselSlide
      maxWidthDesktop={maxWidthDesktop}
      hasBoxShadow={desktopMode}
      desktopMode={desktopMode}
    >
      <CarouselSlideMainTitle
        isLong
        isSmallMobile
        isCentered
        maxWidthDesktop={maxWidthDesktop}
      >
        Terms and Conditions
      </CarouselSlideMainTitle>
      <InformationWrapper>
        {TERMS_OF_SERVICE}
        {desktopMode && (
          <CarouselNextButton
            onClick={onClick}
            desktopMode={desktopMode}
            style={{
              marginTop: '10px',
            }}
          >
            I Agree
          </CarouselNextButton>
        )}
      </InformationWrapper>
    </CarouselSlide>
  );
}
