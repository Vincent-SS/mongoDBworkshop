const express = require('express');
const Review = require('./models/Review');

const router = express.Router();

router.get("/reviews", async (req, res) => {
  const reviews = await Review.find({}, 'author subject rating content');
  res.send({listPosts: reviews});
})

router.post("/reviews", async (req, res) => {
  var d = new Date();
  const review = new Review({
    author: req.body.author,
    subject: req.body.subject,
    rating: req.body.rating,
    content: req.body.content,
    date: d.toLocaleString()
  });

  // Save it into database
  await review.save();
  res.send(review);
})

router.get("/reviews/find", async (req, res) => {
  const reviews = await Review.find({$or: [{author: req.query.searchTerm}, {subject: req.query.searchTerm}]}, 'author subject rating content');
  res.send({listReviews: reviews});
})

// Get any data matched subject comp1511
router.get("/reviews/aggregation", async (req, res) => {
  let match = {subject: "COMP1511"};

  // Group stage
  let group = {
    _id: "$subject",
    average: { $avg: "$rating" },
    count: { $sum: 1 }
  }

  /* let reviews = await Review.aggregate([{$match : match}]) */
  let reviews = await Review.aggregate([{$match : match}, {$group : group}])
  res.send({reviewList: reviews});
})

// Here :means variable
router.get("/reviews/:reviewID", async (req, res) => {
  try {
    const review = await Review.findOne({_id: req.params.reviewID}, 'author subject rating content date');
    res.send(review);
  } catch {
    res.status(404).send({error: "Post not found"})
  }
})

router.delete("/reviews/:reviewID", async (req, res) => {
  try {
    Review.deleteOne({_id: req.params.reviewID})
    // const Review.deleteMany({})
    .then(() => {
      res.status(204).send()
      // console.log(req.params.reviewID);
    })
  } catch {
    // console.log(req.params.reviewID);
    res.status(404).send({error: "Review not found"});
  }
})

router.patch("/reviews/:reviewID", async (req, res) => {
  try {
    let review = await Review.findOne({_id: req.params.reviewID});
    review.content = req.body.content;
    await review.save();
    res.send(review);
  } catch {
    res.status(404).send({error: "Review not found"});
  }
})

module.exports = router;