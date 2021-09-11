import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import bookimg from '../assets/img/book.jpeg'
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";


export default function BookItem({ book, contract, setCurentBook, currentUser }) {
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
    console.log("onUpvote: book.name ");

    contract.upvote({ name: book.name }
    ).then((book) => {
      console.log("'''''''''''''''''book'''''''''''''''''");
      console.log(book);
      if(book){
        setupvote(book.upvotes.length);
        var flag = false;
        for (var i = 0; i < book.upvotes.length; i++) {
          if (currentUser.accountId == book.upvotes[i]) {
            flag = true;
          }
        }
        setActive(flag);

      }else{
        console.log("onUpvote: book null");
      }
      
    });
  };

  const onDetail = (e) => {
    e.preventDefault();
    setCurentBook({ ...book })
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#e3a754', borderRadius: 5, boxShadow: `1px 3px 1px #9E9E9E`, padding: 10 }}>
      <div style={{ width: '25%' }}>
        <img src={bookimg} style={{ width: '100%', height: '100%', borderRadius: 10, boxShadow: `1px 3px 1px #9E9E9E` }}></img>
      </div>
      <div style={{ width: '75%' }}>
        <button onClick={onDetail} style={{ width: '100%', height: 'auto', marginLeft: 0 }}>
          <div class="bookname">
            {book.name}
          </div>
          <div class="bookauthor">
            {book.author}
          </div>
          <div class="bookintro">
            {book.introduction}
          </div>

          {/* <button onClick={onUpvote}>Upvote({upvote})</button> */}
        </button>

        <div style={{ marginTop: 10, marginLeft: 10 }} onClick={onUpvote}>
          {<AiOutlineLike color={active ? 'blue' : 'black'} ></AiOutlineLike>}
          <label style={{ fontSize: 16, color: 'black' }} >{upvote}</label>
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
