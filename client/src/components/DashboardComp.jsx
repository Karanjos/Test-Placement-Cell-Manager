import { Badge, Button, Select, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaBriefcase, FaUserCheck } from "react-icons/fa";
import {
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const DashboardComp = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [lastMonthJobs, setLastMonthJobs] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  const [applications, setApplications] = useState([]);
  const [totalApplications, setTotalApplications] = useState(0);
  const [lastMonthApplications, setLastMonthApplications] = useState(0);
  const [placedStudents, setPlacedStudents] = useState([]);
  const [totalPlacedStudents, setTotalPlacedStudents] = useState(0);
  const [lastMonthPlacedStudents, setLastMonthPlacedStudents] = useState(0);

  useEffect(() => {
    const ftechUsers = async () => {
      try {
        const res = await fetch("/api/user/getusers?limit=5");
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/job/getjobs?limit=5");
        const data = await res.json();
        if (res.ok) {
          setJobs(data.jobs);
          setTotalJobs(data.totalJobs);
          setLastMonthJobs(data.lastMonthJobs);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchApplications = async () => {
      try {
        const res = await fetch("/api/application/getapplications?limit=5");
        const data = await res.json();
        if (res.ok) {
          setApplications(data.applications);
          setTotalApplications(data.totalApplications);
          setLastMonthApplications(data.lastMonthApplications);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchPlacedStudents = async () => {
      try {
        const res = await fetch("/api/application/placedstudents?limit=5");

        if (res.ok) {
          const data = await res.json();

          setPlacedStudents(data.placementRecords);
          setTotalPlacedStudents(data.totalPlacedStudents);

          setLastMonthPlacedStudents(data.lastMonthPlacements);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchApplicationsByEmployer = async () => {
      try {
        const res = await fetch(
          `/api/application/getapplications?${currentUser._id}&limit=5`
        );
        const data = await res.json();
        if (res.ok) {
          setApplications(data.applications);
          setTotalApplications(data.totalApplications);
          setLastMonthApplications(data.lastMonthApplications);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser && currentUser.isEmployer) {
      fetchApplicationsByEmployer();
    }

    if (currentUser.isAdmin) {
      ftechUsers();
      fetchJobs();
      fetchApplications();
      fetchPlacedStudents();
    }
  }, [currentUser]);

  return (
    <div className="p-3 md:mx-auto py-10">
      <div className="flex-wrap flex gap-4 justify-center">
        {currentUser.isAdmin && (
          <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
            <div className="flex justify-between">
              <div className="">
                <h3 className=" text-gray-500 text-md uppercase">
                  Total Users
                </h3>
                <p>{totalUsers}</p>
              </div>
              <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex gap-2 text-sm">
              <span className=" text-green-500 flex items-center">
                <HiArrowNarrowUp />
                {lastMonthUsers}
              </span>
              <div className=" text-gray-500">Last month</div>
            </div>
          </div>
        )}
        {currentUser.isAdmin && (
          <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
            <div className="flex justify-between">
              <div className="">
                <h3 className=" text-gray-500 text-md uppercase">Total Jobs</h3>
                <p>{totalJobs}</p>
              </div>
              <FaBriefcase className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />{" "}
            </div>
            <div className="flex gap-2 text-sm">
              <span className=" text-green-500 flex items-center">
                <HiArrowNarrowUp />
                {lastMonthJobs}
              </span>
              <div className=" text-gray-500">Last month</div>
            </div>
          </div>
        )}
        {currentUser.isAdmin && (
          <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
            <div className="flex justify-between">
              <div className="">
                <h3 className=" text-gray-500 text-md uppercase">
                  Total Placed Students
                </h3>
                <p>{totalPlacedStudents}</p>
              </div>
              <FaUserCheck className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex gap-2 text-sm">
              <span className=" text-green-500 flex items-center">
                <HiArrowNarrowUp />
                {lastMonthPlacedStudents}
              </span>
              <div className=" text-gray-500">Last month</div>
            </div>
          </div>
        )}

        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className=" text-gray-500 text-md uppercase">
                Total Applications
              </h3>
              <p>{totalApplications}</p>
            </div>
            <HiDocumentText className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className=" text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthApplications}
            </span>
            <div className=" text-gray-500">Last month</div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center mt-5">
        {currentUser.isAdmin && (
          <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
            <div className="flex justify-between p-3 text-sm font-semibold">
              <h1 className=" text-center p-2">Recent Users</h1>
              <Link to="/dashboard?tab=users">
                <Button type="button" gradientDuoTone="purpleToBlue" outline>
                  View All
                </Button>
              </Link>
            </div>
            <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>User image</Table.HeadCell>
                  <Table.HeadCell>Email</Table.HeadCell>
                  <Table.HeadCell>Username</Table.HeadCell>
                </Table.Head>
                <Table.Body className=" divide-y">
                  {users &&
                    users.map((user) => (
                      <Table.Row
                        key={user._id}
                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      >
                        <Table.Cell>
                          <img
                            src={user.profilePicture}
                            alt={user.username}
                            className="w-10 h-10 rounded-full bg-gray-500"
                          />
                        </Table.Cell>
                        <Table.Cell>{user.email}</Table.Cell>
                        <Table.Cell>{user.username}</Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
              </Table>
            </div>
          </div>
        )}
        {currentUser.isAdmin && (
          <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
            <div className="flex justify-between p-3 text-sm font-semibold">
              <h1 className=" text-center p-2">Recent Jobs</h1>
              <Link to="/dashboard?tab=jobs">
                <Button type="button" gradientDuoTone="purpleToBlue" outline>
                  View All
                </Button>
              </Link>
            </div>
            <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Job Title</Table.HeadCell>
                  <Table.HeadCell>Company</Table.HeadCell>
                  <Table.HeadCell>Category</Table.HeadCell>
                </Table.Head>
                <Table.Body className=" divide-y">
                  {jobs &&
                    jobs.map((job) => (
                      <Table.Row
                        key={job._id}
                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      >
                        <Table.Cell>{job.jobTitle}</Table.Cell>
                        <Table.Cell>{job.companyName}</Table.Cell>
                        <Table.Cell>{job.jobCategory}</Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
              </Table>
            </div>
          </div>
        )}
        {currentUser.isAdmin && (
          <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
            <div className="flex justify-between p-3 text-sm font-semibold">
              <h1 className=" text-center p-2">Recent Placed Students</h1>
              <Link to="/dashboard?tab=placedStudent">
                <Button type="button" gradientDuoTone="purpleToBlue" outline>
                  View All
                </Button>
              </Link>
            </div>
            <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Student Name</Table.HeadCell>
                  <Table.HeadCell>Student Email</Table.HeadCell>
                  <Table.HeadCell>Company Name</Table.HeadCell>
                  <Table.HeadCell>Job Title</Table.HeadCell>
                </Table.Head>
                <Table.Body className=" divide-y">
                  {placedStudents &&
                    placedStudents.map((placedStudent) => (
                      <Table.Row
                        key={placedStudent.applicantId}
                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      >
                        <Table.Cell>{placedStudent.applicantName}</Table.Cell>
                        <Table.Cell>{placedStudent.applicantEmail}</Table.Cell>
                        <Table.Cell>{placedStudent.companyName}</Table.Cell>
                        <Table.Cell>{placedStudent.jobTitle}</Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
              </Table>
            </div>
          </div>
        )}
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className=" text-center p-2">Recent Applications</h1>
            <Link to="/dashboard?tab=applications">
              <Button type="button" gradientDuoTone="purpleToBlue" outline>
                View All
              </Button>
            </Link>
          </div>
          <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
            <Table hoverable className="shadow-md w-full">
              <Table.Head>
                <Table.HeadCell>Student Name</Table.HeadCell>
                <Table.HeadCell>Student Email</Table.HeadCell>
                <Table.HeadCell>Job Title</Table.HeadCell>
                <Table.HeadCell>Company Name</Table.HeadCell>
                <Table.HeadCell>Application Status</Table.HeadCell>
              </Table.Head>
              {applications.map((application) => (
                <Table.Body className="divide-y" key={application._id}>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      {application.application.applicantName}
                    </Table.Cell>
                    <Table.Cell>
                      {application.application.applicantEmail}
                    </Table.Cell>
                    <Table.Cell>{application.job.jobTitle}</Table.Cell>
                    <Table.Cell>{application.job.companyName}</Table.Cell>

                    <Table.Cell>
                      {application.application.applicationStatus ===
                      "pending" ? (
                        <Badge color="yellow" className="w-auto">
                          Pending
                        </Badge>
                      ) : application.application.applicationStatus ===
                        "Rejected" ? (
                        <Badge color="red" className="w-auto">
                          Rejected
                        </Badge>
                      ) : application.application.applicationStatus ===
                        "Accepted" ? (
                        <Badge color="green" className="text-auto">
                          Accepted
                        </Badge>
                      ) : (
                        <></>
                      )}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardComp;
