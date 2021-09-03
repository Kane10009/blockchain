import { Book, BOOK_STATE_EXISTED, BOOK_STATE_SUGGESTED, Review } from './model';
import { context, ContractPromiseBatch, u128, logging, PersistentUnorderedMap, storage } from "near-sdk-as";

export const books = new PersistentUnorderedMap<string, Book>("book-sm");
export const reviews = new PersistentUnorderedMap<i32, Review>("review-sm")

export function clean(): void {
  books.clear();
}

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

export function deletedBook(name: string): void {
  assert(books.contains(name), "this book is not exist, please check");
  books.delete(name);
  deleteReviewsOfBook(name);
}

function deleteReviewsOfBook(name: string): void {
  assert(!books.contains(name), "this book is suggested before, please check");
  const book = books.get(name);
  if (book != null) {
    const values = reviews.values();
    for (let i = 0; i < values.length; i++) {
      if (name == values[i].name) {
        reviews.delete(values[i].id);
      }
    }
  }
}

export function changeState(name: string, state: i32): void {
  assert(books.contains(name), "this book is not existed in my store");
  const book = books.get(name);
  if (book) {
    const updated = book.changeState(state);
    books.set(updated.name, updated);
  }
}

export function upvoteToBuy(name: string): void {
  assert(books.contains(name), "this book is not existed in my store");
  const book = books.get(name);
  logging.log("upvoteToBuy: ");
  if (book) {
    const updated = book.upvote();
    books.set(updated.name, updated);
  }
}

export function downvoteToBuy(name: string): void {
  assert(books.contains(name), "this book is not existed in my store");
  const book = books.get(name);
  if (book) {
    const updated = book.downvote();
    books.set(updated.name, updated);
  }
}

export function getReviews(name: string): Review[] {
  assert(books.contains(name), "this book is not existed in my store");
  let filtered: Review[] = [];
  const book = books.get(name);
  if (book != null) {
    const values = reviews.values();
    for (let i = 0; i < values.length; i++) {
      if (name == values[i].name) {
        filtered.push(values[i]);
      }
    }
  }
  return filtered;
}

export function addReview(name: string, content: string): void {
  assert(books.contains(name), "this book is not existed in my store");
  const book = books.get(name);
  if (book) {
    let reviewId = storage.getPrimitive<i32>("reviewId", 0);
    const review = new Review(name, content, reviewId);
    reviews.set(review.id, review);

    reviewId = reviewId + 1;
    storage.set<i32>("reviewId", reviewId);
  }
}

export function editReview(id: i32, content: string): void {
  assert(reviews.contains(id), "this content is not existed in my store");
  const review = reviews.get(id);
  if (review != null) {
    review.content = content;
    reviews.set(id, review);
  } else {
    logging.log("editReview : not found the review id");
  }
}

export function deleteReview(id: i32): void {
  assert(reviews.contains(id), "this content is not existed in my store");
  const review = reviews.get(id);
  if (review != null) {
    reviews.delete(id);
  } else {
    logging.log("deleteReview : not found the review id");
  }
}

export function upvoteReview(id: i32): void {
  assert(reviews.contains(id), "this content is not existed in my store");
  const review = reviews.get(id);
  if (review != null) {
    const updated = review.upVote();
    reviews.set(id, updated);
  }
}

export function downvoteReview(id: i32): void {
  assert(reviews.contains(id), "this content is not existed in my store");
  const review = reviews.get(id);
  if (review != null) {
    const updated = review.downVote();
    reviews.set(id, updated);
  }
}

// // --- contract code goes below

// // The maximum number of latest messages the contract returns.
// const MESSAGE_LIMIT = 10;
// const REWARD_AMOUNT = 0.1;

// /**
//  * Adds a new message under the name of the sender's account id.\
//  * NOTE: This is a change method. Which means it will modify the state.\
//  * But right now we don't distinguish them with annotations yet.
//  */
// export function addMessage(text: string): void {
//   // Creating a new message and populating fields with our data
//   const message = new PostedMessage(text);
//   // Adding the message to end of the the persistent collection
//   messages.push(message);
// }

// /**
//  * Returns an array of last N messages.\
//  * NOTE: This is a view method. Which means it should NOT modify the state.
//  */
// export function getMessages(): PostedMessage[] {
//   const numMessages = min(MESSAGE_LIMIT, messages.length);
//   const startIndex = messages.length - numMessages;
//   const result = new Array<PostedMessage>(numMessages);
//   for (let i = 0; i < numMessages; i++) {
//     result[i] = messages[i + startIndex];
//   }
//   return result;
// }
// export const ACCESS_KEY_ALLOWANCE: u128 = u128.from("1000000000000000000000000") // 1 NEAR
// export function transfer(account_id: string): boolean {
//   const sender = context.sender;

//   let amount = ACCESS_KEY_ALLOWANCE;
//   const contractpromist = ContractPromiseBatch.create(account_id);
//   contractpromist.transfer(amount);
//   return true;
// }

// export function getContractBalance(): String {
//   return context.accountBalance.toString();
// }
