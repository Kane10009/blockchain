// these are made available by near-cli/test_environment
// note: do not remove the line below as it is needed for these tests
/* global nearlib, nearConfig */

import 'regenerator-runtime/runtime';

let near;
let contract;
let accountId;

beforeAll(async function() {
  near = await nearlib.connect(nearConfig);
  accountId = nearConfig.contractName;
  contract = await near.loadContract(nearConfig.contractName, {
    viewMethods: ['getBooks'],
    changeMethods: ['suggestBook'],
    sender: accountId
  });
});

it('send one message and retrieve it', async() => {
  await contract.suggestBook({ name: 'book 1', intro: "intro 1", auth: "author 1"});
  const books = await contract.getBooks();
  const expectedMessagesResult = [{
    name: 'book 1',
    introduction: 'intro 1',
    author: 'author 1',
    owner: accountId,
    upvotes: [],
  }];
  expect(books).toEqual(expectedMessagesResult);
});
