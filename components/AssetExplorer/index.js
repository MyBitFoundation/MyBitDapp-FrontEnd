import { compose } from 'recompose';
import {
  Switch,
  Icon,
} from 'antd';
import CategoryFilter from 'components/CategoryFilter';
import AssetDisplayer from 'components/AssetDisplayer';
import ExploreFilters from './exploreFilters';
import ExploreFiltersSwitch from './exploreFiltersSwitch';
import {
  FundingStages,
} from 'constants/fundingStages';
import { SORT_BY_ASSETS } from 'constants/sortByAssets';
import {
  getValueFromLocalStorage,
  setValueLocalStorage,
} from 'utils/helpers';
import { Categories } from 'constants/categories';
import { DefaultAsset } from 'UI/Asset';

class AssetExplorer extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    const {
      fundingActive,
      sortByFilterSelected,
      buildState,
      useLocalStorage,
      EXPLORE_PAGE_FUNDING_ACTIVE,
      EXPLORE_PAGE_SORT_BY,
      EXPLORE_PAGE_SELECTED_FILTERS,
    } = props;

    if (useLocalStorage) {
      this.state = {
        fundingActive: getValueFromLocalStorage(EXPLORE_PAGE_FUNDING_ACTIVE, 'true') === 'true',
        sortByFilterSelected: getValueFromLocalStorage(EXPLORE_PAGE_SORT_BY),
        ...this.buildState(useLocalStorage),
      };
    } else {
      this.state = {
        fundingActive: fundingActive === undefined ? true : fundingActive,
        sortByFilterSelected: props.sortByFilterSelected || '',
        ...this.buildState(useLocalStorage),
      };
    }
  }

  buildState = (useLocalStorage) => {
    let selectedFilters;
    if (useLocalStorage) {
      const { EXPLORE_PAGE_SELECTED_FILTERS } = this.props;
      selectedFilters = getValueFromLocalStorage(EXPLORE_PAGE_SELECTED_FILTERS, Categories, true);
    } else {
      selectedFilters = Categories;
    }

    return {
      selectedFilters,
    };
  }

  handleCheckedSortBy = (sortByValue, isChecked) => {
    const {
      useLocalStorage,
      EXPLORE_PAGE_SORT_BY,
    } = this.props;

    const value = isChecked && sortByValue;
    this.setState({
      sortByFilterSelected: value,
    });
    if (useLocalStorage) {
      if (isChecked) {
        setValueLocalStorage(EXPLORE_PAGE_SORT_BY, value);
      } else {
        localStorage.removeItem(EXPLORE_PAGE_SORT_BY);
      }
    }
  }

  setFilterState = (filterName, newState) => {
    const {
      useLocalStorage,
      EXPLORE_PAGE_SELECTED_FILTERS,
    } = this.props;

    let { selectedFilters } = this.state;

    if (!newState) {
      selectedFilters = selectedFilters.filter(flter => flter !== filterName);
    } else {
      selectedFilters = [...selectedFilters, filterName];
    }
    this.setState({
      selectedFilters,
    });

    if (useLocalStorage) {
      setValueLocalStorage(EXPLORE_PAGE_SELECTED_FILTERS, selectedFilters, true);
    }
  }

  render = () => {
    const {
      assets,
      EXPLORE_PAGE_FUNDING_ACTIVE,
      useLocalStorage,
    } = this.props;

    const { fundingActive } = this.state;
    
    const {
      selectedFilters,
      sortByFilterSelected,
    } = this.state;
    let assetsFiltered;

    /**
     * @todo - altered assetsFiltered declation as part of reqs for issue #600.
     */
    if ( assets !== undefined ) {
      let assetsFiltered = assets.slice();
      // filter by categories and whether active
      assetsFiltered = assetsFiltered.filter((asset) => {
        if (((fundingActive && asset.fundingStage === FundingStages.IN_PROGRESS && !asset.pastDate) || (!fundingActive && (asset.funded || asset.pastDate)))) {
          return true;
        }
        return false;
      });
      // handle sorting
      if (sortByFilterSelected) {
        const compareTo = SORT_BY_ASSETS.filter(sort => sort.name === sortByFilterSelected)[0].compare;
        assetsFiltered = assetsFiltered.sort(compareTo);
      }
    } else {
      assetsFiltered = [];
    }

    return (
      <React.Fragment>
        <ExploreFilters>
          <CategoryFilter
            allFilters={Categories}
            selectedFilters={this.state.selectedFilters}
            setFilterState={this.setFilterState}
            subFilters={SORT_BY_ASSETS}
            sortByFilterSelected={sortByFilterSelected}
            handleCheckedSortBy={this.handleCheckedSortBy}
          />
        </ExploreFilters>
        <ExploreFiltersSwitch>
          <span>Funding Active</span>
          <Switch
            onChange={(isFundingActive) => {
              this.setState({ fundingActive: isFundingActive });
              useLocalStorage && setValueLocalStorage(EXPLORE_PAGE_FUNDING_ACTIVE, isFundingActive);
            }}
            checked={fundingActive}
            checkedChildren={<Icon type="check" />}
            unCheckedChildren={<Icon type="close" />}
          />
        </ExploreFiltersSwitch>
        <AssetDisplayer
          assets={assetsFiltered}
          assetToRender={DefaultAsset}
          addInvestmentLabel
        />
      </React.Fragment>
    );
  }
}

export default AssetExplorer;