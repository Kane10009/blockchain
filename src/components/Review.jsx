import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';
import { useLocation, Link } from "react-router-dom";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";

const BOATLOAD_OF_GAS = Big(10).times(10 ** 13).toFixed();
const ZERO_DONATION = Big(0).times(10 ** 24).toFixed();

export default function Review({ contract, currentUser, nearConfig, wallet, reviewItem, setReviews, setReviewContent, setIsEditingReview, setCurentReview }) {
    const [upvoteNo, setUpvoteNo] = useState(0);
    const [upvoted, setUpvoted] = useState(false);
    const [donate, setdonate] = useState(0.1);

    useEffect(() => {
        setUpvoteNo(reviewItem.upvotes.length);
        for (var i = 0; i < reviewItem.upvotes.length; i++) {
            if (currentUser.accountId == reviewItem.upvotes[i]) {
                setUpvoted(true);
            }
        }
    }, []);

    const onUpvote = (e) => {
        e.preventDefault();
        console.log("[FRONT-END] ReviewItem onUpvote clicked  ");

        contract.upvoteReview({ id: reviewItem.id }
        ).then((rev) => {
            if (rev) {
                setUpvoteNo(rev.upvotes.length);
                var flag = false;
                for (var i = 0; i < rev.upvotes.length; i++) {
                    if (currentUser.accountId == rev.upvotes[i]) {
                        flag = true;
                    }
                }
                setUpvoted(flag);

            } else {
                console.log("[FRONT-END] ReviewItem onUpvote: reviewItem null");
            }

        });
    };

    const onDonateChanged = (e) => {
        setdonate(e.target.value);
    }


    const onDonateClicked = (e) => {
        console.log("[FRONT-END] donate amount : ", donate);
        contract.donate({ id: reviewItem.id, amount: Big(donate).times(10 ** 24).toFixed() },
            BOATLOAD_OF_GAS,
            ZERO_DONATION);
    }

    const onDeleteClicked = (e) => {
        console.log("[FRONT-END] delete review id: ", reviewItem.id);

        contract.deleteReview({ id: reviewItem.id },
            BOATLOAD_OF_GAS,
            ZERO_DONATION).then((reviews) => {
                if (reviews) {
                    setReviews(reviews);
                }
            });
    }

    const onEditClicked = (e) => {
        console.log("[FRONT-END] edit review id: ", reviewItem.id);
        console.log("[FRONT-END] edit review content: ", reviewItem.content);

        setReviewContent(reviewItem.content);
        setCurentReview(reviewItem);
        setIsEditingReview(true);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 10, backgroundColor: 'white', borderRadius: 5, boxShadow: `1px 3px 1px #9E9E9E`, padding: 10 }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <div style={{ color: 'gray'}}>{reviewItem.reviewer}</div>
                <div className="dropdown">
                    <span style={{ color: 'black'}}>...</span>
                    <div className="dropdown-content">
                        <button onClick={onEditClicked}>Edit</button>
                        <button onClick={onDeleteClicked}>Delete</button>
                    </div>
                </div>
            </div>

            <div style={{ minHeight: 100, fontSize: 14, paddingLeft:12, paddingTop:6,color: 'black'  }}>
                {reviewItem.content}
            </div>
            <div style={{ position: 'relative', bottom: 0, left: 0, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <div onClick={onUpvote}>
                    {<AiOutlineLike color={upvoted ? 'blue' : 'black'} ></AiOutlineLike>}
                    <label style={{ fontSize: 16, color: 'black' }} >{upvoteNo}</label>
                </div>

                <div>
                    <button className="btn2" onClick={onDonateClicked}>Donate</button>
                    {/* <input type="text" id="noNear" ></input> */}
                    <input id="noNear"
                        autoComplete="off"
                        defaultValue={'0.1'}
                        id="donation"
                        max={Big(currentUser.balance).div(10 ** 24)}
                        min="0"
                        step="0.1"
                        onChange={onDonateChanged}
                        type="number"
                    />
                    <span title="NEAR Tokens" style={{ fontSize: 26, color: 'black' }} >Ⓝ</span>
                </div>
            </div>

        </div>


    );
}

Review.propTypes = {
    currentUser: PropTypes.shape({
        accountId: PropTypes.string.isRequired,
        balance: PropTypes.string.isRequired
    })
};