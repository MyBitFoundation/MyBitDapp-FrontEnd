import styled from 'styled-components';
import ChangesButtonWithLabel from 'components/ChangesButtonWithLabel';
import TextAreaWithLabel from 'UI/TextAreaWithLabel';
import { withBlockchainContext } from 'components/BlockchainContext';

const Wrapper = styled.div`
  min-height: 400px;
  border-radius: 4px;
  box-shadow: 0 4px 12px 0 rgba(0,0,0,0.1);
  padding: 0% 10%;
}`;

const Title = styled.span`
  line-height: 20px;
  font-size: 20px;
  text-align: center;
  color: #383838;
  display: block;
  padding-top: 50px;
  margin-bottom: 30px;
  ${({ theme }) => theme.tablet`
    padding-top: 20px;
  `}
}`;

const TextAreaWithLabelWrapper = styled.div`
  margin-bottom: 10px;

  span{
    text-transform: capitalize;
  }
`;

const SECTIONS = ['about', 'financials', 'risks', 'fees'];
const SECTIONS_TEXT = {
  fees: 'Additional Costs',
};

class GeneralDescriptionEditor extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ...this.buildInitialState(props.asset),
      changes: false,
    };
  }

  buildInitialState = (asset) => {
    const initialState = {};
    SECTIONS.map((section) => {
      if (asset[section]) {
        initialState[section] = asset[section];
      }
    });
    return initialState;
  }

  handleOnClick = () => {
    try {
      this.setState({
        changes: false,
        uploading: true,
      });
      const { asset } = this.props;
      const { assetId } = asset;
      const { updateAssetListingIpfs } = this.props.blockchainContext;
      const assetWithUpdatedFiles = { ...asset, files: asset.files ? [...asset.files] : [] };
      // update asset object with new properties
      const newAsset = { ...asset };
      SECTIONS.map((section) => {
        if (newAsset[section]) {
          newAsset[section] = this.state[section];
        }
      });
      updateAssetListingIpfs(newAsset, (success) => {
        this.setState({ uploading: false, changes: !success });
      });
    } catch (err) {
      console.error(err);
    }
  }

  handleInputChange = (value, section) => {
    this.setState({ [section]: value }, () => {
      for (let i = 0; i < SECTIONS.length; i++) {
        const section = SECTIONS[i];
        if (this.state[section] !== this.props.asset[section]) {
          this.setState({ changes: true });
          return;
        }
      }
      this.setState({ changes: false });
    });
  }

  render = () => {
    const {
      changes,
      uploading,
    } = this.state;
    return (
      <Wrapper>
        <Title>General Description</Title>
        <div style={{ paddingBottom: '100px' }}>
          {SECTIONS.map(section => this.state[section] && (
            <TextAreaWithLabelWrapper key={section}>
              <TextAreaWithLabel
                label={SECTIONS_TEXT[section] || section}
                placeholder={this.state[section]}
                textAreaName={section}
                // onChange={(e) => {
                //   this.handleInputChange(e.target.value, section);
                // }}
                value={this.state[section]}
                rows={5}
                readOnly
              />
            </TextAreaWithLabelWrapper>
          ))}
        </div>
        {/* <ChangesButtonWithLabel
          changes={changes}
          onClick={this.handleOnClick}
          loading={uploading}
          loadingText="Uploading"
        /> */}
      </Wrapper>
    );
  }
}

export default withBlockchainContext(GeneralDescriptionEditor);
