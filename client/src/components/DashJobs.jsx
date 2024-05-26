import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const DashJobs = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userJobs, setUserJobs] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [jobIdToDelete, setJobIdToDelete] = useState("");
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/job/getjobs?postedBy=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserJobs(data.jobs);
          if (data.jobs.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser.isAdmin) fetchPosts();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userJobs.length;
    try {
      const res = await fetch(
        `/api/post/getPosts?postedBy=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserJobs([...userJobs, ...data.Jobs]);
        if (data.jobs.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteJob = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/job/deletejob/${jobIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setUserJobs(userJobs.filter((post) => post._id !== jobIdToDelete));
      } else {
        setUserJobs((prev) => prev.filter((job) => job._id !== jobIdToDelete));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-track-slate-500">
      {currentUser.isAdmin && userJobs.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>date updated</Table.HeadCell>
              <Table.HeadCell>Company Logo</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userJobs.map((job) => (
              <Table.Body key={job._id} className="divide-y">
                <Table.Row className=" bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(job.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/job/${job.slug}`}>
                      <img
                        src={job.companyLogo}
                        alt={job.jobTitle}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="font-medium text-gray-900 dark:text-white"
                      to={`/post/${job.slug}`}
                    >
                      {job.jobTitle}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{job.jobCategory}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setJobIdToDelete(job._id);
                      }}
                      className=" font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`/update-job/${job._id}`}
                      className=" text-teal-500 hover:underline"
                    >
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-teal-500 w-full self-center text-sm py-7"
            >
              show more
            </button>
          )}
        </>
      ) : (
        <p>you have no job yet</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-red-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this job?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteJob}>
                Yes, I&apos;m sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default DashJobs;
