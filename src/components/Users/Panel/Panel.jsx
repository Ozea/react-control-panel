import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Panel.scss';

class Panel extends Component {
  state = {
    smallNavigationClass: 'small-navigation hidden'
  }

  toggleNavigation = () => {
    this.props.showTopNav();

    if (this.state.smallNavigationClass === 'small-navigation hidden') {
      this.setState({ smallNavigationClass: 'small-navigation show' });
    } else {
      this.setState({ smallNavigationClass: 'small-navigation hidden' });
    }
  }

  render() {
    return (
      <div className="panel-wrapper">
        <div className="top-panel">
          <div className="container left-menu">
            <div className="logo">LOGO</div>
            <div>Packages</div>
            <div>IP</div>
            <div>Graphs</div>
            <div>Statistics</div>
            <div>Log</div>
            <div>Updates</div>
            <div>Firewall</div>
            <div className="fm">File Manager</div>
            <div>Apps</div>
            <div>Server</div>
          </div>
          <div className="container profile-menu">
            <div className="bell">
              <FontAwesomeIcon icon="bell" />
            </div>
            <div>User</div>
            <div>Logout</div>
          </div>
        </div>

        <div className="top-panel small-device">
          <div className="container left-menu">
            <div className="logo">LOGO</div>
          </div>
          <div className="container hamburger" onClick={this.toggleNavigation}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
          <div className="container profile-menu">
            <div className="bell">
              <FontAwesomeIcon icon="bell" />
            </div>
            <div>User</div>
            <div>Logout</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Panel;