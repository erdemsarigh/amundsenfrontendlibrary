import * as React from 'react';
import Avatar from 'react-avatar';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AppConfig from '../../../config/config';
import { GlobalState } from "../../ducks/rootReducer";
import { getLoggedInUser } from "../../ducks/user/reducer";
import { LoggedInUser, GetLoggedInUserRequest } from "../../ducks/user/types";

import './styles.scss';

// Props
interface StateFromProps {
  loggedInUser: LoggedInUser;
}

interface DispatchFromProps {
  getLoggedInUser: () => GetLoggedInUserRequest;
}

type NavBarProps = StateFromProps & DispatchFromProps;

// State
interface NavBarState {
  loggedInUser: LoggedInUser;
}

class NavBar extends React.Component<NavBarProps, NavBarState> {
  constructor(props) {
    super(props);

    this.state = {
      loggedInUser: this.props.loggedInUser,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { loggedInUser } = nextProps;
    return { loggedInUser };
  }

  componentDidMount() {
    this.props.getLoggedInUser();
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="nav-bar">
            <div className="nav-bar-left">
              {
                AppConfig.logoPath &&
                <img className="logo-icon" src={AppConfig.logoPath} />
              }
              <Link to={`/`}>
                AMUNDSEN
              </Link>
            </div>
            <div className="nav-bar-right">
              {
                AppConfig.navLinks.map((link, index) => {
                  if (link.use_router) {
                    return <NavLink key={index} to={link.href} target={link.target}>{link.label}</NavLink>
                  }
                  return <a key={index} href={link.href} target={link.target}>{link.label}</a>
                })
              }
              {
                this.state.loggedInUser &&
                <Link to={`/user/${this.state.loggedInUser.user_id}`}>
                  <Avatar name={this.state.loggedInUser.display_name} size={48} round={true} />
                </Link>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: GlobalState) => {
  return {
    loggedInUser: state.user.loggedInUser,
  }
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getLoggedInUser }, dispatch);
};

export default connect<StateFromProps, DispatchFromProps>(mapStateToProps, mapDispatchToProps)(NavBar);
