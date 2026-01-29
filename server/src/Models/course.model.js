const mongoose = require("mongoose");
const { reviewSchema } = require("./review.model");

const courseSchema = new mongoose.Schema(
  {
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    content: {
      totalDuration: {
        type: Number,
        default: 0,
      },
      sections: [
        {
          title: String,
          lectureCount: Number,
          duration: Number,
          lectures: [
            {
              title: String,
              type: {
                type: String,
                enum: ["video", "exercise", "article", "quiz", "assignment"],
              },
              url: String,
              duration: Number,
              isPreview: Boolean,
            },
          ],
        },
      ],
    },
    requirements: [String],
    keywords: {
      type: [String],
      default: [],
    },
    topics: [String],
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "all"],
      required: true,
    },
    language: {
      type: String,
      required: true,
      default: "English",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    totalRaters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    studentsEnrolled: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    badges: [
      {
        type: String,
        enum: ["bestseller", "hot", "new", "trending"],
      },
    ],
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

courseSchema.virtual("discountedPrice").get(function () {
  return this.price * (1 - this.discount / 100);
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
