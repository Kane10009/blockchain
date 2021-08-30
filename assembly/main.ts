import { PostedMessage, messages, Book, BOOK_STATE_EXISTED, BOOK_STATE_SUGGESTED, Review } from './model';
import { context, ContractPromiseBatch, u128 } from "near-sdk-as";
import { books } from './model';

let reviewId = 0;

export function getBooks(): Book[] {
  return books.values();
}

export function getExistedBooks(): Book[] {
  const all = getBooks();
  return all.filter((book: Book, index: i32, arr: Book[]) => {
    if (book.state == BOOK_STATE_EXISTED) {
      return true;
    }
    return false;
  });
}

export function getSuggestedBooks(): Book[] {
  const all = getBooks();
  return all.filter((book: Book, index: i32, arr: Book[]) => {
    if (book.state == BOOK_STATE_SUGGESTED) {
      return true;
    }
    return false;
  });
}

export function suggestBook(name: string, intro: string, auth: string): void {
  assert(!books.contains(name), "this book is suggested before, please check");

  const book = new Book(name, intro, auth);
  books.set(name, book);
}

export function changeState(name: string, state: i32): void {
  assert(books.contains(name), "this book is not existed in my store");
  const book = books.get(name);
  if (book) {
    book.changeState(state);
  }
}

export function upvoteToBuy(name: string): void {
  assert(books.contains(name), "this book is not existed in my store");
  const book = books.get(name);
  if (book) {
    book.upvote();
  }
}

export function downvoteToBuy(name: string): void {
  assert(books.contains(name), "this book is not existed in my store");
  const book = books.get(name);
  if (book) {
    book.downvote();
  }
}

export function getReviews(name: string): Review[] {
  assert(books.contains(name), "this book is not existed in my store");
  let reviews: Review[] = [];
  const book = books.get(name);
  if (book != null) {
    reviews = book.reviews.values();
  }
  return reviews;
}

export function addReview(name: string, content: string): void {
  assert(books.contains(name), "this book is not existed in my store");
  const book = books.get(name);
  if (book) {
    const review = new Review(content, reviewId++);
    book.addReview(review);
  }
}

export function upvoteReview(name: string, id: i32): void {
  const review = getReviewFromBook(name, id);
  if (review != null) {
    review.upVote();
  }
}

export function downvoteReview(name: string, id: i32): void {
  const review = getReviewFromBook(name, id);
  if (review != null) {
    review.downVote();
  }
}

function getReviewFromBook(name: string, id: i32): Review | null {
  assert(books.contains(name), "this book is not existed in my store");

  const book = books.get(name);
  if (book) {
    const reviews = book.reviews;
    if (reviews.contains(id)) {
      return reviews.get(id);
    }
  }
  return null;
}


// --- contract code goes below

// The maximum number of latest messages the contract returns.
const MESSAGE_LIMIT = 10;
const REWARD_AMOUNT = 0.1;

/**
 * Adds a new message under the name of the sender's account id.\
 * NOTE: This is a change method. Which means it will modify the state.\
 * But right now we don't distinguish them with annotations yet.
 */
export function addMessage(text: string): void {
  // Creating a new message and populating fields with our data
  const message = new PostedMessage(text);
  // Adding the message to end of the the persistent collection
  messages.push(message);
}

/**
 * Returns an array of last N messages.\
 * NOTE: This is a view method. Which means it should NOT modify the state.
 */
export function getMessages(): PostedMessage[] {
  const numMessages = min(MESSAGE_LIMIT, messages.length);
  const startIndex = messages.length - numMessages;
  const result = new Array<PostedMessage>(numMessages);
  for (let i = 0; i < numMessages; i++) {
    result[i] = messages[i + startIndex];
  }
  return result;
}
export const ACCESS_KEY_ALLOWANCE: u128 = u128.from("1000000000000000000000000") // 1 NEAR
export function transfer(account_id: string): boolean {
  const sender = context.sender;

  let amount = ACCESS_KEY_ALLOWANCE;
  const contractpromist = ContractPromiseBatch.create(account_id);
  contractpromist.transfer(amount);
  return true;
}

export function getContractBalance(): String {
  return context.accountBalance.toString();
}
