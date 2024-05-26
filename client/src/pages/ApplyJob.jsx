import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, FileInput, TextInput } from "flowbite-react";
import { useSelector } from "react-redux";
import { set } from "mongoose";

const ApplyJob = () => {
  const [file, setFile] = useState(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [fileURL, setFileURL] = useState(null);
  const [success, setSuccess] = useState(null);

  const { currentUser } = useSelector((state) => state.user);

  const { jobId } = useParams();

  const navigate = useNavigate();

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
            setFileURL(downloadURL);
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

  const handleSubmit = async (e) => {
    setPublishError(null);
    setSuccess(null);
    e.preventDefault();
    try {
      const res = await fetch(`/api/job/apply/${jobId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData,
          jobId: jobId,
          applicantId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        setSuccess(null);
        return;
      }
      if (res.ok) {
        setSuccess("Application submitted successfully");
        setTimeout(() => {
          navigate("/jobs");
        }, 2000);
      }
    } catch (error) {
      // setPublishError("Something went wrong. Please try again later.");
      setPublishError(error.message);
    }
  };

  return (
    <div className=" mb-10 p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-10 font-bold text-slate-600">
        APPLICATION FORM
      </h1>
      {publishError && (
        <Alert className="my-5" color="failure">
          {publishError}
        </Alert>
      )}
      {success && (
        <Alert className="my-5" color="success">
          {success}
        </Alert>
      )}
      <div className="">
        <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
          <TextInput
            type="text"
            placeholder="Full Name"
            id="applicantName"
            required
            onChange={(e) =>
              setFormData({ ...formData, applicantName: e.target.value })
            }
          />
          <TextInput
            type="email"
            placeholder="Email"
            id="applicantEmail"
            required
            onChange={(e) =>
              setFormData({ ...formData, applicantEmail: e.target.value })
            }
          />
          <TextInput
            type="text"
            placeholder="Phone"
            id="applicantPhone"
            required
            onChange={(e) =>
              setFormData({ ...formData, applicantPhone: e.target.value })
            }
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
          {formData.applicantResume && uploadSuccess && (
            <>
              <Alert color="success" className="">
                Resume uploaded successfully
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
              setFormData({ ...formData, applicantCoverLetter: e.target.value })
            }
          />
          <Button
            type="submit"
            gradientDuoTone="purpleToBlue"
            className="font-semibold"
          >
            Apply
          </Button>
        </form>
      </div>
    </div>
  );
};
export default ApplyJob;
