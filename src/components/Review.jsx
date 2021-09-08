import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';
import { useLocation, Link } from "react-router-dom";

export default function Review({ contract, currentUser, nearConfig, wallet, reviewItem }) {
    // const { state } = useLocation();
    const [reviewContent, setReviewContent] = useState([]);
    // const onSubmit = (e) => {
    //     e.preventDefault();

    //     const { fieldset, name, auth, intro } = e.target.elements;

    //     fieldset.disabled = true;
    //     console.log('name', name.value);
    //     console.log('author', auth.value);
    //     console.log('intro', intro.value);

    //     contract.suggestBook({ name: name.value, intro: intro.value, auth: auth.value }
    //     ).then(() => {
    //         name.value = '';
    //         intro.value = '';
    //         auth.value = '';
    //         fieldset.disabled = false;
    //         name.focus();
    //     });
    // };
    const handleChange = (e) => {
        setReviewContent(e.target.value );
    };

    const onAddReview = (e) => {
        e.preventDefault();
        console.log(reviewContent);

        contract.addReview({ name: book.name, content: reviewContent }
        ).then(() => {
            //   contract.getUpvote({ name: book.name }).then(number => {
            //     console.log('upvote = %d', number);
            //     setupvote(number);
            //   });

        });
    };

    return (
        <div>
            <div class="bookname">
                {reviewItem.name}
            </div>
            <div class="bookauthor">
                {reviewItem.author}
            </div>
            <div class="bookintro">
                {reviewItem.introduction}
            </div>
            <textarea name="newReview" cols="100" rows="5" onChange={handleChange}></textarea>
            <button onClick={onAddReview}>Add</button>
            <hr></hr>
        </div>


    );
}

Review.propTypes = {
    currentUser: PropTypes.shape({
        accountId: PropTypes.string.isRequired,
        balance: PropTypes.string.isRequired
    })
};