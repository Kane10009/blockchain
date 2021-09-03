import { context, u128, PersistentVector, logging } from "near-sdk-as";

export const BOOK_STATE_SUGGESTED: i32 = 0;
export const BOOK_STATE_EXISTED: i32 = 1;

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

  constructor(name: string, intro: string, auth: string) {
    this.name = name;
    this.introduction = intro;
    this.author = auth;

    this.owner = context.sender;

    this.state = BOOK_STATE_SUGGESTED;

    this.upvoteToBuy = [];
    this.downvoteToBuy = [];
  }

  public changeState(newState: i32): Book {
    this.state = newState;
    return this;
  }

  //#region : upvote/downvote
  public isUpvoted(): boolean {
    const index = this.upvoteToBuy.indexOf(context.sender);
    if (index == -1) {
      return false;
    }
    return true;
  }

  public upvote(): Book {
    logging.log("upvote");
    if (!this.isUpvoted()) {
      logging.log("! isUpvoted: ".concat(context.sender));
      this.upvoteToBuy.push(context.sender);
      logging.log("length: ".concat(this.upvoteToBuy.length.toString()));
    }

    // if downvote before -> delete it in downvoteToBuy
    this.removeDownvote(context.sender);
    return this;
  }

  public downvote(): Book {
    if (!this.isDownvoted()) {
      this.downvoteToBuy.push(context.sender);
    }

    // if upvote before -> delete it in upvoteToBuy
    this.removeUpvote(context.sender);

    return this;
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

    logging.log("removeDownvote");

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
  name: string;
  reviewer: string;
  content: string;
  upvoteReview: string[];
  downvoteReview: string[];

  reward: i32;

  constructor(name: string, content: string, id: i32) {
    this.reviewer = context.sender;
    this.id = id;
    this.name = name;
    this.content = content;

    this.reward = 0;

    this.upvoteReview = [];
    this.downvoteReview = [];
  }

  public isUpvoted(): boolean {
    const index = this.upvoteReview.indexOf(context.sender);
    if (index == -1) {
      return false;
    }
    return true;
  }

  public isDownvoted(): boolean {
    const index = this.downvoteReview.indexOf(context.sender);
    if (index == -1) {
      return false;
    }
    return true;
  }

  public upVote(): Review {
    if (!this.isUpvoted()) {
      this.upvoteReview.push(context.sender);
    }

    // if downvote before -> delete it in downvoteToBuy
    this.removeDownvote(context.sender);
    return this;
  }

  public downVote(): Review {
    if (!this.isDownvoted()) {
      this.downvoteReview.push(context.sender);
    }

    // if downvote before -> delete it in downvoteToBuy
    this.removeUpvote(context.sender);
    return this;
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
    const index = this.downvoteReview.indexOf(context.sender);
    if (index > -1) {
      this.downvoteReview = this.filter(author, this.downvoteReview);
    }
  }

  private removeUpvote(author: string): void {
    const index = this.upvoteReview.indexOf(context.sender);
    if (index > -1) {
      this.upvoteReview = this.filter(author, this.upvoteReview);
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
