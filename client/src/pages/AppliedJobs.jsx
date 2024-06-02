import { Alert, Button, Select, Spinner } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import JobCard from "../components/JobCard";
import { Drawer } from "flowbite-react";
import { FaFilter } from "react-icons/fa";
import { useSelector } from "react-redux";

const AppliedJobs = () => {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "",
    jobCategory: "",
    employementType: "",
    jobLocation: "",
    experienceLevel: "",
  });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const urlParams = new URLSearchParams(location.search);
  const searchTermFromUrl = urlParams.get("searchTerm");
  const sortFromUrl = urlParams.get("sort");
  const categoryFromUrl = urlParams.get("jobCategory");
  const employementTypeFromUrl = urlParams.get("employmentType");
  const locationFromUrl = urlParams.get("jobLocation");
  const experienceLevelFromUrl = urlParams.get("experienceLevel");
  if (
    searchTermFromUrl ||
    sortFromUrl ||
    categoryFromUrl ||
    employementTypeFromUrl ||
    locationFromUrl ||
    experienceLevelFromUrl
  ) {
    setSidebarData({
      ...sidebarData,
      searchTerm: searchTermFromUrl,
      sort: sortFromUrl,
      jobCategory: categoryFromUrl,
      employmentType: employementTypeFromUrl,
      jobLocation: locationFromUrl,
      experienceLevel: experienceLevelFromUrl,
    });
  }
  const fetchJobsSearch = async () => {
    setLoading(true);
    const searchQuery = urlParams.toString();
    const res = await fetch(
      `/api/job/appliedjobs/${currentUser._id}?${searchQuery}`
    );
    if (!res.ok) {
      setLoading(false);
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setJobs(data.jobs);
      setLoading(false);
      if (data.jobs.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await fetch(`/api/job/appliedjobs/${currentUser._id}`);
      const data = await res.json();
      setJobs(data);
      console.log(jobs);
    };
    fetchJobs();
  }, [currentUser._id]);

  const handleChange = useCallback(
    (e) => {
      if (e.target.id === "searchTerm") {
        setSidebarData({ ...sidebarData, searchTerm: e.target.value });
      }
      if (e.target.id === "sort") {
        const order = e.target.value || "";
        setSidebarData({ ...sidebarData, sort: order });
      }
      if (e.target.id === "jobCategory") {
        const jobCategory = e.target.value || "";
        setSidebarData({ ...sidebarData, jobCategory: jobCategory });
      }
      if (e.target.id === "employementType") {
        const employmentType = e.target.value || "";
        setSidebarData({ ...sidebarData, employmentType: employmentType });
      }
      if (e.target.id === "jobLocation") {
        const jobLocation = e.target.value || "";
        setSidebarData({ ...sidebarData, jobLocation: jobLocation });
      }
      if (e.target.id === "experienceLevel") {
        const experienceLevel = e.target.value || "";
        setSidebarData({ ...sidebarData, experienceLevel: experienceLevel });
      }
    },
    [sidebarData]
  );

  const handleSubmit = (e) => {
    fetchJobsSearch();
    setIsOpen(false);
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    if (
      sidebarData.searchTerm === null ||
      sidebarData.searchTerm === undefined
    ) {
      urlParams.delete("searchTerm");
    } else {
      urlParams.set("searchTerm", sidebarData.searchTerm);
    }
    if (
      sidebarData.sort === "" ||
      sidebarData.sort === null ||
      sidebarData.sort === undefined
    ) {
      urlParams.delete("sort");
    } else {
      urlParams.set("sort", sidebarData.sort);
    }
    if (
      sidebarData.jobCategory === "" ||
      sidebarData.jobCategory === null ||
      sidebarData.jobCategory === undefined
    ) {
      urlParams.delete("jobCategory");
    } else {
      urlParams.set("jobCategory", sidebarData.jobCategory);
    }
    if (
      sidebarData.employmentType === "" ||
      sidebarData.employmentType === null ||
      sidebarData.employmentType === undefined
    ) {
      urlParams.delete("employmentType");
    } else {
      urlParams.set("employmentType", sidebarData.employmentType);
    }
    if (
      sidebarData.jobLocation === "" ||
      sidebarData.jobLocation === null ||
      sidebarData.jobLocation === undefined
    ) {
      urlParams.delete("jobLocation");
    } else {
      urlParams.set("jobLocation", sidebarData.jobLocation);
    }
    if (
      sidebarData.experienceLevel === "" ||
      sidebarData.experienceLevel === null ||
      sidebarData.experienceLevel === undefined
    ) {
      urlParams.delete("experienceLevel");
    } else {
      urlParams.set("experienceLevel", sidebarData.experienceLevel);
    }

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfJobs = jobs.length;
    const startIndex = numberOfJobs;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/job/getjobs?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setJobs([...jobs, ...data.jobs]);
      if (data.jobs.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  const handleResetFilters = () => {
    setSidebarData({
      searchTerm: "",
      sort: "",
      jobCategory: "",
      employmentType: "",
      jobLocation: "",
      experienceLevel: "",
    });
    navigate("/search");
  };

  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <>
      <div className="flex flex-col md:flex-row px-3 min-h-screen">
        {/* <Drawer open={isOpen} position="bottom" onClose={handleClose}>
        <Drawer.Header title="Filters" titleIcon={FaFilter} />
        <Drawer.Items>
          <form
            className="flex flex-col gap-8 my-5 md:mx-auto max-w-7xl"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-6 gap-4">
              <label className="whitespace-nowrap font-semibold md:col-span-2 col-span-5">
                Sort By
              </label>
              <p className="hidden md:block">:</p>
              <Select
                id="sort"
                name="sort"
                onChange={handleChange}
                value={sidebarData.sort}
                className="w-full md:col-span-3 col-span-6"
              >
                <option value="">Select Order</option>
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </Select>
            </div>
            <div className="grid grid-cols-6 gap-4">
              <label className="whitespace-nowrap font-semibold md:col-span-2 col-span-5">
                Category
              </label>
              <p className="hidden md:block">:</p>
              <Select
                id="jobCategory"
                name="jobCategory"
                onChange={handleChange}
                value={sidebarData.jobCategory}
                className="w-full md:col-span-3 col-span-6"
              >
                <option value="">Select Category</option>
                <option value="IT">IT</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="HR">HR</option>
              </Select>
            </div>
            <div className="grid grid-cols-6 gap-4">
              <label className="whitespace-nowrap font-semibold md:col-span-2 col-span-5">
                Employement Type
              </label>
              <p className="hidden md:block">:</p>
              <Select
                id="employementType"
                name="employementType"
                onChange={handleChange}
                value={sidebarData.employmentType}
                className="w-full md:col-span-3 col-span-6"
              >
                <option value="">Select Employement Type</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Internship">Internship</option>
              </Select>
            </div>
            <div className="grid grid-cols-6 gap-4">
              <label className="whitespace-nowrap font-semibold md:col-span-2 col-span-5">
                Location
              </label>
              <p className="hidden md:block">:</p>
              <Select
                id="jobLocation"
                name="jobLocation"
                onChange={handleChange}
                value={sidebarData.jobLocation}
                className="w-full md:col-span-3 col-span-6"
              >
                <option value="">Select Location</option>
                <option value="Remote">Remote</option>
                <option value="Onsite">Onsite</option>
                <option value="Hybrid">Hybrid</option>
              </Select>
            </div>
            <div className="grid grid-cols-6 gap-4">
              <label className="whitespace-nowrap font-semibold md:col-span-2 col-span-5">
                Experience Level
              </label>
              <p className="hidden md:block">:</p>
              <Select
                id="experienceLevel"
                name="experienceLevel"
                onChange={handleChange}
                value={sidebarData.experienceLevel}
                className="w-full md:col-span-3 col-span-6"
              >
                <option value="">Select Experience Level</option>
                <option value="Fresher">Fresher</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
              </Select>
            </div>
            <div className="flex flex-row gap-8">
              <Button
                type="submit"
                outline
                gradientDuoTone="purpleToBlue"
                pill
                className="flex-1"
              >
                Apply
              </Button>
              <Button
                type="button"
                outline
                gradientDuoTone="purpleToBlue"
                pill
                onClick={handleResetFilters}
                className="flex-1"
              >
                Reset
              </Button>
            </div>
          </form>
        </Drawer.Items>
      </Drawer> */}

        <div className="w-full">
          {loading && (
            <div className="flex justify-center items-center min-h-screen">
              <Spinner size="xl" />
            </div>
          )}
          {/* <div className="flex items-center gap-3 border-b border-gray-500 ps-5 pb-5 my-5">
          {/* <h1 className=" text-lg font-bold  text-slate-700 dark:text-slate-200">
            JOB RESULTS
          </h1>
          <Button
            onClick={() => setIsOpen(true)}
            outline
            size="sm"
            pill
            color="light"
          >
            <FaFilter />
          </Button> 
        </div> */}
          <div className="p-7 flex flex-wrap gap-8 justify-center">
            {!loading && jobs.length === 0 && (
              <p className=" text-xl text-gray-500">No jobs found</p>
            )}
            {loading && <p className=" text-xl text-gray-500">Loading...</p>}
            {!loading &&
              jobs &&
              jobs.map((job) => <JobCard job={job} key={job._id} />)}
            {showMore && (
              <button
                className="text-teal-500 text-lg hover:underline p-7 w-full"
                onClick={handleShowMore}
              >
                Show More
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default AppliedJobs;
