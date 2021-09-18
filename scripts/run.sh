
#  books
near view $CONTRACT getBooks '{}' --account_id $OWNER

near call $CONTRACT suggestBook '{"name":"book 1","intro":"intro for book 1","auth":"auth of book 1"}' --account_id $OWNER
near call $CONTRACT suggestBook '{"name":"book 2","intro":"intro for book 2","auth":"auth of book 2"}' --account_id $OWNER

near call $CONTRACT deletedBook '{"name":"book 1"}' --account_id $OWNER
near call $CONTRACT upvote '{"name":"book 1"}' --account-id $OWNER
near call $CONTRACT upvote '{"name":"book 1"}' --account-id $OWNER

near call $CONTRACT clean '{}' --account-id $OWNER
# -----------------------------------------------------------------------------------


# reviews
near view $CONTRACT getReviews '{"name":"book 1"}' --account_id $OWNER

near call $CONTRACT addReview '{"name":"book 1","content":"review 1 for book 1"}' --account-id $OWNER
#
near call $CONTRACT editReview '{"id":'12',"content":"edit review 1 for book 1"}' --account-id $OWNER
near call $CONTRACT deleteReview '{"id":'0'}' --account-id $OWNER

near call $CONTRACT upvoteReview '{"id":'0'}' --account-id $OWNER
near call $CONTRACT upvoteReview '{"id":'0'}' --account-id $OWNER
# -----------------------------------------------------------------------------------

#donate
near call $CONTRACT donate '{"id":'13',"amount":"5000000000000000000000000"}' --account-id $OWNER --gas 20000000000000 --deposit 5

