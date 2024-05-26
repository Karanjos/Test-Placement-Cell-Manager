import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: "string",
      required: [true, "Please provide job title!"],
    },
    companyName: {
      type: "string",
      required: [true, "Please provide company name!"],
    },
    companyLogo: {
      type: "string",
    },
    location: {
      address: {
        type: "string",
        required: [true, "Please provide address!"],
      },
      city: {
        type: "string",
        required: [true, "Please provide city!"],
      },
      state: {
        type: "string",
        required: [true, "Please provide state!"],
      },
      country: {
        type: "string",
        required: [true, "Please provide country!"],
      },
      postalCode: {
        type: "string",
      },
    },
    jobLocation: {
      type: "string",
      enum: ["Remote", "Onsite", "Hybrid"],
    },
    salary: {
      fixed: {
        type: Number,
      },
      min: {
        type: Number,
      },
      max: {
        type: Number,
      },
    },
    employmentType: {
      type: String,
      enum: ["Full Time", "Part Time", "Internship"],
    },
    jobCategory: {
      type: String,
      enum: ["IT", "Marketing", "Finance", "HR", "Management", "Others"],
    },
    experienceLevel: {
      type: String,
      enum: ["Fresher", "Mid Level", "Senior Level"],
    },
    educationRequirement: {
      type: String,
    },
    skillsRequired: {
      type: [String],
    },
    applicationDeadline: {
      type: Date,
    },
    contactInfo: {
      email: {
        type: "string",
      },
      phone: {
        type: "string",
      },
      website: {
        type: "string",
      },
    },
    jobDescription: {
      type: "string",
    },
    slug: {
      type: "string",
      unique: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
