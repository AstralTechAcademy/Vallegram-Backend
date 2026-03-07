// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use("ElValle-App");

// Find a document in a collection.
db.getCollection("feed").aggregate([
{
      $match: {
              user_id: "69a09fdf38da0ec8f9ef5f7c",
          }
    },
    {
    $lookup: {
            from: "posts",
            localField: "post_id",
            foreignField: "_id",
            as: "post_details"
        }
    }
    ]);
