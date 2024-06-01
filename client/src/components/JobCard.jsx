import { Button, Card } from "flowbite-react";
import { Link } from "react-router-dom";
import { FaClock, FaMapMarkerAlt, FaRupeeSign, FaCity } from "react-icons/fa";

const JobCard = ({ job }) => {
  const timeSince = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  };
  return (
    <Link to={`/job/${job.slug}`} className="p-0 m-0">
      <Card className=" w-80 h-72 ">
        <div className="flex justify-between">
          {job.companyLogo && (
            <img
              src={job.companyLogo}
              alt="company logo"
              className="w-12 h-12 rounded-full"
            />
          )}
          <div className="flex flex-col">
            <p className="text-gray-700 dark:text-gray-400 text-xl font-semibold">
              {job.jobTitle}
            </p>
            <div className="flex items-center text-xs gap-2">
              <FaCity />
              <p className="text-gray-700 dark:text-gray-400">
                {job.companyName}
              </p>
            </div>
          </div>
        </div>
        <div className="divider m-0 p-0"></div>
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <FaMapMarkerAlt />
            <p className="text-gray-700 dark:text-gray-400">
              {job.jobLocation}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <FaClock />
            <p className="text-gray-700 dark:text-gray-400">
              {job.employmentType}
            </p>
          </div>
        </div>
        <div
          className="my-2 text-xs text-gray-700 dark:text-gray-400"
          dangerouslySetInnerHTML={{
            __html:
              job.jobDescription.length > 70
                ? job.jobDescription.slice(0, 70) + "..."
                : job.jobDescription,
          }}
        ></div>
        <Link
          to={`/search?jobCategory=${job && job.jobCategory}`}
          className="self-center"
        >
          <Button color="gray" pill size="xs" className="px-3">
            {job && job.jobCategory}
          </Button>
        </Link>
        <div className="flex justify-between">
          <div className="flex gap-1 items-center text-sm">
            <FaRupeeSign />
            {job.salary.fixed && <p>{job.salary.fixed}</p>}
            {job.salary.min && job.salary.max && (
              <p>
                {job.salary.min} - {job.salary.max}
              </p>
            )}
          </div>
          <div className="text-xs flex items-center">
            <p>{timeSince(new Date(job.createdAt))} ago</p>
          </div>
        </div>
      </Card>
    </Link>
  );
};
export default JobCard;
