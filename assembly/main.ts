import { Book, BOOK_STATE_EXISTED, BOOK_STATE_SUGGESTED, Review } from './model';
import { context, ContractPromiseBatch, u128, logging, PersistentUnorderedMap, storage } from "near-sdk-as";

export const books = new PersistentUnorderedMap<string, Book>("book-sm");
export const reviews = new PersistentUnorderedMap<i32, Review>("review-sm")

export function clean(): void {
  logging.log("[BE-AS] clean all books");
  books.clear();
  // reviews.clear();
  logbreak();
}

export function getBooks(): Book[] {
  logging.log("[BE-AS] get all books");
  logbreak();
  return books.values();

}

export function suggestBook(name: string, intro: string, auth: string): void {
  logging.log("[BE-AS] add new book name: ".concat(name));
  assert(!books.contains(name), "this book is suggested before, please check");

  const book = new Book(name, intro, auth);
  books.set(name, book);
  logbreak();
}

export function deletedBook(name: string): void {
  logging.log("[BE-AS] delete book name: ".concat(name));
  assert(books.contains(name), "this book is not exist, please check");
  books.delete(name);
  deleteReviewsOfBook(name);
  logbreak();
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

export function upvote(name: string): Book | null {
  logging.log("[BE-AS] upvote book name: ".concat(name));
  logbreak();
  assert(books.contains(name), "this book is not existed in my store");
  const book = books.get(name);
  if (book) {
    const updated = book.up();
    books.set(updated.name, updated);
    return book;
  }
  return null;
}

export function getUpvote(name: string): i32 {
  logging.log("[BE-AS] get Upvote of book: ".concat(name));
  logbreak();
  assert(books.contains(name), "this book is not existed in my store");
  const book = books.get(name);
  if (book) {
    return book.upvotes.length
  }
  return 0;
}

export function getReviews(name: string): Review[] {
  logging.log("[BE-AS] get reviews of book: ".concat(name));
  logbreak();
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

export function addReview(name: string, content: string): Review[] {
  logging.log("[BE-AS] add reviews of book: ".concat(name));
  logbreak();

  assert(books.contains(name), "this book is not existed in my store");
  const book = books.get(name);
  if (book) {
    let reviewId = storage.getPrimitive<i32>("reviewId", 0);
    const review = new Review(name, content, reviewId);
    reviews.set(review.id, review);

    reviewId = reviewId + 1;
    storage.set<i32>("reviewId", reviewId);
  }

  let filtered: Review[] = [];
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

export function editReview(id: i32, content: string): void {
  logging.log("[BE-AS] edit review id: ".concat(id.toString()));
  logbreak();
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
  logging.log("[BE-AS] delete review id: ".concat(id.toString()));
  logbreak();
  assert(reviews.contains(id), "this content is not existed in my store");
  const review = reviews.get(id);
  if (review != null) {
    reviews.delete(id);
  } else {
    logging.log("deleteReview : not found the review id");
  }
}

export function upvoteReview(id: i32): Review | null {
  logging.log("[BE-AS] upvote review id: ".concat(id.toString()));
  logbreak();
  assert(reviews.contains(id), "this content is not existed in my store");
  const review = reviews.get(id);
  if (review != null) {
    const updated = review.upVote();
    reviews.set(id, updated);
    return review;
  } else {
    logging.log("review = null");
  }
  return null;
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

export function donate(id: i32, amount: u128): boolean {
  assert(reviews.contains(id), "this content is not existed in my store");
  const review = reviews.get(id);

  if (review) {
    const receiver = review.reviewer;
    logging.log("[BE-AS] donate sender: ".concat(context.sender).concat(", receiver: ").concat(receiver).concat(", amount: ").concat(amount.toString()));
    logbreak();

    const contractpromist = ContractPromiseBatch.create(receiver);
    contractpromist.transfer(amount);
  }

  return true;
}

function logbreak() : void {
  logging.log("------------------------------------------");
}

// export function getContractBalance(): String {
//   return context.accountBalance.toString();
// }
