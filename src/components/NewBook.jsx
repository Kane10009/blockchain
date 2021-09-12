import React from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';

const BOATLOAD_OF_GAS = Big(10).times(10 ** 13).toFixed();
const ZERO_DONATION  = Big(0).times(10 ** 24).toFixed();

export default function NewBook({ contract, currentUser, nearConfig, wallet }) {
    const onSubmit = (e) => {
        e.preventDefault();

        const { fieldset, name, auth, intro } = e.target.elements;

        fieldset.disabled = true;
        console.log('[FRONT-END] Add new book: name', name.value,", author: ", auth.value,", intro: ", intro.value);

        contract.suggestBook({ name: name.value, intro: intro.value, auth: auth.value }, BOATLOAD_OF_GAS, ZERO_DONATION
        ).then(() => {
            name.value = '';
            intro.value = '';
            auth.value = '';
            fieldset.disabled = false;
            name.focus();
        });
    };

    return (
        <form onSubmit={onSubmit}>
            <fieldset id="fieldset">

                <p className="highlight">
                    <label htmlFor="name">Name:</label>
                    <input
                        autoComplete="off"
                        autoFocus
                        id="name"
                        required
                    />
                </p>
                <p className="highlight">
                    <label htmlFor="auth">Author:</label>
                    <input
                        autoComplete="off"
                        autoFocus
                        id="auth"
                        required
                    />
                </p>
                <p className="highlight">
                    <label htmlFor="intro">Intro:</label>

                    <textarea id="intro" name="newReview" style={{ width: '100%',  height: 200 , borderColor:'transparent', borderRadius: 0, padding: 10 , backgroundColor: 'transparent'}}></textarea>
                    {/* <textarea
                        type="textarea"
                        autoComplete="off"
                        autoFocus
                        id="intro"
                        required
                    /> */}
                </p>

                <button type="submit" >
                    Add
                </button>
            </fieldset>
        </form>
    );
}

NewBook.propTypes = {
    // onSubmit: PropTypes.func.isRequired,
    currentUser: PropTypes.shape({
        accountId: PropTypes.string.isRequired,
        balance: PropTypes.string.isRequired
    })
};