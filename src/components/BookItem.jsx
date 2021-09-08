import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

export default function BookItem({ book, contract }) {
  const [upvote, setupvote] = useState([]);
  useEffect(() => {
    setupvote(book.upvotes.length);
  }, []);

  const onUpvote = (e) => {
    e.preventDefault();

    contract.upvote({ name: book.name }
    ).then(() => {
      contract.getUpvote({ name: book.name }).then(number => {
        console.log('upvote = %d', number);
        setupvote(number);
      });

    });
  };

  const onDetail = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <div>
        {/* <img style="width:170px;height:170px;margin-right:15px;" src='../res/pic_trulli.jpg' alt="pic_trulli" /> */}
        <div>
          <div class="bookname">
            {book.name}
          </div>
          <div class="bookauthor">
            {book.author}
          </div>
          <div class="bookintro">
            {book.introduction}
          </div>
          <button onClick={onUpvote}>Upvote({upvote})</button>
          <Link
            to={{
              pathname: `/detail/${book.name}`,
              state: { frombookitem: book }
            }}
          >
            <button>Review</button>
          </Link>;
        </div>
        <div>
          <hr />
        </div>
      </div>
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
