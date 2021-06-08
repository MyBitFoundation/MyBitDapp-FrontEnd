import styled from 'styled-components';
import { Checkbox } from 'antd';
import {
  CarouselSlide,
  CarouselSlideMainTitle,
  CarouselSlideParagraph,
  CarouselNextButton,
} from 'components/CarouselSlide/';
import TextAreaWithLabel from 'UI/TextAreaWithLabel';
import {
  DEFAULT_TOKEN,
} from 'constants/app';
import NumericInput from 'UI/NumericInput';

const TextAreaWrapper = styled.div`
  margin-bottom: 10px;
`;
const Label = styled.div`
  font-weight: 500;
  display: block;
  color: ${({ theme }) => theme.colors.grayBase};
`;

export const GeneralDescriptionSlide = ({
  maxWidthDesktop,
  handleInputChange,
  desktopMode,
  onClick,
  nextButtonDisabled,
  formData,
  handleSelectChange,
}) => (
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
      <React.Fragment>
          General Description
      </React.Fragment>
    </CarouselSlideMainTitle>
    <CarouselSlideParagraph
      isCentered
      maxWidthDesktop={maxWidthDesktop}
    >
        Tell the community about the project. Why do you think it will work? Provide financial details and the associated risks.
    </CarouselSlideParagraph>
    <TextAreaWrapper>
      <TextAreaWithLabel
        label="About"
        placeholder="Tell us about the asset and why you think it will work."
        textAreaName="about"
        onChange={handleInputChange}
        value={formData.about}
        rows={5}
        required
      />
    </TextAreaWrapper>
    <TextAreaWrapper>
      <TextAreaWithLabel
        label="Financials"
        placeholder="Describe financial details, estimated ROI, etc."
        textAreaName="financials"
        onChange={handleInputChange}
        value={formData.financials}
        rows={5}
        required
      />
    </TextAreaWrapper>
    <TextAreaWrapper>
      <TextAreaWithLabel
        label="Risks"
        placeholder="Describe what the associated risks are."
        textAreaName="risks"
        onChange={handleInputChange}
        value={formData.risks}
        rows={5}
        required
      />
    </TextAreaWrapper>
    {desktopMode && (
    <CarouselNextButton
      onClick={onClick}
      disabled={nextButtonDisabled}
      style={{ marginTop: '20px' }}
      desktopMode={desktopMode}
    />
    )}
  </CarouselSlide>
);
