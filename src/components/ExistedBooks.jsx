import React from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';

export default function ExistedBooks({ onSubmit, currentUser }) {
  return (
    <p> ExistedBooks </p>
  );
}

ExistedBooks.propTypes = {
  // onSubmit: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired
  })
};
