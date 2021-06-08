import React from 'react';
import { hot } from 'react-hot-loader/root';
import App, { Container } from 'next/app';
import AirtableProvider, { withAirtableContext } from 'components/AirtableContext';
import BlockchainProvider from 'components/BlockchainContext';
import KyberProvider from 'components/KyberContext';
import AssetsProvider from 'components/AssetsContext';
import NotificationsProvider from 'components/NotificationsContext';
import ThreeBoxProvider from 'components/ThreeBoxContext';
import TermsOfServiceProvider from 'components/TermsOfServiceContext';
import Notifications from 'components/Notifications';
import MetamaskProvider from 'components/MetamaskContext';
import Head from 'components/Head';
import GlobalStyle from 'components/globalStyle';
import AppWrapper from 'components/AppWrapper';
import Theme from 'components/Theme';
import MobileMenu from 'components/MobileMenu';
import Cookie from 'js-cookie';
import Router from 'next/router';
import Footer from 'UI/Footer';
import { navbarOptions } from 'constants/navigationBar';
import { FULL_SCREEN_PAGES } from 'constants/fullScreenPages';
import { COOKIES } from 'constants/cookies';
import { SUPPORTED_NETWORKS } from 'constants/supportedNetworks';
import * as Sentry from '@sentry/browser';

import '../antd-custom.less';

Sentry.init({
  enabled: process.env.NODE_ENV === 'production',
  dsn: 'https://f1d70091b2dd46b5970f57e913c15175@o423064.ingest.sentry.io/5352731',
});
class MyApp extends App {
  state = {
    mobileMenuOpen: false,
    network: undefined,
    userHasMetamask: undefined,
  };

  saveFirstVisit = () => {
    try {
      if (!Cookie.get(COOKIES.NEW_USER)) {
        Cookie.set(COOKIES.NEW_USER, 'true');
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  setNetwork = network => this.setState({ network })

  setUserHasMetamask = userHasMetamask => this.setState({ userHasMetamask })
  
  setUserIsLoggedIn = userIsLoggedIn => this.setState({ userIsLoggedIn })

  prefetchPages = () => {
    Router.prefetch('/onboarding');
    Router.prefetch('/asset-manager');
    Router.prefetch('/asset');
    Router.prefetch('/transaction-history');
    Router.prefetch('/explore');
    Router.prefetch('/portfolio');
    Router.prefetch('/help');
    Router.prefetch('/watch-list');
    Router.prefetch('/list-asset');
  };

  componentDidMount = () => {
    require('utils/disableReactDevTools');
    this.prefetchPages();
    this.saveFirstVisit();
  };

  handleMobileMenuClicked = (state) => {
    this.setState({
      mobileMenuOpen: state,
    });
  };

  componentDidCatch(error, errorInfo) {
    Sentry.withScope((scope) => {
      Object.keys(errorInfo).forEach((key) => {
        scope.setExtra(key, errorInfo[key]);
      });

      Sentry.captureException(error);
    });

    super.componentDidCatch(error, errorInfo);
  }

  render() {
    const { Component, pageProps, router } = this.props;
    const { mobileMenuOpen, network, userHasMetamask, userIsLoggedIn } = this.state;

    const isFullScreenPage = FULL_SCREEN_PAGES.includes(router.pathname);

    return (
      <React.Fragment>
        <GlobalStyle />
        <Head />
        <Theme>
          <WithProviders
            setNetwork={this.setNetwork}
            setUserHasMetamask={this.setUserHasMetamask}
            setUserIsLoggedIn={this.setUserIsLoggedIn}
            network={network}
            userHasMetamask={userHasMetamask}
            userIsLoggedIn={userIsLoggedIn}
          >
            <Notifications />
            <MobileMenu
              isOpen={mobileMenuOpen}
              items={navbarOptions}
              currentPath={router.route}
              handleMobileMenuState={this.handleMobileMenuClicked}
            >
              <React.Fragment>
                <AppWrapper
                  isFullScreenPage={isFullScreenPage}
                  handleMobileMenuState={this.handleMobileMenuClicked}
                >
                  <React.Fragment>
                    <Component {...pageProps} currentPath={router.route} />
                  </React.Fragment>
                </AppWrapper>
                <Footer isFullScreenPage={isFullScreenPage} />
              </React.Fragment>
            </MobileMenu>
          </WithProviders>
        </Theme>
      </React.Fragment>
    );
  }
}

const WithProviders = ({
  children, setNetwork, network, setUserHasMetamask, userHasMetamask, setUserIsLoggedIn, userIsLoggedIn
}) => (
  <NotificationsProvider>
    <AirtableProvider
      network={network}
      userHasMetamask={userHasMetamask}
    >
      <KyberProvider
        network={network}
        supportedNetworks={SUPPORTED_NETWORKS}
        userHasMetamask={userHasMetamask}
      >
        <MetamaskProvider
          supportedNetworks={SUPPORTED_NETWORKS}
          setNetwork={setNetwork}
          setUserHasMetamask={setUserHasMetamask}
          setUserIsLoggedIn={setUserIsLoggedIn}
        >
          <AssetsProvider>
            <BlockchainProvider
              supportedNetworks={SUPPORTED_NETWORKS}
            >
              <ThreeBoxProvider>
                <TermsOfServiceProvider>
                  {children}
                </TermsOfServiceProvider>
              </ThreeBoxProvider>
            </BlockchainProvider>
          </AssetsProvider>
        </MetamaskProvider>
      </KyberProvider>
    </AirtableProvider>
  </NotificationsProvider>
);

export default hot(MyApp);
