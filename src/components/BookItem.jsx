import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';
import { BrowserRouter as Router, Route, Switch, Link, withRouter } from "react-router-dom";
// import { bookimg } from '../assets/img/book.jpeg';
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import NewBook from './NewBook';

const BOATLOAD_OF_GAS = Big(10).times(10 ** 13).toFixed();
const ZERO_DONATION = Big(0).times(10 ** 24).toFixed();

export default function BookItem({ book, contract, setCurentBook, currentUser, setBooks }) {
  const [upvote, setupvote] = useState([]);
  const [active, setActive] = useState(false)

  useEffect(() => {
    setupvote(book.upvotes.length);
    for (var i = 0; i < book.upvotes.length; i++) {
      if (currentUser.accountId == book.upvotes[i]) {
        setActive(true);
      }
    }
  }, []);

  const onUpvote = (e) => {
    e.preventDefault();
    console.log("[FRONT-END] onUpvote: ", book.name);

    contract.upvote({ name: book.name }
    ).then((book) => {
      if (book) {
        setupvote(book.upvotes.length);
        var flag = false;
        for (var i = 0; i < book.upvotes.length; i++) {
          if (currentUser.accountId == book.upvotes[i]) {
            flag = true;
          }
        }
        setActive(flag);

      } else {
        console.log("[FRONT-END] onUpvote: book null");
      }

    });
  };

  const onDeleteClicked = (e) => {
    console.log("[FRONT-END] delete book name: ", book.name);

    contract.deletedBook({ name: book.name },
      BOATLOAD_OF_GAS,
      ZERO_DONATION).then((books) => {
        setCurentBook(null);
        setBooks(books);
      });
  }

  const onEditClicked = (e) => {
    // console.log("[FRONT-END] edit review id: ", reviewItem.id);
    // console.log("[FRONT-END] edit review content: ", reviewItem.content);

    // setReviewContent(reviewItem.content);
    // setCurentReview(reviewItem);
    // setIsEditingReview(true);
    return NewBook;
  }

  const onDetail = (e) => {
    e.preventDefault();
    setCurentBook({ ...book });

  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#e3a754', borderRadius: 5, boxShadow: `1px 3px 1px #9E9E9E`, padding: 10 }}>
{/* 
      <div style={{ width: '20%' }}>
        <img src={`${process.env.PUBLIC_URL}/assets/img/book.jpeg`} style={{ width: '100%', height: '60px', borderRadius: 10, boxShadow: `1px 3px 1px #9E9E9E` }}></img>
      </div> */}
      <div style={{ width: '90%' }}>
        <div onClick={onDetail} style={{ width: '100%', height: 'auto', marginLeft: 0 }}>
          <div className="bookname">
            {book.name}
          </div>
          <div className="bookauthor">
          </div>
          <div className="bookintro">
            {book.introduction}
          </div>

          {/* <button onClick={onUpvote}>Upvote({upvote})</button> */}
        </div>

        <div style={{ marginTop: 10, marginLeft: 10 }} onClick={onUpvote}>
          {<AiOutlineLike color={active ? 'blue' : 'black'} ></AiOutlineLike>}
          <label style={{ fontSize: 16, color: 'black' }} >{upvote}</label>
        </div>
      </div>

      <div style={{ width: '5%' }}>
        <div className="dropdown2">
          <span style={{ color: 'black'}}>...</span>
          <div className="dropdown-content2">
            <button onClick={onDeleteClicked}>Delete</button>
          </div>
        </div>
      </div>
      {/* <img style="width:170px;height:170px;margin-right:15px;" src='../res/pic_trulli.jpg' alt="pic_trulli" /> */}
    </div>

  );
}

BookItem.propTypes = {
  // onSubmit: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired
  })
};
