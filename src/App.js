import 'regenerator-runtime/runtime';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";

import SignIn from './components/SignIn';
import NavigationBar from './components/NavigationBar';
import NewBook from './components/NewBook';
import AllBooks from './components/AllBooks';
import BookItem from './components/BookItem';



const App = ({ contract, currentUser, nearConfig, wallet }) => {
  // const [messages, setMessages] = useState([]);

  // useEffect(() => {
  //   // TODO: don't just fetch once; subscribe!
  //   contract.getMessages().then(setMessages);
  // }, []);

  const signIn = () => {
    wallet.requestSignIn(
      nearConfig.contractName,
      'NEAR Book Review'
    );
  };

  const initialState = {
    loading: false
  };


  return (
    <main>
      {currentUser
        ? <NavigationBar
          contract={contract}
          currentUser={currentUser}
          nearConfig={nearConfig}
          wallet={wallet} />
        : <>
          <button onClick={signIn}>Log in</button>
          <SignIn />
        </>
      }
    </main >
  );
};

App.propTypes = {
  // contract: PropTypes.shape({
  //   addMessage: PropTypes.func.isRequired,
  //   getMessages: PropTypes.func.isRequired
  // }).isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired
  }),
  nearConfig: PropTypes.shape({
    contractName: PropTypes.string.isRequired
  }).isRequired,
  wallet: PropTypes.shape({
    requestSignIn: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired
  }).isRequired
};

export default App;
