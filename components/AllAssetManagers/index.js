import styled from 'styled-components';
import {
  Table,
} from 'antd';
import Loading from 'components/Loading';
import GetColumns from 'constants/assetManagers';
import PageTitle from 'UI/PageTitle';

const TableWrapper = styled.div`
  table a:focus{
    text-decoration: none;
  }
  overflow-x: auto;
`

class AllAssetManagers extends React.Component {
  state = {
    itemsPerPage: 10,
    sortedInfo: {
      order: 'descend',
      columnKey: 'date',
    },
    filteredInfo: {},
    loadingManagersData: true,
  };

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      sortedInfo: sorter,
      filteredInfo: filters,
    }, this.getData);
  }

  componentWillMount = () => {
    this.getData()
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    const oldAssetManagers = this.props.assetsContext.assetManagers;
    const newAssetManagers = nextProps.assetsContext.assetManagers;
    const oldLoadingAssets = this.props.assetsContext.loadingAssets;
    const newloadingAssets = nextProps.assetsContext.loadingAssets;
    if(Object.keys(oldAssetManagers).length === 0 && Object.keys(newAssetManagers).length > 0 || oldLoadingAssets && !newloadingAssets){
      this.getData(nextProps);
      return false;
    }

    return true;
  }

  getData = nextProps => {
    const {
      assetsContext,
      network,
    } = nextProps || this.props;
    const {
      assetManagers,
      loadingAssets,
    } = assetsContext;
    if(!loadingAssets){
      const assetManagersArray = Object.entries(assetManagers).map(([key, value]) => ({
        key,
        ...value,
      }))
      const {
        itemsPerPage,
        sortedInfo,
        filteredInfo,
      } = this.state;
      const columns = GetColumns(sortedInfo, filteredInfo, network);
      this.setState({
        columns,
        assetManagersArray,
        loadingManagersData: false,
      })
    }
  }

  render() {
    const {
      assetsContext,
    } = this.props;
    const {
      loadingAssets,
    } = assetsContext;
    const {
      loadingManagersData,
      columns,
      assetManagersArray,
      itemsPerPage,
    } = this.state;
    if (loadingAssets || loadingManagersData) {
      return <Loading message="Loading Asset Managers" />;
    } else {
      return (
        <TableWrapper>
          <PageTitle>Asset Managers</PageTitle>
          <Table
            columns={columns}
            dataSource={assetManagersArray}
            pagination={{ pageSize: itemsPerPage }}
            onChange={this.handleChange}
          />
        </TableWrapper>
      );
    }
  }
}

export default AllAssetManagers;
