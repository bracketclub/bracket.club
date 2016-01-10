'use strict';

const React = require('react');
const {PropTypes} = React;
const {Link} = require('react-router');

module.exports = React.createClass({
  propTypes: {
    year: PropTypes.string.isRequired
  },

  render() {
    return (
      <div>
        <h2>User not found</h2>
        <p>
          The user doesn't have any brackets.
          Check out the <Link to='/results'>results page</Link> for a full list of users.
        </p>
      </div>
    );
  }
});
