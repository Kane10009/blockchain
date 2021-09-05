import React from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';

export default function SuggestedBooks({ onSubmit, currentUser }) {
    return (
        <p> SuggestedBooks </p>
    );
}

SuggestedBooks.propTypes = {
    // onSubmit: PropTypes.func.isRequired,
    currentUser: PropTypes.shape({
        accountId: PropTypes.string.isRequired,
        balance: PropTypes.string.isRequired
    })
};
