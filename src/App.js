import 'regenerator-runtime/runtime';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

import SignIn from './components/SignIn';
import NavigationBar from './components/NavigationBar';
import NewBook from './components/NewBook';
import AllBooks from './components/AllBooks';
import ExistedBooks from './components/ExistedBooks';
import SuggestedBooks from './components/SuggestedBooks';
import BookItem from './components/BookItem';


const SUGGESTED_DONATION = '0';
const BOATLOAD_OF_GAS = Big(3).times(10 ** 13).toFixed();

const App = ({ contract, currentUser, nearConfig, wallet }) => {
  // const [messages, setMessages] = useState([]);

  // useEffect(() => {
  //   // TODO: don't just fetch once; subscribe!
  //   contract.getMessages().then(setMessages);
  // }, []);

  const signIn = () => {
    wallet.requestSignIn(
      nearConfig.contractName,
      'NEAR Book Store'
    );
  };

  const signOut = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  return (
    <main>
      <header>
        <div>
          <h1 >NEAR Book Store</h1>
          <button margin='100'>Log out</button>
        </div>
        {currentUser
          ? <></>
          : <button onClick={signIn}>Log in</button>
        }
      </header>
      {currentUser
        ? <NavigationBar
          contract={contract}
          currentUser={currentUser}
          nearConfig={nearConfig}
          wallet={wallet} />
        : <SignIn />
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
