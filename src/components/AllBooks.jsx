import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';
import BookItem from './BookItem';

export default function AllBooks({ contract, currentUser, nearConfig, wallet }) {
    const [books, setBooks] = useState([]);

    contract.getBooks().then(b => {
        setBooks(b);
    });
    return (
        <>
            {books.map((book, i) =>
                <p key={book.name}>
                    <BookItem book={book} contract={contract}/>
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