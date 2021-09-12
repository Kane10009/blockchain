import React from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

import AllBooks from './AllBooks';
import NewBook from './NewBook';
import Review from './Review';

export default function NavigationBar({ contract, currentUser, nearConfig, wallet }) {
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
    console.log("[FRONT-END] currentUser: ",currentUser.accountId);
    return (
        <>
            <Router>
                <div>
                    <div className="top">
                        <div >
                            <Link to="/blockchain">
                                Home
                            </Link>

                            <Link to="/blockchain/add">
                                Add Books
                            </Link>
                        </div>
                        <div ></div>

                        <div >
                            <div>
                            {currentUser
                                ? <label style={{ color:'#FFFA' }}>{currentUser.accountId}</label>
                                : <></>
                            }
                                <button id='btlogout' onClick={signOut}>Log out</button>
                            </div>
                            {currentUser
                                ? <></>
                                : <button onClick={signIn}>Log in</button>
                            }
                        </div>
                    </div >
                    {/* --------------------------------------------------------------- */}
                    <hr />
                    {/* --------------------------------------------------------------- */}
                    <Switch>
                        <Route path="/blockchain/add">
                            <NewBook contract={contract}
                                currentUser={currentUser}
                                nearConfig={nearConfig}
                                wallet={wallet} />
                        </Route>
                        <Route path="/blockchain">
                            <AllBooks contract={contract}
                                currentUser={currentUser}
                                nearConfig={nearConfig}
                                wallet={wallet} />
                        </Route>
                        <Route exact
                            path="/detail/:name">
                            <Review contract={contract}
                                currentUser={currentUser}
                                nearConfig={nearConfig}
                                wallet={wallet} />
                        </Route>
                    </Switch>
                </div>
            </Router>
        </>
    );
}

NavigationBar.propTypes = {
    currentUser: PropTypes.shape({
        accountId: PropTypes.string.isRequired,
        balance: PropTypes.string.isRequired
    })
};