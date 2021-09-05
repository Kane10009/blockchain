import React from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';

export default function BookItem({ onSubmit, currentUser }) {
  return (
    <p> BookItem </p>
  );
}

BookItem.propTypes = {
  // onSubmit: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired
  })
};
