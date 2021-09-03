
#  books
near view $CONTRACT getBooks '{}' --account_id $OWNER

near call $CONTRACT suggestBook '{"name":"book 1","intro":"intro for book 1","auth":"auth of book 1"}' --account_id $OWNER
near call $CONTRACT suggestBook '{"name":"book 2","intro":"intro for book 2","auth":"auth of book 2"}' --account_id $OWNER
near call $CONTRACT changeState '{"name":"book 1","state":'1'}' --account_id $OWNER
near call $CONTRACT deletedBook '{"name":"book 1"}' --account_id $OWNER

near call $CONTRACT upvoteToBuy '{"name":"book 1"}' --account-id $OWNER
near call $CONTRACT downvoteToBuy '{"name":"book 1"}' --account-id $OWNER

near call $CONTRACT clean '{}' --account-id $OWNER
# -----------------------------------------------------------------------------------


# reviews
near view $CONTRACT getReviews '{"name":"book 1"}' --account_id $OWNER

near call $CONTRACT addReview '{"name":"book 1","content":"review 1 for book 1"}' --account-id $OWNER
near call $CONTRACT editReview '{"id":'0',"content":"edit review 1 for book 1"}' --account-id $OWNER
near call $CONTRACT deleteReview '{"id":'0'}' --account-id $OWNER

near call $CONTRACT upvoteReview '{"id":'0'}' --account-id $OWNER
near call $CONTRACT downvoteReview '{"id":'0'}' --account-id $OWNER
# -----------------------------------------------------------------------------------

