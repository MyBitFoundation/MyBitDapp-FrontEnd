import React from 'react';
import styled from 'styled-components';
import {
  Dropdown,
  Menu,
  Input,
  Icon,
  Button,
} from 'antd';
import {
  formatMonetaryValue,
} from 'utils/helpers';
import {
  DEFAULT_TOKEN,
} from 'constants/app';

import TokenBalanceItem from 'UI/TokenBalanceItem';
import TokenSelectorSearch from './tokenSelectorSearch';
import Separator from 'UI/Separator';
import TokenSelectorSearchWrapper from './tokenSelectorSearchWrapper';
import TokenSelectorAmount from './tokenSelectorAmount';
import TokenSelectorNoResults from './tokenSelectorNoResults';
import ThinkingIcon from 'static/ic_thinking.svg';
import TokenSelectorLabel from './tokenSelectorLabel';
import TokenSelectorValue from './tokenSelectorValue';

const separatorStyle = {
  position: 'relative',
  top: '5px',
};

const MenuWrapper = styled(Menu)`
  min-height: 268px;
  max-height: 328px;
  width: 284px;
  overflow-y: auto;
  overflow-x: hidden;
`;

class TokenSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedToken: DEFAULT_TOKEN,
      hoveringToken: null,
    };
    this.searchInput = React.createRef();
  }

  componentWillMount = () => {
    this.processBalances(this.props, true);
  }

  componentWillReceiveProps = (nextProps) => {
    const {
      balances,
      amountToPay,
      loading,
    } = this.props;
    // refresh info when MetamaskContext signals it finished loading new balances
    if (loading === true && nextProps.loading === false) {
      this.processBalances(nextProps, true);
    } else if (nextProps.balances && nextProps.balances != balances || nextProps.amountToPay !== amountToPay) {
      // Due to the async nature of the app, the balances object may be empty initially,
      // in which case we want to call onChange
      if (Object.keys(nextProps.balances).length > 0 && (!balances || Object.keys(balances).length === 0)) {
        this.processBalances(nextProps, true);
      } else {
        this.processBalances(nextProps, false);
      }
    } else if (balances && !nextProps.balances) {
      this.processBalances(nextProps, true);
    }
  }

  onHover = (hoveringToken) => {
    if (hoveringToken !== this.state.hoveringToken) {
      this.setState({ hoveringToken });
    }
  }

  onMouseOut = () => {
    if (this.state.hoveringToken) {
      this.setState({ hoveringToken: undefined });
    }
  }

  processBalances = (props, callOnChange) => {
    const {
      balances,
      amountToPay,
      onChange,
      selectedToken: manuallySelectedToken,
    } = props;

    let selectedToken;
    const tokensEnum = balances ? Object.entries(balances) : [];
    const totalTokens = tokensEnum.length;
    const sortedBalances = this.getSortedBalances(tokensEnum, amountToPay);

    if (totalTokens === 0 || !sortedBalances[0].enoughFunds) {
      selectedToken = DEFAULT_TOKEN;
    } else {
      selectedToken = balances?.[manuallySelectedToken]?.balanceInDai >= amountToPay ? manuallySelectedToken : sortedBalances[0].symbol;
    }

    this.setState({
      selectedToken: callOnChange ? selectedToken : this.state.selectedToken,
      totalTokens,
      tokensEnum,
      sortedBalances,
      sortedBalancesBackup: sortedBalances,
    });

    if ((manuallySelectedToken !== selectedToken) || callOnChange) {
      this.setState({ selectedToken });
      onChange(selectedToken);
    }
  }

  handleSearchInputChanged = (e) => {
    const {
      sortedBalances,
      sortedBalancesBackup,
    } = this.state;

    const searchValue = e.target.value;
    if (searchValue.trim() === '') {
      this.setState({
        sortedBalances: sortedBalancesBackup,
        searchValue,
      });
      return;
    }
    const matches = sortedBalancesBackup.filter(balance => balance.symbol.includes(searchValue.toUpperCase()));
    this.setState({
      sortedBalances: matches,
      searchValue,
    });
  }

  getTokenToConvertFrom = () => {
    const {
      sortedBalances,
    } = this.state;

    return sortedBalances.length > 0 && sortedBalances[0].enoughFunds && sortedBalances[0].symbol.toLowerCase();
  }

  getSortedBalances = (tokensEnum, amountToPay) => {
    const balancesToReturn = tokensEnum.map(([symbol, value]) => {
      const {
        balance,
        balanceInDai,
      } = value;

      return {
        enoughFunds: value.balanceInDai > amountToPay,
        symbol,
        balance,
        balanceInDai,
      };
    });

    balancesToReturn.sort((a, b) => b.balanceInDai - a.balanceInDai);
    return balancesToReturn;
  }

  getMenu = (balances, totalTokens, amountToPay, searchValue) => {
    const {
      hoveringToken,
      sortedBalancesBackup,
    } = this.state;

    const tokenToConvertFrom = hoveringToken && this.getTokenToConvertFrom();

    return (
      <MenuWrapper>
        <TokenSelectorSearchWrapper
          key="search"
        >
          <TokenSelectorSearch
            placeholder="Search Token"
            onChange={this.handleSearchInputChanged}
            maxLength={10}
            ref={input => input && input.focus()}
          />
          <div>
            <TokenSelectorAmount>
              <div>Amount to pay:</div>
              <div>
                <span>{formatMonetaryValue(amountToPay)}</span>
              </div>
            </TokenSelectorAmount>
            <Separator style={separatorStyle} />
          </div>
          {(balances.length === 0 && sortedBalancesBackup.length > 0) && (
            <TokenSelectorNoResults>
              <ThinkingIcon />
              <TokenSelectorValue>{searchValue}?</TokenSelectorValue>
              <TokenSelectorLabel>Looks like Kyber doesn't have this token. Try searching a different one.</TokenSelectorLabel>
            </TokenSelectorNoResults>
          )}
        </TokenSelectorSearchWrapper>
        {balances.map((value, index) => {
          const {
            balance,
            balanceInDai,
            enoughFunds,
            symbol,
          } = value;
          return (
            <Menu.Item
              key={symbol}
              onClick={() => this.handleItemClicked(symbol)}
              disabled={!enoughFunds}
              onMouseOver={!enoughFunds ? this.onHover.bind(this, symbol) : undefined}
              onMouseOut={!enoughFunds ? this.onMouseOut.bind(this, symbol) : undefined}
            >
              <TokenBalanceItem
                name={symbol}
                balance={formatMonetaryValue(balance, symbol, false)}
                balanceInDai={formatMonetaryValue(balanceInDai)}
                enoughFunds={enoughFunds}
                hovering={hoveringToken === symbol}
                tokenToConvertFrom={tokenToConvertFrom}
              />
              {(index !== totalTokens - 1) && <Separator style={separatorStyle} />}
            </Menu.Item>
          );
        })}
      </MenuWrapper>
    );
  }

  handleItemClicked = (selectedToken) => {
    this.setState({
      selectedToken,
      visible: false,
    });
    this.props.onChange(selectedToken);
  }

  render() {
    const {
      selectedToken,
      tokensEnum,
      totalTokens,
      sortedBalances,
      visible,
      searchValue,
    } = this.state;

    const {
      amountToPay,
      balances,
    } = this.props;

    const overlay = this.getMenu(sortedBalances, totalTokens, amountToPay, searchValue);

    return (
      <Dropdown
        overlay={overlay}
        placement="topRight"
        disabled={totalTokens === 0}
        visible={visible}
        onVisibleChange={visible => this.setState({ visible })}
      >
        <Button>
          {selectedToken} <Icon type="down" />
        </Button>
      </Dropdown>
    );
  }
}

export default TokenSelector;
