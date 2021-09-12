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

  upvotes: string[]; // upvote 

  constructor(name: string, intro: string, auth: string) {
    this.name = name;
    this.introduction = intro;
    this.author = auth;

    this.owner = context.sender;

    this.upvotes = [];
  }

  public isUpvoted(): boolean {
    const index = this.upvotes.indexOf(context.sender);
    if (index == -1) {
      return false;
    }
    return true;
  }

  public up(): Book {
    if (this.isUpvoted()) {
      this.upvotes = this.filterExclude(context.sender, this.upvotes);
    }else{
      this.upvotes.push(context.sender);
    }

    return this;
  }


  private filterExclude(val: string, array: string[]): string[] {
    let filtered: string[] = [];
    for (let i = 0; i < array.length; i++) {
      if (val != array[i]) {
        filtered.push(array[i]);
      }
    }

    return filtered;
  }

  //#endregion 

}

@nearBindgen
export class Review {
  id: i32;
  name: string;
  reviewer: string;
  content: string;
  upvotes: string[];

  reward: i32;

  constructor(name: string, content: string, id: i32) {
    this.reviewer = context.sender;
    this.id = id;
    this.name = name;
    this.content = content;

    this.reward = 0;

    this.upvotes= [];
  }

  public isUpvoted(): boolean {
    const index = this.upvotes.indexOf(context.sender);
    if (index == -1) {
      return false;
    }
    return true;
  }

  public upVote(): Review {
    if (this.isUpvoted()) {
      this.upvotes = this.filterExclude(context.sender, this.upvotes);
    }else{
      this.upvotes.push(context.sender);
    }

    return this;
  }

  private filterExclude(val: string, array: string[]): string[] {
    let filtered: string[] = [];
    for (let i = 0; i < array.length; i++) {
      if (val != array[i]) {
        filtered.push(array[i]);
      }
    }

    return filtered;
  }
}


// /** 
//  * Exporting a new class PostedMessage so it can be used outside of this file.
//  */
// @nearBindgen
// export class PostedMessage {
//   premium: boolean;
//   sender: string;
//   constructor(public text: string) {
//     this.premium = context.attachedDeposit >= u128.from('10000000000000000000000');
//     this.sender = context.sender;
//   }
// }
// /**
//  * collections.vector is a persistent collection. Any changes to it will
//  * be automatically saved in the storage.
//  * The parameter to the constructor needs to be unique across a single contract.
//  * It will be used as a prefix to all keys required to store data in the storage.
//  */
// export const messages = new PersistentVector<PostedMessage>("m");
