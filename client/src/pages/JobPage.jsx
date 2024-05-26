import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";
import {
  FaRupeeSign,
  FaClock,
  FaBusinessTime,
  FaCalendarMinus,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import JobCard from "../components/JobCard";

const JobPage = () => {
  const { jobSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [currentJob, setCurrentJob] = useState(null);
  const [error, setError] = useState(false);
  const [recentJobs, setRecentJobs] = useState([]);
  const [currentJobId, setCurrentJobId] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/job/getjobs?slug=${jobSlug}`);
        const data = await response.json();
        if (!response.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (response.ok) {
          setCurrentJob(data.jobs[0]);
          setCurrentJobId(data.jobs[0]._id);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobSlug]);

  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        const res = await fetch("/api/job/getjobs?limit=3");
        if (!res.ok) return console.log(res.message);
        if (res.ok) {
          const data = await res.json();
          const newJobs = data.jobs.filter((job) => job._id !== currentJobId);
          setRecentJobs(newJobs);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchRecentJobs();
  }, [currentJobId]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  return (
    <div className="py-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {currentJob.jobTitle}
      </h1>

      <div className="flex flex-col justify-between items-center mb-5 md:flex-row gap-10 px-3">
        <div className="flex flex-col md:flex-row gap-4 items-center mt-5">
          {currentJob.companyLogo && (
            <img
              src={currentJob.companyLogo}
              alt={currentJob.companyName}
              className="w-52 rounded-lg"
            />
          )}

          <div className="flex flex-col gap-2 justify-center items-center px-3">
            <div className="flex flex-col md:flex-row gap-2">
              <h1>{currentJob.companyName}</h1>
              <Link
                to={`/search?jobCategory=${
                  currentJob && currentJob.jobCategory
                }`}
                className="self-center"
              >
                <Button color="gray" pill size="xs" className="px-3">
                  {currentJob && currentJob.jobCategory}
                </Button>
              </Link>
            </div>
            <div className=" justify-center items-center">
              <p>
                {currentJob.location.address}, {currentJob.location.city},{" "}
                {currentJob.location.state}, {currentJob.location.country},{" "}
                {currentJob.location.postalCode}
              </p>
            </div>
          </div>
        </div>
        {/**link to apply for job  */}
        <Link to={`/apply/${currentJob._id}`}>
          <Button gradientDuoTone="purpleToBlue" outline>
            Apply for job
          </Button>
        </Link>
      </div>
      <div className="divider"></div>
      {/**job details */}
      <div className="px-3 flex justify-between text-sm flex-col md:flex-row gap-4 md:gap-0 items-center">
        <div className="flex gap-2 items-center">
          <FaRupeeSign size={20} />
          <div className="font-semibold">
            {currentJob.salary.fixed && (
              <p>{currentJob.salary.fixed.toLocaleString()}</p>
            )}
            {/* <div className="divider">OR</div> */}
            {currentJob.salary.min && currentJob.salary.max && (
              <p>
                {currentJob.salary.min.toLocaleString()} -{" "}
                {currentJob.salary.max.toLocaleString()}
              </p>
            )}
          </div>
        </div>
        <div className="divider mx-0 divider-horizontal"></div>
        <div className="flex gap-2 items-center">
          <FaBusinessTime size={20} />
          <p className="font-semibold">{currentJob.experienceLevel}</p>
        </div>
        <div className="divider mx-0 divider-horizontal"></div>
        <div className="flex gap-2 items-center">
          <MdLocationOn size={20} />
          <p className="font-semibold">{currentJob.jobLocation}</p>
        </div>
        <div className="divider mx-0 divider-horizontal"></div>
        <div className="flex gap-2 items-center">
          <FaClock size={20} />
          <p className="semibold">{currentJob.employmentType}</p>
        </div>
        <div className="divider mx-0 divider-horizontal"></div>
        <div className="flex gap-2 items-center">
          <FaCalendarMinus size={20} />
          <p className="font-semibold">Deadline :</p>
          <p className="font-semibold">
            {currentJob.applicationDeadline.split("T")[0]}
          </p>
        </div>
      </div>
      {/**skills required */}
      <div className="px-3 flex gap-8 flex-col mt-10">
        <h3 className=" text-xl font-bold">Skills & Requirements</h3>
        <div className="flex flex-wrap gap-4">
          {currentJob.skillsRequired.map((skill, index) => (
            <Button key={index} color="gray" pill size="sm">
              {skill}
            </Button>
          ))}
        </div>
      </div>
      {/**educationRequirement */}
      <div className="px-3 mt-10">
        <h3 className="text-xl font-bold">Education Requirements</h3>
        <p className="mt-5">{currentJob.educationRequirement}</p>
      </div>
      {/**job description */}
      <div className="">
        <h3 className="text-xl font-bold mt-10 px-3">Job Description</h3>
        <div
          className="px-3 mt-5 max-w-7xl w-full post-content"
          dangerouslySetInnerHTML={{ __html: currentJob.jobDescription }}
        ></div>
      </div>
      {/**contactInfo */}
      <div className="px-3 mt-10">
        <h3 className="text-xl font-bold">Contact Information</h3>
        <div className="flex gap-4 mt-5">
          <div className="flex flex-col gap-2">
            <p className="font-semibold">
              Email : {currentJob.contactInfo.email}
            </p>
            <p className="font-semibold">
              Phone : {currentJob.contactInfo.phone}
            </p>
            <p className="font-semibold">
              Website : {currentJob.contactInfo.website}
            </p>
          </div>
        </div>
      </div>
      {/**call to action */}
      <div className="w-full mt-10">
        <CallToAction />
      </div>
      <div className="divider mt-10 mb-5"></div>
      {/**recent jobs */}
      <div className="flex flex-col px-3 mb-10">
        <h3 className="text-xl font-bold">Recent Jobs</h3>
        <div className="flex flex-wrap gap-10 mt-10 justify-center">
          {recentJobs &&
            recentJobs.map((job) => <JobCard job={job} key={job._id} />)}
        </div>
        <div className=" self-center mt-5">
          <Link to="/search">
            <Button color="gray" pill>
              View all jobs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default JobPage;
