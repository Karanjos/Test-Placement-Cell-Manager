import { Button, Card } from "flowbite-react";
import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  return (
    <Card className=" w-80">
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {job.jobTitle}
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        {job.jobCategory}
      </p>
      <p className="text-gray-700 dark:text-gray-400">
        {job.location.city}, {job.location.country}
      </p>
      <p>
        <span className="font-bold">{job.employmentType}</span>
        <span className="font-normal"> & {job.experienceLevel}</span>
      </p>
      <Link to={`/job/${job.slug}`}>
        <Button type="button" gradientDuoTone="purpleToBlue" className="w-full">
          view more
        </Button>
      </Link>
    </Card>
  );
};
export default JobCard;
