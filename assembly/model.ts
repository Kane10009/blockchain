import { context, u128, PersistentVector, PersistentUnorderedMap } from "near-sdk-as";
import { Array } from "array";

export const BOOK_STATE_SUGGESTED: i32 = 0;
export const BOOK_STATE_EXISTED: i32 = 1;

export const books = new PersistentUnorderedMap<string, Book>("book-sm")

/** 
 * books that suggested by user
 */
@nearBindgen
export class Book {
  name: string; // using to identify
  introduction: string;
  author: string;

  owner: string; // the first people that public this suggested

  state: i32;

  upvoteToBuy: string[]; // upvote for buying
  downvoteToBuy: string[]; // downvote for buying

  reviews: PersistentUnorderedMap<i32, Review>; // may be multiple review for a book

  constructor(name: string, intro: string, auth: string) {
    this.name = name;
    this.introduction = intro;
    this.author = auth;

    this.owner = context.sender;

    this.state = BOOK_STATE_SUGGESTED;

    this.reviews = new PersistentUnorderedMap<i32, Review>("review-sm");
  }

  public changeState(newState: i32): void {
    this.state = newState;
  }

  public addReview(review: Review): void {
    this.reviews.set(review.id, review);
  }

  //#region : upvote/downvote
  public isUpvoted(): boolean {
    const index = this.upvoteToBuy.indexOf(context.sender);
    if (index == -1) {
      return false;
    }
    return true;
  }

  public upvote(): void {
    if (!this.isUpvoted()) {
      this.upvoteToBuy.push(context.sender);
    }

    // if downvote before -> delete it in downvoteToBuy
    this.removeDownvote(context.sender);
  }

  public downvote(): void {
    if (!this.isDownvoted()) {
      this.upvoteToBuy.push(context.sender);
    }

    // if upvote before -> delete it in upvoteToBuy
    this.removeUpvote(context.sender);
  }

  public isDownvoted(): boolean {
    const index = this.downvoteToBuy.indexOf(context.sender);
    if (index == -1) {
      return false;
    }
    return true;
  }

  private removeDownvote(author: string): void {
    assert(author != null, "author need != null");
    const index = this.downvoteToBuy.indexOf(context.sender);
    if (index > -1) {
      this.downvoteToBuy = this.filter(author, this.downvoteToBuy);
    }
  }

  private filter(val: string, array: string[]): string[] {
    let filtered: string[] = [];
    for (let i = 0; i < array.length; i++) {
      if (val != array[i]) {
        filtered.push(array[i]);
      }
    }

    return filtered;
  }

  private removeUpvote(author: string): void {
    const index = this.upvoteToBuy.indexOf(context.sender);
    if (index > -1) {
      this.upvoteToBuy = this.filter(author, this.upvoteToBuy);
    }
  }
  //#endregion 

}

@nearBindgen
export class Review {
  id: i32;
  reviewer: string;
  content: string;
  upvote: string[];
  downvote: string[];

  reward: i32;

  constructor(content: string, id: i32) {
    this.reviewer = context.sender;
    this.id = id;
    this.content = content;

    this.reward = 0;
  }

  public isUpvoted(): boolean {
    const index = this.upvote.indexOf(context.sender);
    if (index == -1) {
      return false;
    }
    return true;
  }

  public isDownvoted(): boolean {
    const index = this.downvote.indexOf(context.sender);
    if (index == -1) {
      return false;
    }
    return true;
  }

  public upVote(): void {
    if (!this.isUpvoted()) {
      this.upvote.push(context.sender);
    }

    // if downvote before -> delete it in downvoteToBuy
    this.removeDownvote(context.sender);
  }

  public downVote(): void {
    if (!this.isDownvoted()) {
      this.downvote.push(context.sender);
    }

    // if downvote before -> delete it in downvoteToBuy
    this.removeUpvote(context.sender);
  }

  private filter(val: string, array: string[]): string[] {
    let filtered: string[] = [];
    for (let i = 0; i < array.length; i++) {
      if (val != array[i]) {
        filtered.push(array[i]);
      }
    }

    return filtered;
  }

  private removeDownvote(author: string): void {
    const index = this.downvote.indexOf(context.sender);
    if (index > -1) {
      this.downvote = this.filter(author, this.downvote);
    }
  }

  private removeUpvote(author: string): void {
    const index = this.upvote.indexOf(context.sender);
    if (index > -1) {
      this.upvote = this.filter(author, this.upvote);
    }
  }

}


/** 
 * Exporting a new class PostedMessage so it can be used outside of this file.
 */
@nearBindgen
export class PostedMessage {
  premium: boolean;
  sender: string;
  constructor(public text: string) {
    this.premium = context.attachedDeposit >= u128.from('10000000000000000000000');
    this.sender = context.sender;
  }
}
/**
 * collections.vector is a persistent collection. Any changes to it will
 * be automatically saved in the storage.
 * The parameter to the constructor needs to be unique across a single contract.
 * It will be used as a prefix to all keys required to store data in the storage.
 */
export const messages = new PersistentVector<PostedMessage>("m");
