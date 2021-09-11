import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';
import BookItem from './BookItem';
import Reviews from './Review'
export default function AllBooks({ contract, currentUser, nearConfig, wallet }) {
    const [books, setBooks] = useState([]);
    const [curentBook, setCurentBook] = useState(null)
    const [reviews, setReviews] = useState([])
    const [reviewContent, setReviewContent] = useState([]);

    useEffect(() => {
        setReviews([]);
        console.log('curentBook change', curentBook)
        curentBook
            && curentBook.name
            && contract.getReviews({ name: curentBook.name }).then(b => {
                setReviews(b);
            });

    }, [curentBook])

    useEffect(() => {
        contract.getBooks().then(b => {
            setBooks(b);
            setCurentBook(b[0]);

            if(curentBook){
                updateReviews(curentBook.name);
            }
        });
    }, [])

    const updateReviews = (name) => {
        contract.getReviews({ name: name }).then(reviews => {
            setReviews(reviews);
        });
    };

    const onTextChanged = (e) => {
        setReviewContent(e.target.value);
    }

    const onAddReview = (e) => {
        e.preventDefault();
        console.log(reviewContent);
        console.log(curentBook.name);

        contract.addReview({ name: curentBook.name, content: reviewContent }
        ).then(() => {
            updateReviews(curentBook.name);
            newReview.value = "";
        });
    };

    function renderBookList() {
        return (
            <div style={{ width: '30%', height: 'auto', marginTop:0}}>
                {books && books[0] && books.map((book, i) =>
                    <p key={book.name} style={{marginTop:0}}>
                        <BookItem book={book} contract={contract} setCurentBook={setCurentBook} currentUser={currentUser} />
                    </p>
                )}
            </div>
        )

    }

    function renderReviews() {
        return (
            <div style={{ width: '70%', height: 400, marginLeft: 20 }}>
                <textarea name="newReview" onChange={onTextChanged} style={{ width: '100%', height: 100 , borderRadius: 5, boxShadow: `1px 3px 1px #9E9E9E`, padding: 10 }}></textarea>

                <button onClick={onAddReview}>Add Review</button>
                <hr />
                <div style={{ width: '100%', height: 400, marginLeft: 0 }}>
                    {reviews.map((e, i) => {
                        return (
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
            </div >
        )
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
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