import React from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';

export default function NewBook({ contract, currentUser, nearConfig, wallet }) {
    const onSubmit = (e) => {
        e.preventDefault();

        const { fieldset, name, auth, intro } = e.target.elements;

        fieldset.disabled = true;
        console.log('name', name.value);
        console.log('author', auth.value);
        console.log('intro', intro.value);

        contract.suggestBook({ name: name.value, intro: intro.value, auth: auth.value }
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
                    <input
                        type="textarea"
                        autoComplete="off"
                        autoFocus
                        id="intro"
                        required
                    />
                </p>

                <button type="submit" >
                    Submit
                </button>
            </fieldset>
        </form>
    );
}

NewBook.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    currentUser: PropTypes.shape({
        accountId: PropTypes.string.isRequired,
        balance: PropTypes.string.isRequired
    })
};