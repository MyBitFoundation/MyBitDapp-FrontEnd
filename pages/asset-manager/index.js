import Router from 'next/router';
import {
  Slides,
} from 'components/Slides/AssetManager/slides';

import CarouselWithNavigation from 'UI/CarouselWithNavigation';

const SliderNavigationTooltips = [
  { slide: 0, tooltip: 'KYC' },
  { slide: 1, tooltip: 'Location' },
  { slide: 2, tooltip: 'Select Asset' },
  { slide: 3, tooltip: 'Asset Location' },
  { slide: 4, tooltip: 'Supporting Documents' },
];

const AssetManager = () => (
  <React.Fragment>
    <CarouselWithNavigation
      redirectOnClose={{
        href: 'list-asset',
        as: 'list-asset',
      }}
      navigationTooltips={SliderNavigationTooltips}
      slides={Slides}
      onFinish={() => Router.push('/list-asset')}
      maxWidthDesktop="550px"
      nextButtonHasArrow
    />
  </React.Fragment>
);

export default AssetManager;
