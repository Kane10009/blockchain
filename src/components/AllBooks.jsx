import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';
import BookItem from './BookItem';
import Reviews from './Review'
export default function AllBooks({ contract, currentUser, nearConfig, wallet }) {
    const [books, setBooks] = useState([]);
    const [curentBook, setCurentBook] = useState(null)
    const [reviews, setReviews] = useState([])
    useEffect(() => {
        console.log('curentBook change', curentBook)
        contract.getReviews(curentBook && curentBook.name).then(b => {
            setReviews(b);
        });
    }, [curentBook])

    useEffect(() => {
        contract.getBooks().then(b => {
            setBooks(b);
        });
    }, [])


    function renderBookList(){
        return (
            <div style={{width: '30%'}}>
                {books && books[0] && books.map((book, i) =>
                    <p key={book.name}>
                        <BookItem book={book} contract={contract} setCurentBook={setCurentBook} />
                    </p>
                )}
            </div>
        )
        
    }
    function renderReviews(){
        return(
            <div style={{width: '70%'}}>
                {reviews.map((e, i) => {
                    return(
                        <Reviews
                            contract={contract}
                            currentUser={currentUser}
                            nearConfig={nearConfig}
                            wallet={wallet}
                            reviewItem={e}
                            key={i}
                        ></Reviews>
                    )
                })}
                
            </div>
        )
    }
    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            {renderBookList()}
            {renderReviews()}
        </div>
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