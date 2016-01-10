'use strict';

const React = require('react');
const {Link} = require('react-router');

const extend = require('lodash/object/extend');
const partial = require('lodash/function/partial');

const Navbar = require('react-bootstrap/lib/Navbar');
const Nav = require('react-bootstrap/lib/Nav');
const MenuItem = require('react-bootstrap/lib/MenuItem');
const NavItem = require('react-bootstrap/lib/NavItem');
const DropdownButton = require('react-bootstrap/lib/DropdownButton');

const LinkContainer = require('react-router-bootstrap/lib/LinkContainer');

const meActions = require('../../actions/meActions');

// This is a bit of a pain, but there exist links in the app to change the
// current page to a different year. We need to know how to convert any pathname
// to a different year. This needs to be kept consistent with the ./routes.jsx file.
// TODO: find a way to automatically determine from routes
const years = require('../../global').years.slice(0).reverse();
// const yearRoutes = ['user', 'results', 'resultsCurrent', 'userCurrent'];
const defaultTo = 'landing';
const yearParamNames = {landing: 'path'};

const Header = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },

  getYearPathname() {
    // const route = this.context.router.getCurrentRoutes()[1];
    const params = this.context.router.getCurrentParams();
    const query = this.context.router.getCurrentQuery();

    // const sendTo = yearRoutes.indexOf(route.name) > -1 ? route.name.replace('Current', '') : defaultTo;
    const sendTo = defaultTo;
    const yearParamName = yearParamNames[sendTo] || 'year';

    const addYear = (obj, year) => {
      const toAdd = {[yearParamName]: year};
      return extend({}, obj, toAdd);
    };

    return {
      to: sendTo,
      query, // TODO: maybe need to only send certain query params to landing page
      params: partial(addYear, sendTo === defaultTo ? {} : params)
    };
  },

  propTypes: {
    me: React.PropTypes.object,
    year: React.PropTypes.string.isRequired
  },

  handleLogin(e) {
    e.preventDefault();
    meActions.auth();
  },

  handleLogout(e) {
    e.preventDefault();
    meActions.logout();
  },

  render() {
    const {me, year} = this.props;
    // const {to, params, query} = this.getYearPathname();
    // {/*params={params(dropdownYear)} query={query}*/}

    return (
      <header>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to='/'>TweetYourBracket</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Nav className='year-nav'>
            <DropdownButton title={year}>
              {years.map((dropdownYear) =>
                <LinkContainer key={dropdownYear} to={`${year}`}>
                  <MenuItem>{dropdownYear}</MenuItem>
                </LinkContainer>
              )}
            </DropdownButton>
          </Nav>
          <Navbar.Collapse>
            <Nav pullRight>
              <LinkContainer to='subscribe'><NavItem>Subscribe</NavItem></LinkContainer>
              <LinkContainer to='results'><NavItem>Results</NavItem></LinkContainer>
              {me.id
                ? <DropdownButton key={0} title={me.username}>
                  <LinkContainer to='userCurrent' params={{id: me.id}}><MenuItem>Bracket</MenuItem></LinkContainer>
                  <MenuItem divider />
                  <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
                </DropdownButton>
                : <MenuItem key={1} onClick={this.handleLogin}>Login</MenuItem>
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </header>
    );
  }
});

module.exports = Header;
