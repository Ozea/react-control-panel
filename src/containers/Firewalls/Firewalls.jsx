import React, { Component } from 'react';
import DropdownFilter from '../../components/MainNav/Toolbar/DropdownFilter/DropdownFilter';
import SearchInput from '../../components/MainNav/Toolbar/SearchInput/SearchInput';
import LeftButton from '../../components/MainNav/Toolbar/LeftButton/LeftButton';
import Checkbox from '../../components/MainNav/Toolbar/Checkbox/Checkbox';
import Select from '../../components/MainNav/Toolbar/Select/Select';
import Toolbar from '../../components/MainNav/Toolbar/Toolbar';
import Firewall from '../../components/Firewall/Firewall';
import Spinner from '../../components/Spinner/Spinner';
import { firewalls } from '../../mocks/firewalls';
import './Firewalls.scss';

class Firewalls extends Component {
  state = {
    firewalls: [],
    loading: false,
    toggleAll: false,
    sorting: "ACTION",
    order: "descending",
    total: 0
  }

  componentDidMount() {
    this.setState({
      loading: true,
      firewalls
    }, () => this.setState({ loading: false }));
  }

  totalAmount = () => {
    const { firewalls } = this.state;
    let result = [];
    
    for (let i in firewalls) {
      result.push(firewalls[i]);
    }

    if ( result.length < 2 ) {
      return <div className="total">{result.length} rule</div>;
    } else {
      return <div className="total">{result.length} rules</div>;
    }
  }

  changeSorting = (sorting, order) => {
    this.setState({ 
      sorting,
      order
     });
  }

  toggleAll = () => {
    this.setState({ toggleAll: !this.state.toggleAll });
  }

  firewalls = () => {
    const { firewalls, toggleAll } = this.state;
    const result = [];

    for (let i in firewalls) {
      result.push(firewalls[i]);
    }

    return result.map((item, index) => {
      return <Firewall data={item} toggled={toggleAll} key={index} />;
    });
  }

  render() {
    return (
      <div className="firewalls">
        <Toolbar mobile={false} >
          <LeftButton name="Add Rule" showLeftMenu={true} />
          <div className="r-menu">
            <div className="input-group input-group-sm">
              <button className="btn btn-secondary extra" type="submit">LIST FAIL2BAN</button>
              <Checkbox toggleAll={this.toggleAll} />
              <Select list='firewallList' />
              <DropdownFilter changeSorting={this.changeSorting} sorting={this.state.sorting} order={this.state.order} list="firewallList" />
              <SearchInput />
            </div>
          </div>
        </Toolbar>
        {this.state.loading ? <Spinner /> : this.firewalls()}
        {this.totalAmount()}
      </div>
    );
  }
}

export default Firewalls;
