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
    console.log(currentUser)
    return (
        <>
            <Router>
                <div>
                    <div class="top">
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
                                ? <label class="top-right">{currentUser.accountId}</label>
                                : <></>
                            }
                                <Link onClick={signOut}>Log out</Link>
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
    onSubmit: PropTypes.func.isRequired,
    currentUser: PropTypes.shape({
        accountId: PropTypes.string.isRequired,
        balance: PropTypes.string.isRequired
    })
};