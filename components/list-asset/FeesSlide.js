import styled from 'styled-components';
import {
  CarouselSlide,
  CarouselSlideMainTitle,
  CarouselSlideParagraph,
  CarouselSlideInputNumber,
  CarouselSlideSlider,
  CarouselSlideTooltip,
  CarouselNextButton,
} from 'components/CarouselSlide/';

import {
  Slider
} from 'antd';

const Image = styled.img`
  position: relative;
  margin: 40px auto;
  width: 83px;
  height: 100px;
  display: block;
}`

const formatter = (value) => {
  return `${value}%`;
}

const FeesSlide = ({
  maxWidthDesktop,
  handleSelectChange,
  managementFee,
  desktopMode,
  onClick,
  nextButtonDisabled,
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
        Management fee
        <CarouselSlideTooltip
          title="Management fees are paid out every month from profits generated by the asset."
        />
      </React.Fragment>
    </CarouselSlideMainTitle>
    <CarouselSlideParagraph
      isCentered
      maxWidthDesktop={maxWidthDesktop}
    >
      Here you can calculate your fee for managing the asset. This fee should
      include any financial costs you expect to incur in order to keep the
      asset maintained and in full working order.
    </CarouselSlideParagraph>
    <Image
      src="/list-asset/assetList_coins.png"
      alt="Earth"
    />
    <CarouselSlideSlider
      isCentered
      tipFormatter={formatter}
      min={1}
      max={100}
      value={managementFee}
      onChange={value => handleSelectChange(value, "managementFee")}
      defaultValue={managementFee}
    />
    <CarouselSlideInputNumber
      isCentered
      defaultValue={managementFee}
      min={1}
      max={100}
      value={managementFee}
      formatter={value => `${value}%`}
      parser={value => value.replace("%", "")}
      onChange={value => handleSelectChange(value, "managementFee")}
    />
    {desktopMode && (
      <CarouselNextButton
        onClick={onClick}
        disabled={nextButtonDisabled}
        desktopMode={desktopMode}
      />
    )}
  </CarouselSlide>
);

export default FeesSlide;
