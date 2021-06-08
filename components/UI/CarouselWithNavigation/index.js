import Router from 'next/router';
import Link from 'next/link';
import { Icon } from 'antd';
import Tooltip from 'UI/Tooltip';
import CarouselWithNavigationContainer from './carouselWithNavigationContainer';
import CarouselWithNavigationSlide from './carouselWithNavigationSlide';
import CarouselWithNavigationNavButton from './carouselWithNavigationNavButton';
import CarouselWithNavigationCloseButton from './carouselWithNavigationCloseButton';
import CarouselWithNavigationNav from './carouselWithNavigationNav';
import CarouselWithNavigationButtons from './carouselWithNavigationButtons';
import CarouselWithNavigationButton from './carouselWithNavigationButton';
import CarouselWithNavigationArrow from './carouselWithNavigationArrow';
import CarouselWithNavigationWrapper from './carouselWithNavigationWrapper';
import RightArrow from '../../static/onboarding/arrow-right.png';

class CarouselWithNavigation extends React.Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToSlide = this.goToSlide.bind(this);
    this.state = {
      currentSlide: 0,
    };
  }

  next() {
    this.carousel.next();
  }

  previous() {
    this.carousel.prev();
  }

  goToSlide(number) {
    this.carousel.goTo(number, false);
  }

  render() {
    const { currentSlide } = this.state;

    const {
      slides,
      navigationTooltips = [],
      onFinish,
      maxWidthDesktop,
      desktopAt,
      nextButtonHasArrow,
      redirectOnClose,
      disableMovingForward,
    } = this.props;

    const {
      hasBackButton,
      hasNextButton,
      nextButtonText,
      nextButtonDisabledText,
      hasOneButton,
      nextButtonDisabled,
      nextButtonHandler,
      nextButtonLoading,
      onSuccessMoveToNextSlide,
    } = slides[currentSlide].buttons;

    const { error, hideButtons } = slides[currentSlide];

    const hasTwoButtons = hasNextButton && hasBackButton;

    const closeButtonProps = typeof redirectOnClose === 'string'
      ? { href: redirectOnClose }
      : !redirectOnClose
        ? { href: '/explore' }
        : redirectOnClose;

    return (
      <CarouselWithNavigationWrapper
        desktopAt={desktopAt}
        maxWidthDesktop={maxWidthDesktop}
      >
        <CarouselWithNavigationCloseButton>
          <Link {...closeButtonProps} passHref>
            <a>+</a>
          </Link>
        </CarouselWithNavigationCloseButton>
        <CarouselWithNavigationContainer
          desktopAt={desktopAt}
          maxWidthDesktop={maxWidthDesktop}
          slideNumber={currentSlide}
          ref={(node) => {
            this.carousel = node;
          }}
          effect="slide"
          dots={false}
          infinite={false}
          swipe={false}
          afterChange={(to) => {
            this.setState({
              currentSlide: to,
            });
          }}
        >
          {slides.map(({ Component, toRender }, index) => (
            <CarouselWithNavigationSlide
              key={index}
              maxWidthDesktop={maxWidthDesktop}
              desktopAt={desktopAt}
            >
              {Component && (
              <Component goToSlide={this.goToSlide} onFinish={onFinish} />
              )}
              {toRender}
            </CarouselWithNavigationSlide>
          ))}
        </CarouselWithNavigationContainer>
        {!error && !hideButtons && (
          <CarouselWithNavigationButtons
            desktopAt={desktopAt}
            hasOneButton={!hasTwoButtons}
            hasTwoButtons={hasTwoButtons}
          >
            {hasBackButton && (
              <CarouselWithNavigationButton
                key={`${nextButtonText} ${currentSlide} 'back'`}
                onClick={this.previous}
                desktopAt={desktopAt}
                isBack
              >
                Back
              </CarouselWithNavigationButton>
            )}
            {hasNextButton && (
              <CarouselWithNavigationButton
                key={`${nextButtonText} ${currentSlide} 'next'`}
                desktopAt={desktopAt}
                type="primary"
                onClick={
                  nextButtonHandler
                    ? onSuccessMoveToNextSlide
                      ? () => nextButtonHandler(this.next)
                      : nextButtonHandler
                    : currentSlide === slides.length - 1
                      ? onFinish
                      : this.next
                }
                disabled={nextButtonDisabled}
                loading={nextButtonLoading}
                isNext
              >
                {(nextButtonDisabled && (nextButtonDisabledText || 'All fields are required'))
                  || nextButtonText
                  || 'Next'}
                {!nextButtonLoading && <Icon type="right" />}
              </CarouselWithNavigationButton>
            )}
          </CarouselWithNavigationButtons>
        )}
        <CarouselWithNavigationNav hideAt={desktopAt}>
          {navigationTooltips.map(slideTooltip => (
            <Tooltip
              tooltipProps={{
                title: slideTooltip.tooltip,
              }}
              key={`slideTooltip${slideTooltip.slide}`}
            >
              <CarouselWithNavigationNavButton
                isActive={currentSlide === slideTooltip.slide}
                onClick={() => this.goToSlide(slideTooltip.slide)}
                disabled={
                    disableMovingForward && slideTooltip.slide > currentSlide
                  }
              />
            </Tooltip>
          ))}
        </CarouselWithNavigationNav>
      </CarouselWithNavigationWrapper>
    );
  }
}

export default CarouselWithNavigation;
