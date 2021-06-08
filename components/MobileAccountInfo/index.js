import Router from 'next/router';
import Address from 'UI/Address';
import Balance from 'components/Balance';
import MobileAccountInfoBalance from './mobileAccountInfoBalance';
import MobileAccountInfoNoAccount from './mobileAccountInfoNoAccount';
import MobileAccountCircle from './mobileAccountCircle';
import { withMetamaskContext } from 'components/MetamaskContext';

const MobileAccountInfo = ({
  metamaskContext,
  handleMobileMenuState,
}) =>  {
  const{
    user,
    isReadOnlyMode,
  } = metamaskContext;
  const balance = user.avgBalance || null;

  const addressToRender = (!isReadOnlyMode && user.address) ? (
    <Address
      {...user}
      isMobile
    />
  ) : (
    <MobileAccountInfoNoAccount>
      <MobileAccountCircle />
      <span>No account loaded</span>
    </MobileAccountInfoNoAccount>
  )

  return (
    <div>
      <div onClick={() => {
        Router.push(`/asset-managers?id=${user.address}`, `/asset-managers/${user.address}`)
        handleMobileMenuState(false);
      }}
      style={{cursor: 'pointer'}}>
        {addressToRender}
      </div>
      <MobileAccountInfoBalance>
        <Balance
          balance={balance}
          isMobile
          noInfo={isReadOnlyMode || !user.address}
        />
      </MobileAccountInfoBalance>
    </div>
  )
}

export default withMetamaskContext(MobileAccountInfo);
