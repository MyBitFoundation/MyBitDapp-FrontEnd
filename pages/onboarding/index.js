import CarouselWithNavigation from 'UI/CarouselWithNavigation';
import {
  Slides,
} from 'components/Slides/Onboarding/slides';
import Router from 'next/router';
import BancorProvider from 'components/BancorContext';

const SliderNavigationTooltips = [
  { slide: 0, tooltip: 'What is MyBit?' },
  { slide: 1, tooltip: 'What can you use MyBit for?' },
  { slide: 2, tooltip: 'What it isn\'t?' },
  { slide: 3, tooltip: 'What is blockchain?' },
  { slide: 4, tooltip: 'What are the benefits?' },
  { slide: 5, tooltip: 'What is Ethereum?' },
  { slide: 6, tooltip: 'Smart contracts' },
  { slide: 7, tooltip: 'How do I invest?' },
  { slide: 8, tooltip: 'How to secure my assets?' },
  { slide: 9, tooltip: 'Required setup' },
];

class OnboardingPage extends React.Component {
  componentDidMount = () => {
    const {
      redirectTo,
    } = this.props;
    // When we redirect to this page on the server the
    // URL doesn't actually update. We already have
    // onboarding.js at this point so its inconsequent.
    // until a fix is found at least.
    if (window && redirectTo) {
      Router.push('/onboarding');
    }
    this.firstLocation = redirectTo;
    // The path / should redirect to /explore, user's first visit for example
    if (!redirectTo || (redirectTo && redirectTo.href === '/' && redirectTo.as === '/')) {
      this.firstLocation = {
        href: '/explore',
        as: '/explore',
      };
    }
  }

  finishOnboarding = () => {
    Router.push(this.firstLocation.href, this.firstLocation.as);
  }

  render() {
    return (
      <React.Fragment>
        <BancorProvider>
          <CarouselWithNavigation
            redirectOnClose={this.firstLocation}
            navigationTooltips={SliderNavigationTooltips}
            slides={Slides}
            onFinish={this.finishOnboarding}
            maxWidthDesktop="600px"
            nextButtonHasArrow
          />
        </BancorProvider>
      </React.Fragment>
    );
  }
}

export const getInitialProps = async (ctx) => {
  if (ctx.req) {
    return { props: { redirectTo: ctx.query.redirectTo } };
  }
  return { props: {} };
};

export default OnboardingPage;
