// import { addMessage, getMessages } from '../main';
// import { PostedMessage, messages } from '../model';

import { clean, getBooks, getExistedBooks, getSuggestedBooks } from '../main';
import { suggestBook, changeState, upvoteToBuy, downvoteToBuy } from '../main';
import { getReviews, addReview, editReview, deleteReview, upvoteReview, downvoteReview } from '../main';

import { books, reviews } from '../main';
import { BOOK_STATE_SUGGESTED, BOOK_STATE_EXISTED } from '../model';

import { VMContext, Context, u128, logging } from 'near-sdk-as';

const book1Name = "book 1";
const book1Intro = "intro for book 1";
const book1Author = "author book 1";

const book1Review1 = "book1: review 1";
const book1Review1Edited = "book1: review 1 edited";
const book2Review1 = "book1: review 2";

const book2Name = "book 2";
const book2Intro = "intro for book 2";
const book2Author = "author book 2";

describe('book test', () => {
  beforeEach(() => {
    clean();
  });

  it('suggestBook a book', () => {
    suggestBook(book1Name, book1Intro, book1Author);

    expect(books).toHaveLength(1, 'should only contain one book')
    expect(books.get(book1Name)).toBeTruthy(book1Name);
  });

  it('clean all book', () => {
    suggestBook(book1Name, book1Intro, book1Author);
    addReview(book1Name, book1Review1);
    clean();

    expect(books).toHaveLength(0, 'should have no book')
  });

  it('changeState book', () => {
    suggestBook(book1Name, book1Intro, book1Author);

    changeState(book1Name, BOOK_STATE_EXISTED);
    expect(getBooks()[0].state).toBe(BOOK_STATE_EXISTED, "state should be BOOK_STATE_EXISTED");

    changeState(book1Name, BOOK_STATE_SUGGESTED);
    expect(getBooks()[0].state).toBe(BOOK_STATE_SUGGESTED, "state should be BOOK_STATE_SUGGESTED");
  });

  it('upvote a book', () => {
    suggestBook(book1Name, book1Intro, book1Author);

    upvoteToBuy(book1Name);
    expect(getBooks()[0].upvoteToBuy.length).toBe(1, "book 1 should have 1 upvote");
  });

  it('downvote a book', () => {
    suggestBook(book1Name, book1Intro, book1Author);

    downvoteToBuy(book1Name);
    expect(getBooks()[0].downvoteToBuy.length).toBe(1, "book 1 should have 1 downvote");
  });

  it('add Review for a book', () => {
    suggestBook(book1Name, book1Intro, book1Author);
    addReview(book1Name, book1Review1);

    expect(getReviews(book1Name).length).toBe(1, "book 1 should have 1 review");
  });

  it('edit Review for a book', () => {
    suggestBook(book1Name, book1Intro, book1Author);
    addReview(book1Name, book1Review1);
    editReview(getReviews(book1Name).at(0).id, book1Review1Edited);

    expect(getReviews(book1Name).at(0).content).toBe(book1Review1Edited, "book 1 should have 1 review edited");
  });

  it('delete Review for a book', () => {
    suggestBook(book1Name, book1Intro, book1Author);
    addReview(book1Name, book1Review1);
    deleteReview(getReviews(book1Name).at(0).id);

    expect(reviews.length).toBe(0, "book 1 should have 0 review");
  });

  it('upvote Review of a book', () => {
    suggestBook(book1Name, book1Intro, book1Author);
    addReview(book1Name, book1Review1);
    const review = getReviews(book1Name).at(0);
    upvoteReview(review.id);

    const reviewUpdated = getReviews(book1Name).at(0);
    expect(reviewUpdated.upvoteReview.length).toBe(1, "review 1 should have 1 upvote");
  });

  it('downvote Review of a book', () => {
    suggestBook(book1Name, book1Intro, book1Author);
    addReview(book1Name, book1Review1);
    downvoteReview(getReviews(book1Name).at(0).id);

    expect(getReviews(book1Name).at(0).downvoteReview.length).toBe(1, "review 1 should have 1 downvote");
  });

});

// describe('attached deposit tests', () => {
//   beforeEach(() => {
//     VMContext.setAttached_deposit(u128.fromString('0'));
//     VMContext.setAccount_balance(u128.fromString('0'));
//   });

//   it('attaches a deposit to a contract call', () => {
//     log('Initial account balance: ' + Context.accountBalance.toString());

//     addMessage('hello world');
//     VMContext.setAttached_deposit(u128.from('20'));

//     log('Attached deposit: 10');
//     log('Account balance after deposit: ' + Context.accountBalance.toString());

//     expect(Context.accountBalance.toString()).toStrictEqual(
//       '10',
//       'balance should be 10'
//     );
//   });
// });
