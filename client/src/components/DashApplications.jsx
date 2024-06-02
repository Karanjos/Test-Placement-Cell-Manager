import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Alert,
  Button,
  FileInput,
  Modal,
  Select,
  Spinner,
  Table,
  TextInput,
} from "flowbite-react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const DashApplications = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [applications, setApplications] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [applicationIdToDelete, setApplicationIdToDelete] = useState("");
  const [applicantId, setApplicantId] = useState("");
  const [employerId, setEmployerId] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState(null);
  const [file, setFile] = useState(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [applicationStatuses, setApplicationStatuses] = useState(
    applications.reduce((acc, application) => {
      acc[application.application._id] =
        application.application.applicationStatus;
      return acc;
    }, {})
  );
  const [statusError, setStatusError] = useState("");
  const [statusSuccess, setStatusSuccess] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        let res;
        if (currentUser.isAdmin) {
          res = await fetch(
            `/api/application/getapplications?postedBy=${currentUser._id}`
          );
        }
        if (currentUser.isEmployer) {
          res = await fetch(
            `/api/application/getapplications?employerId=${currentUser._id}`
          );
        }
        const data = await res.json();
        if (res.ok) {
          setApplications(data.applications);
          setApplicationStatuses(
            data.applications.reduce((acc, application) => {
              acc[application.application._id] =
                application.application.applicationStatus;
              return acc;
            }, {})
          );
          if (data.applications.length < 9) {
            setShowMore(false);
          }
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    if (currentUser.isEmployer || currentUser.isAdmin) fetchApplications();
  }, [currentUser._id]);

  const handleEditApplication = async (applicationId) => {
    setShowEditModal(true);
    try {
      const res = await fetch(
        `/api/application/getapplications/${applicationId}`
      );
      const data = await res.json();
      if (res.ok) {
        setFormData(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleShowApplication = async (applicationId) => {
    setShowViewModal(true);
    try {
      const res = await fetch(
        `/api/application/getapplications/${applicationId}`
      );
      const data = await res.json();
      if (res.ok) {
        setFormData(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteApplication = async () => {
    try {
      const res = await fetch(
        `/api/application/delete/${applicationIdToDelete}/${applicantId}/${employerId}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setApplications((prev) =>
          prev.filter(
            (application) =>
              application.application._id !== applicationIdToDelete
          )
        );
        setShowDeleteModal(false);
      } else {
        setShowDeleteModal(false);
        console.log(data.message);
      }
    } catch (error) {
      setShowDeleteModal(false);
      console.log(error);
    }
  };

  const handleShowMore = async () => {
    const startIndex = applications.length;
    try {
      const res = await fetch(
        `/api/application/getapplications?postedBy=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setApplications((prev) => [...prev, ...data.applications]);
        if (data.applications.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUploadFile = async () => {
    setFileUploadProgress(null);
    setUploadSuccess(false);
    try {
      if (!file) {
        setFileUploadError("Please select a file to upload");
        return;
      }
      setFileUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, `${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFileUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setFileUploadError(error.message);
          setFileUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFileUploadError(null);
            setFileUploadProgress(null);
            setUploadSuccess(true);
            setFormData({ ...formData, applicantResume: downloadURL });
          });
        }
      );
    } catch (error) {
      setFileUploadError(error.message);
      setFileUploadProgress(null);
      setUploadSuccess(false);
      console.log(error.message);
    }
  };

  const handleChangeStatus = async (
    status,
    applicationId,
    jobId,
    applicantId,
    employerId
  ) => {
    setApplicationStatuses((prevStatuses) => ({
      ...prevStatuses,
      [applicationId]: status,
    }));
    setStatusError("");
    setStatusSuccess("");
    try {
      const res = await fetch(
        `/api/application/updatestatus/${applicantId}/${applicationId}/${jobId}/${employerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ applicationStatus: status }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setApplications((prev) =>
          prev.map((application) =>
            application._id === applicationId ? data : application
          )
        );
        setStatusSuccess("Application status updated successfully");
      } else {
        setStatusError(data.message);
        console.log(data.message);
        setStatusSuccess("");
      }
    } catch (error) {
      setStatusError(error.message);
      console.log(error);
      setStatusSuccess("");
    }
  };

  const handleSubmitEditApplication = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/application/update/${formData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setApplications((prev) =>
          prev.map((application) =>
            application._id === formData._id ? data : application
          )
        );
        setShowEditModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="m-auto">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 mt-5">
      {(currentUser.isAdmin || currentUser.isEmployer) &&
      applications.length > 0 ? (
        <>
          <div className="">
            {/* <div className="flex justify-end gap-5 m-2">
              <form>
                <TextInput placeholder="Search" />
              </form>
            </div> */}
            {statusError && (
              <Alert
                color="failure"
                onDismiss={() => setStatusError("")}
                className="mb-5"
              >
                {statusError}
              </Alert>
            )}
            {statusSuccess && (
              <Alert
                color="success"
                onDismiss={() => setStatusSuccess("")}
                className="mb-5"
              >
                {statusSuccess}
              </Alert>
            )}
          </div>
          <Table hoverable className="shadow-md w-full">
            <Table.Head>
              <Table.HeadCell>Student Name</Table.HeadCell>
              <Table.HeadCell>Student Email</Table.HeadCell>
              <Table.HeadCell>Job Title</Table.HeadCell>
              <Table.HeadCell>Company Name</Table.HeadCell>
              <Table.HeadCell>Application Status</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
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
                    <Select
                      className="w-full"
                      onChange={(e) =>
                        handleChangeStatus(
                          e.target.value,
                          application.application._id,
                          application.application.jobId,
                          application.application.applicantId,
                          application.application.employerId
                        )
                      }
                      value={applicationStatuses[application.application._id]}
                    >
                      <option value="Accepted">Accept</option>
                      <option value="Rejected">Reject</option>
                    </Select>
                  </Table.Cell>
                  <Table.Cell>
                    {/** edit and delete buttons and view appliations */}
                    <div className="flex gap-2">
                      <Button
                        size="xs"
                        pill
                        color="blue"
                        onClick={() =>
                          handleShowApplication(application.application._id)
                        }
                      >
                        <FaEye />
                      </Button>
                      <Button
                        size="xs"
                        pill
                        color="green"
                        onClick={() =>
                          handleEditApplication(application.application._id)
                        }
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        size="xs"
                        pill
                        color="red"
                        onClick={() => {
                          setShowDeleteModal(true);
                          setApplicantId(application.application.applicantId);
                          setEmployerId(application.application.employerId);
                          setApplicationIdToDelete(application.application._id);
                        }}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <div className="text-center">No applications found</div>
      )}
      <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteApplication}>
                Yes, I&apos;m sure
              </Button>
              <Button color="gray" onClick={() => setShowDeleteModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
        }}
        popup
        size="lg"
      >
        <Modal.Header />
        <Modal.Body>
          <form
            className="flex flex-col gap-10"
            onSubmit={handleSubmitEditApplication}
          >
            <TextInput
              type="text"
              placeholder="Full Name"
              id="applicantName"
              required
              onChange={(e) =>
                setFormData({ ...formData, applicantName: e.target.value })
              }
              value={formData?.applicantName}
            />
            <TextInput
              type="email"
              placeholder="Email"
              id="applicantEmail"
              required
              onChange={(e) =>
                setFormData({ ...formData, applicantEmail: e.target.value })
              }
              value={formData?.applicantEmail}
            />
            <TextInput
              type="text"
              placeholder="Phone"
              id="applicantPhone"
              required
              onChange={(e) =>
                setFormData({ ...formData, applicantPhone: e.target.value })
              }
              value={formData?.applicantPhone}
            />
            <div className="flex gap-4 items-center justify-between border-4 border-teal-600 border-dotted p-3">
              <FileInput
                type="file"
                id="applicantResume"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <Button
                type="button"
                gradientDuoTone="purpleToBlue"
                size="sm"
                outline
                onClick={handleUploadFile}
                disabled={fileUploadProgress}
              >
                {fileUploadProgress ? (
                  <div className="w-16 h-16">
                    <CircularProgressbar
                      value={fileUploadProgress}
                      text={`${fileUploadProgress || 0}%`}
                    />
                  </div>
                ) : (
                  <span>Upload Resume</span>
                )}
              </Button>
            </div>
            {fileUploadError && (
              <Alert color="failure" className="my-5">
                {fileUploadError}
              </Alert>
            )}
            {formData?.applicantResume && (
              <>
                <Alert color="success" className="">
                  Uploaded Resume
                  <a
                    href={formData.applicantResume}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 ms-3"
                  >
                    View Resume
                  </a>
                </Alert>
              </>
            )}
            <TextInput
              type="text"
              placeholder="Cover Letter"
              id="applicantCoverLetter"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  applicantCoverLetter: e.target.value,
                })
              }
              value={formData?.applicantCoverLetter}
            />
            <Button
              type="submit"
              gradientDuoTone="purpleToBlue"
              className="font-semibold"
            >
              Update
            </Button>
          </form>
        </Modal.Body>
      </Modal>
      {/** view application */}
      <Modal
        show={showViewModal}
        onClose={() => setShowViewModal(false)}
        popup
        size="lg"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="flex flex-col gap-10">
            <TextInput
              type="text"
              placeholder="Full Name"
              id="applicantName"
              required
              onChange={(e) =>
                setFormData({ ...formData, applicantName: e.target.value })
              }
              value={formData?.applicantName}
              readOnly
            />
            <TextInput
              type="email"
              placeholder="Email"
              id="applicantEmail"
              required
              onChange={(e) =>
                setFormData({ ...formData, applicantEmail: e.target.value })
              }
              value={formData?.applicantEmail}
              readOnly
            />
            <TextInput
              type="text"
              placeholder="Phone"
              id="applicantPhone"
              required
              onChange={(e) =>
                setFormData({ ...formData, applicantPhone: e.target.value })
              }
              value={formData?.applicantPhone}
              readOnly
            />
            {formData?.applicantResume && (
              <>
                <Alert color="success" className="">
                  Uploaded Resume
                  <a
                    href={formData.applicantResume}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 ms-3"
                  >
                    View Resume
                  </a>
                </Alert>
              </>
            )}
            <TextInput
              type="text"
              placeholder="Cover Letter"
              id="applicantCoverLetter"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  applicantCoverLetter: e.target.value,
                })
              }
              value={formData?.applicantCoverLetter}
              readOnly
            />
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default DashApplications;
