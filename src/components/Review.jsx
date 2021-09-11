import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';
import { useLocation, Link } from "react-router-dom";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
export default function Review({ contract, currentUser, nearConfig, wallet, reviewItem }) {
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
        console.log("ReviewItem onUpvote clicked  ");

        contract.upvoteReview({ id: reviewItem.id }
        ).then((rev) => {
            console.log("'''''''''''''''''rev'''''''''''''''''");
            console.log(rev);
            if (rev) {
                setUpvoteNo(rev.upvotes.length);
                var flag = false;
                for (var i = 0; i < rev.upvotes.length; i++) {
                    if (currentUser.accountId == rev.upvotes[i]) {
                        flag = true;
                    }
                }
                console.log(flag);
                setUpvoted(flag);

            } else {
                console.log("ReviewItem onUpvote: reviewItem null");
            }

        });
    };

    const BOATLOAD_OF_GAS = Big(3).times(10 ** 13).toFixed();
    const onDonateChanged = (e) => {
        setdonate(e.target.value);
    }


    const onDonateClicked = (e) => {
        console.log("Donate:== ".concat(donate));
        contract.donate({ id: reviewItem.id, amount: Big(donate).times(10 ** 24).toFixed() },
        BOATLOAD_OF_GAS,
        Big(donate).times(10 ** 24).toFixed())
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 10, backgroundColor: 'white', borderRadius: 5, boxShadow: `1px 3px 1px #9E9E9E`, padding: 10 }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <div>{reviewItem.reviewer}</div>
                <div>
                    dropbox
                </div>
            </div>

            <div style={{ minHeight: 100 }}>
                {reviewItem.content}
            </div>
            <div style={{ position: 'relative', bottom: 0, left: 0, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <div onClick={onUpvote}>
                    {<AiOutlineLike color={upvoted ? 'blue' : 'black'} ></AiOutlineLike>}
                    <label style={{ fontSize: 16, color: 'black' }} >{upvoteNo}</label>
                </div>

                <div>
                    <button class="btn2" onClick={onDonateClicked}>Donate</button>
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