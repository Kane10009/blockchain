import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';
import BookItem from './BookItem';
import Reviews from './Review';

const BOATLOAD_OF_GAS = Big(10).times(10 ** 13).toFixed();
const ZERO_DONATION = Big(0).times(10 ** 24).toFixed();

export default function AllBooks({ contract, currentUser, nearConfig, wallet }) {
    const [books, setBooks] = useState([]);
    const [curentBook, setCurentBook] = useState(null)
    const [curentReview, setCurentReview] = useState(null)
    const [reviews, setReviews] = useState([])
    const [reviewContent, setReviewContent] = useState([]);
    const [isEditingReview, setIsEditingReview] = useState(false);

    useEffect(() => {
        console.log('[FRONT-END] get allbook: ');
        contract.getBooks().then(b => {
            setBooks(b);
            setCurentBook(b[0]);
            // console.log('[FRONT-END] curentBook is: ', curentBook.name)
            if (curentBook) {
                updateReviews(curentBook.name);
            }
        });
    }, [])

    useEffect(() => {
        setReviews([]);
        if (curentBook && curentBook.name) {
            console.log('[FRONT-END] get reviews of book: ', curentBook.name);
            contract.getReviews({ name: curentBook.name }).then(b => {
                setReviews(b);
            });
        }
    }, [curentBook])

    useEffect(() => {
        setCurentBook(books[0]);
        // console.log('[FRONT-END] curentBook is: ', curentBook.name)
        if (curentBook) {
            updateReviews(curentBook.name);
        }
    }, [books])


    useEffect(() => {
        newReview.value = reviewContent;
    }, [isEditingReview])

    const updateReviews = (name) => {
        console.log('[FRONT-END] get reviews of book: ', name);
        contract.getReviews({ name: name }).then(reviews => {
            setReviews(reviews);
        });
    };

    const onTextChanged = (e) => {
        setReviewContent(e.target.value);
    }

    const onAddReview = (e) => {
        e.preventDefault();
        console.log('[FRONT-END] ADD new review: ', reviewContent);

        if(reviewContent.length > 0){
            contract.addReview({ name: curentBook.name, content: reviewContent },
                BOATLOAD_OF_GAS,
                ZERO_DONATION
            ).then((reviews) => {
                setReviews(reviews);
                newReview.value = "";
                setReviewContent("");
            });
        }else{
            console.log('[FRONT-END] reviewContent is empty, please enter content ');
        }
    };
    const onClean = (e) => {
        e.preventDefault();
        console.log('[FRONT-END] clean: ', reviewContent);

        contract.clean({},
            BOATLOAD_OF_GAS,
            ZERO_DONATION
        );
    };

    const onUpdateReview = (e) => {
        e.preventDefault();

        console.log('[FRONT-END] EDIT review id ', curentReview.id, ", reviewContent: ", reviewContent);
        contract.editReview({ id: curentReview.id, content: reviewContent },
            BOATLOAD_OF_GAS,
            ZERO_DONATION
        ).then((reviews) => {
            setReviews(reviews);

            setReviewContent("");
            setIsEditingReview(false);
        });
    };

    const onCancelReview = (e) => {
        e.preventDefault();
        console.log('[FRONT-END] CANCEL edit review id ', curentReview.id);

        setReviewContent("");
        setIsEditingReview(false);
    };

    function renderBookList() {
        return (
            <div style={{ width: '30%', height: 'auto', marginTop: 0 }}>
                {books && books[0] && books.map((book, i) =>
                    <div key={book.name} style={{ marginTop: 10 }}>
                        <BookItem book={book}
                            contract={contract}
                            setCurentBook={setCurentBook}
                            currentUser={currentUser}
                            setBooks={setBooks} />
                    </div>
                )}
            </div>
        )

    }

    function renderReviews() {
        return (
            <div style={{ width: '70%', height: 400, marginLeft: 20 }}>
                <textarea id="newReview" onChange={onTextChanged} style={{ width: '100%', height: 100, borderRadius: 5, boxShadow: `1px 3px 1px #9E9E9E`, padding: 10 }}></textarea>

                <button onClick={onAddReview} style={isEditingReview ? { display: 'none' } : { display: 'inline' }}>Add_Review</button>
                {/* <button onClick={onClean} >Clean</button> */}
                <button onClick={onUpdateReview} style={isEditingReview ? { display: 'inline' } : { display: 'none' }}>Update</button>
                <button onClick={onCancelReview} style={isEditingReview ? { display: 'inline' } : { display: 'none' }}>Cancel</button>
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
                                setReviews={setReviews}
                                setReviewContent={setReviewContent}
                                setIsEditingReview={setIsEditingReview}
                                setCurentReview={setCurentReview}
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
};