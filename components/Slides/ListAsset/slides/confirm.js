import styled from 'styled-components';
import {
  CarouselSlide,
  CarouselSlideMainTitle,
  CarouselSlideParagraph,
} from 'components/CarouselSlide/';
import AlertMessage from 'UI/AlertMessage';
import {
  getPlatformToken,
} from 'constants/app';
import {
  formatValueForToken,
} from 'utils/helpers';
import TermsAndConditions from 'UI/TermsAndConditions';
import { useMetamaskContext } from 'components/MetamaskContext';

const InformationWrapper = styled.div`
  b{
    font-size: 16px;
    font-weight: 500;
  }

  p{
    font-size: 14px;
  }

  ${({ theme }) => theme.tablet`
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

`;

export const ConfirmSlide = ({
  formData,
  isUserListingAsset,
  setUserListingAsset,
  listedAssetId,
  maxWidthDesktop,
  error,
  shouldShowToSCheckmark,
  checkedToS,
  setCheckedToS,
}) => {
  const { network } = useMetamaskContext();
  const formattedCollateral = formatValueForToken(formData.collateralInPlatformToken, getPlatformToken(network));
  return (
    <CarouselSlide>
      <CarouselSlideMainTitle
        isLong
        isSmallMobile
        isCentered
        maxWidthDesktop={maxWidthDesktop}
      >
      Confirm information
      </CarouselSlideMainTitle>
      <CarouselSlideParagraph
        isCentered
        maxWidthDesktop={maxWidthDesktop}
      >
        Please confirm your asset information below.
      </CarouselSlideParagraph>
      <InformationWrapper>
        <section>
          <b>Location</b>
          <p>
            {formData.userCity === '' ? '[city missing]' : formData.userCity}
/
            {formData.userCountry === ''
              ? '[country missing]'
              : formData.userCountry}
          </p>
        </section>
        <section>
          <b>Asset</b>
          <p>
            {formData.asset === '' ? '[asset missing]' : formData.asset}
          </p>
        </section>
        <section>
          <b>Supporting documents</b>
          <p>
            {formData.fileList.length === 0
              ? '[files not uploaded]'
              : formData.fileList.map(file => (
                <span
                  key={file.name}
                  className="Slider__confirm-entry-file"
                >
                  {file.name}
                </span>
              ))}
          </p>
        </section>
        <section>
          <b>Management fee</b>
          <p>
            {formData.managementFee}
%
          </p>
        </section>
        <section>
          <b>Asset collateral</b>
          <p>
            {`${formattedCollateral} ${getPlatformToken(network)}`}
          </p>
        </section>
        {shouldShowToSCheckmark && (
          <TermsAndConditions
            checked={checkedToS}
            onChange={event => setCheckedToS(event.target.checked)}
            style={{ marginTop: '50px' }}
          />
        )}
        {error && (
          <AlertMessageWrapper>
            <AlertMessage
              type="error"
              message={error}
              showIcon
              closable={false}
            />
          </AlertMessageWrapper>
        )}
      </InformationWrapper>
    </CarouselSlide>
  );
};
