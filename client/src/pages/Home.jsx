import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { useEffect, useState } from "react";
import JobCard from "../components/JobCard";
import { Button, Spinner } from "flowbite-react";
import { useSelector } from "react-redux";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const { loading } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await fetch("/api/job/getjobs");
      const data = await res.json();
      setJobs(data.jobs);
    };
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto ">
        <h1 className="text-3xl font-bold lg:text-6xl">
          Welcome to Placement Portal
        </h1>
        <p className="text-gray-600 text-xs sm:text-sm">
          Here you&apos;ll find a variety of job opportunities and management of
          your placement records as Student, Recruiter and Placement Officer.
        </p>
        <Link to={"/search"} className="hover:underline self-start">
          <Button color="gray" pill className="text-sm">
            View all jobs
          </Button>
        </Link>
      </div>
      <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {jobs && jobs.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">Recent Jobs</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
            <Link
              to={"/search"}
              className="text-sm font-bold hover:underline self-center"
            >
              <Button color="gray" pill>
                View all jobs
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
