import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';

export default function AllBooks({ contract, currentUser, nearConfig, wallet }) {
    const [books, setBooks] = useState([]);

    contract.getBooks().then(b => {
        setBooks(b);
    });
    return (
        <>
            {books.map((book, i) =>
                <p key={book.name}>
                    <strong>{book.name}</strong><br />
                    <strong>{book.auth}</strong><br />
                    <strong>{book.intro}</strong><br />
                </p>
            )}
        </>
    );
}

AllBooks.propTypes = {
    // onSubmit: PropTypes.func.isRequired,
    currentUser: PropTypes.shape({
        accountId: PropTypes.string.isRequired,
        balance: PropTypes.string.isRequired
    }),
    contract: PropTypes.shape({
        getBooks: PropTypes.func.isRequired
    }).isRequired,
    books: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            introduction: PropTypes.string.isRequired,
            author: PropTypes.string.isRequired,
            owner: PropTypes.string.isRequired,
            state: PropTypes.number.isRequired,
            upvoteToBuy: PropTypes.arrayOf(PropTypes.string).isRequired,
            downvoteToBuy: PropTypes.arrayOf(PropTypes.string).isRequired,
        })
    ).isRequired

};