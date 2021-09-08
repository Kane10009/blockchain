import React from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

import AllBooks from './AllBooks';
import NewBook from './NewBook';
import Review from './Review';

export default function NavigationBar({ contract, currentUser, nearConfig, wallet }) {
    return (
        <>
            <Router>
                <div>
                    <Link to="/blockchain">
                        Home
                    </Link>

                    <Link to="/blockchain/add">
                        Add Books
                    </Link>

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