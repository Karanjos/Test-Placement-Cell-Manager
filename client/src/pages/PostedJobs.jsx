import { Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import JobCard from "../components/JobCard";
import { useSelector } from "react-redux";

const PostedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/job/getpostedjobs/${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setJobs(data);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.log(error.message);
      }
    };
    if (currentUser._id) fetchJobs();
  }, [currentUser._id]);

  if (loading) {
    return (
      <div className=" min-h-screen">
        <div className="flex justify-center items-center">
          <Spinner size="xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row px-3 min-h-screen my-10">
      <div className="w-full">
        {loading && (
          <div className="flex justify-center items-center min-h-screen">
            <Spinner size="xl" />
          </div>
        )}
        <div className="p-7 flex flex-wrap gap-8 justify-center">
          {!loading && jobs.length === 0 && (
            <p className=" text-xl text-gray-500">No jobs found</p>
          )}
          {loading && <p className=" text-xl text-gray-500">Loading...</p>}
          {!loading &&
            jobs &&
            jobs.map((job) => <JobCard job={job} key={job._id} />)}
        </div>
      </div>
    </div>
  );
};
export default PostedJobs;
