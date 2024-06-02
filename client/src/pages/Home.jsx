import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { useEffect, useState } from "react";
import JobCard from "../components/JobCard";
import { Button, Spinner } from "flowbite-react";
import { useSelector } from "react-redux";
import { FaGithubAlt, FaLinkedinIn } from "react-icons/fa6";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const { loading, currentUser } = useSelector((state) => state.user);

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
        {currentUser && (currentUser.isAdmin || currentUser.isEmployer) ? (
          <Link to="/dashboard?tab=dash">
            <Button color="gray" pill>
              Go to Dashboard
            </Button>
          </Link>
        ) : (
          <Link to={"/search"} className="hover:underline self-start">
            <Button color="gray" pill className="text-sm">
              See All Jobs
            </Button>
          </Link>
        )}
      </div>
      <div className="divider">
        {" "}
        <h1 className=" text-4xl font-extrabold dark:text-slate-400">
          Our Team
        </h1>
      </div>

      <div className=" flex flex-col gap-10 p-3">
        <p className=" self-center">
          Our team is dedicated to providing the best experience for our users.
        </p>
        <div className="flex flex-wrap justify-center gap-32">
          <div className="flex flex-col items-center gap-2">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/mern-auth-joshi.appspot.com/o/1715700348076WhatsApp%20Image%202024-04-07%20at%2020.03.57_6f243ab7.jpg?alt=media&token=43857519-939d-48f6-9c01-b435c109f658"
              alt="Karan Joshi"
              className="rounded-full w-36 h-36 object-cover"
            />
            <p>Karan Joshi</p>
            <p>Full Stack Developer</p>
            <p className="flex gap-2 text-2xl justify-between">
              <Link
                to="https://www.linkedin.com/in/karan-joshi-8b3910213/"
                target="_blank"
              >
                <FaLinkedin />
              </Link>
              <Link to="https://github.com/Karanjos" target="_blank">
                {" "}
                <FaGithub />
              </Link>
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/mern-auth-joshi.appspot.com/o/AkhilTheBackEndDeveloper.jpg?alt=media&token=45065eb4-d524-4265-a3ad-f684fda4701d"
              alt="Akhil Patwal"
              className="rounded-full w-36 h-36 object-cover"
            />
            <p>Akhil Patwal</p>
            <p>Back End Developer</p>
            <p className="flex gap-2 text-2xl justify-between">
              <Link
                to="https://www.linkedin.com/in/akhil-patwal-2a52a9213/"
                target="_blank"
              >
                <FaLinkedin />
              </Link>
              <Link to="https://github.com/Akhilpatwal23" target="_blank">
                {" "}
                <FaGithub />
              </Link>
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/mern-auth-joshi.appspot.com/o/AyushTheTester.jpg?alt=media&token=8b17d7fe-1878-4644-b97e-3165baa6c382"
              alt="Ayush Kumar"
              className="rounded-full w-36 h-36 object-cover"
            />
            <p>Ayush Kumar</p>
            <p>Software Tester</p>
            <p className="flex gap-2 text-2xl justify-between">
              <Link
                to="https://www.linkedin.com/in/ayush-kumar-548b17202/"
                target="_blank"
              >
                <FaLinkedin />
              </Link>
              <Link to="https://github.com/Ayushkumar1-2" target="_blank">
                {" "}
                <FaGithub />
              </Link>
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/mern-auth-joshi.appspot.com/o/1717139862814photo.jpeg?alt=media&token=bcba2c3c-5209-4708-98a3-f28552949b60"
              alt="Ankit Jeena"
              className="rounded-full w-36 h-36 object-cover"
            />
            <p>Ankit Jeena</p>
            <p>Front End Developer</p>
            <p className="flex gap-2 text-2xl justify-between">
              <Link
                to="https://www.linkedin.com/in/ankit-jeena-932501213/"
                target="_blank"
              >
                <FaLinkedin />
              </Link>
              <Link to="https://github.com/AnkitJeena" target="_blank">
                {" "}
                <FaGithub />
              </Link>
            </p>
          </div>
        </div>
      </div>

      {currentUser && currentUser.isStudent && (
        <>
          <div className="divider"></div>
          <CallToAction />
        </>
      )}

      <div className="max-w-6xl mx-auto flex flex-col gap-8 py-7">
        {jobs &&
          jobs.length > 0 &&
          (currentUser && currentUser.isEmployer ? (
            <></>
          ) : (
            <>
              <div className="divider my-10">
                {" "}
                <h1 className=" text-4xl font-extrabold dark:text-slate-400">
                  Recent Jobs
                </h1>
              </div>
              <div className="flex flex-col gap-6 p-3">
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
            </>
          ))}
      </div>
    </div>
  );
}
