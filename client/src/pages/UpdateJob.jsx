import {
  Alert,
  Button,
  FileInput,
  Label,
  Select,
  TextInput,
  Datepicker,
} from "flowbite-react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
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
import { useSelector } from "react-redux";

const UpdateJob = () => {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState(null);
  const [salaryType, setSalaryType] = useState("");
  const [publishError, setPublishError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { jobId } = useParams();
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/job/getjobs?jobId=${jobId}`);
        const data = await res.json();
        if (!res.ok) {
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data.jobs[0]);
          if (data.jobs[0].salary.fixed) {
            setSalaryType("fixed");
          } else {
            setSalaryType("range");
          }
        }
      } catch (error) {
        console.error("Error fetching job:", error);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image to upload");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, `${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Uplaod failed. Please try again later.");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadError(null);
            setImageUploadProgress(null);
            setFormData({ ...formData, companyLogo: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError(error.message);
      setImageUploadProgress(null);
      console.log(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `/api/job/updatejob/${formData._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        setLoading(false);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        setLoading(false);
        navigate(`/job/${data.slug}`);
      }
    } catch (error) {
      setLoading(false);
      setPublishError(error.message);
    }
  };

  if (!formData || loading) {
    return <div>Loading...</div>;
  }

  const {
    jobTitle,
    jobCategory,
    companyLogo,
    companyName,
    employmentType,
    jobDescription,
    location,
    jobLocation,
    salary,
    contactInfo,
    experienceLevel,
    educationRequirement,
    skillsRequired,
    applicationDeadline,
  } = formData;

  return (
    <div className=" mb-10 p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-4xl my-10 font-bold text-slate-600">
        UPDATE JOB
      </h1>
      {publishError && (
        <Alert className="my-5" color="failure">
          {publishError}
        </Alert>
      )}
      <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
        {/* <Label className="text-lg self-center font-bold text-slate-600">
            JOB DETAILS
          </Label> */}
        <div className="divider font-bold text-slate-600 divider-neutral dark:divider-default ">
          JOB DETAILS
        </div>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            placeholder="Enter the title of the job"
            type="text"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, jobTitle: e.target.value })
            }
            value={jobTitle || ""}
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, jobCategory: e.target.value })
            }
            className="flex-1"
            value={jobCategory || ""}
          >
            <option value="">Select Job Category</option>
            <option value="IT">IT</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
            <option value="HR">HR</option>
            <option value="Management">Management</option>
            <option value="Others">Others</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            id="companyLogo"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className=" w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Company Logo"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {companyLogo && (
          <img
            src={companyLogo}
            alt="Company Logo"
            className="w-full h-72 object-cover"
          />
        )}
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            placeholder="Enter the company name"
            type="text"
            required
            id="companyName"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, companyName: e.target.value })
            }
            value={companyName || ""}
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, employmentType: e.target.value })
            }
            className="flex-1"
            value={employmentType || ""}
          >
            <option value="">Select Employment Type</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Internship">Internship</option>
          </Select>
        </div>
        {/* <Label className="text-lg self-center font-bold text-slate-600">
            JOB DESCRIPTION
          </Label> */}
        <div className="divider font-bold text-slate-600 divider-neutral dark:divider-default ">
          JOB DESCRIPTION
        </div>
        <ReactQuill
          theme="snow"
          placeholder="Enter the description of the job"
          className="h-60 mb-12"
          required
          id="description"
          onChange={(value) =>
            setFormData({ ...formData, jobDescription: value })
          }
          value={jobDescription || ""}
        />
        {/* <Label className="text-lg self-center font-bold text-slate-600">
            JOB LOCATION
          </Label> */}
        <div className="divider font-bold text-slate-600 divider-neutral dark:divider-default ">
          JOB LOCATION
        </div>
        <TextInput
          placeholder="Enter the address"
          type="text"
          required
          id="address"
          onChange={(e) =>
            setFormData({
              ...formData,
              location: {
                ...formData.location,
                address: e.target.value,
              },
            })
          }
          value={location?.address || ""}
        />
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            placeholder="Enter the city"
            type="text"
            required
            id="city"
            className="flex-1"
            onChange={(e) =>
              setFormData({
                ...formData,
                location: {
                  ...formData.location,
                  city: e.target.value,
                },
              })
            }
            value={location?.city || ""}
          />
          <TextInput
            placeholder="Enter the state"
            type="text"
            required
            id="state"
            className="flex-1"
            onChange={(e) =>
              setFormData({
                ...formData,
                location: {
                  ...formData.location,
                  state: e.target.value,
                },
              })
            }
            value={location?.state || ""}
          />
          <TextInput
            placeholder="Enter the country"
            type="text"
            required
            id="country"
            className="flex-1"
            onChange={(e) =>
              setFormData({
                ...formData,
                location: {
                  ...formData.location,
                  country: e.target.value,
                },
              })
            }
            value={location?.country || ""}
          />
          <TextInput
            placeholder="Enter the postal code"
            type="text"
            id="postalCode"
            className="flex-1"
            onChange={(e) =>
              setFormData({
                ...formData,
                location: {
                  ...formData.location,
                  postalCode: e.target.value,
                },
              })
            }
            value={location?.postalCode || ""}
          />
        </div>
        {/* <Label className="text-lg self-center font-bold text-slate-600">
            SALARY & CONTACT INFO
          </Label> */}
        <div className="divider font-bold text-slate-600 divider-neutral dark:divider-default ">
          SALARY & CONTACT INFO
        </div>

        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <Select
            className="felx-1"
            onChange={(e) => setSalaryType(e.target.value)}
            value={salaryType || ""}
          >
            <option value="fixed">Fixed Salary</option>
            <option value="range">Salary Range</option>
          </Select>
          {salaryType === "fixed" && (
            <TextInput
              placeholder="Enter the fixed salary"
              type="number"
              required
              id="fixed"
              className="flex-1"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  salary: {
                    ...formData.salary,
                    fixed: e.target.value,
                  },
                })
              }
              value={salary?.fixed || ""}
            />
          )}
          {salaryType === "range" && (
            <div className="flex flex-1 gap-4 sm:flex-row justify-between">
              <TextInput
                placeholder="Enter the minimum salary"
                type="number"
                required
                id="min"
                className="flex-1"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    salary: {
                      ...formData.salary,
                      min: e.target.value,
                    },
                  })
                }
                value={salary?.min || ""}
              />
              <TextInput
                placeholder="Enter the maximum salary"
                type="number"
                required
                id="max"
                className="flex-1"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    salary: {
                      ...formData.salary,
                      max: e.target.value,
                    },
                  })
                }
                value={salary?.max || ""}
              />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            placeholder="Enter the email"
            type="email"
            required
            id="email"
            className="flex-1"
            onChange={(e) =>
              setFormData({
                ...formData,
                contactInfo: {
                  ...formData.contactInfo,
                  email: e.target.value,
                },
              })
            }
            value={contactInfo?.email || ""}
          />
          <TextInput
            placeholder="Enter the phone"
            type="tel"
            required
            id="phone"
            className="flex-1"
            onChange={(e) =>
              setFormData({
                ...formData,
                contactInfo: {
                  ...formData.contactInfo,
                  phone: e.target.value,
                },
              })
            }
            value={contactInfo?.phone || ""}
          />
          <TextInput
            placeholder="Enter the website"
            type="url"
            required
            id="website"
            className="flex-1"
            onChange={(e) =>
              setFormData({
                ...formData,
                contactInfo: {
                  ...formData.contactInfo,
                  website: e.target.value,
                },
              })
            }
            value={contactInfo?.website || ""}
          />
        </div>
        {/* <Label className="text-lg self-center font-bold text-slate-600">
            OTHER DETAILS
          </Label> */}
        <div className="divider font-bold text-slate-600 divider-neutral dark:divider-default ">
          OTHER DETAILS
        </div>
        <div className="flex flex-col gap-4 sm:flex-row justify-between items-end">
          <Select
            onChange={(e) => {
              setFormData({ ...formData, jobLocation: e.target.value });
            }}
            className="flex-1"
            value={jobLocation || ""}
          >
            <option value="">Select Job Location</option>
            <option value="Remote">Remote</option>
            <option value="Onsite">Onsite</option>
            <option value="Hybrid">Hybrid</option>
          </Select>
          <Select
            onChange={(e) =>
              setFormData({ ...formData, experienceLevel: e.target.value })
            }
            className="flex-1"
            value={experienceLevel || ""}
          >
            <option value="">Select Experience Level</option>
            <option value="Fresher">Fresher</option>
            <option value="1-2 years">1-2 years</option>
            <option value="3-5 years">3-5 years</option>
            <option value="6-10 years">6-10 years</option>
            <option value="10+ years">10+ years</option>
          </Select>
          <div className="flex-1">
            <Label className="text-sm self-center font-semibold text-slate-600 mx-1">
              APPLICATION DEADLINE
            </Label>
            <Datepicker
              id="applicationDeadline"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  applicationDeadline: e.target.value,
                })
              }
              value={applicationDeadline || ""}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            placeholder="Enter the education requirement"
            type="text"
            required
            id="educationRequirement"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, educationRequirement: e.target.value })
            }
            value={educationRequirement || ""}
          />
          <TextInput
            placeholder="Enter the skills required(comma separated)"
            type="text"
            required
            id="skillsRequired"
            className="flex-1"
            onChange={(e) =>
              setFormData({
                ...formData,
                skillsRequired: e.target.value
                  .split(",")
                  .map((skill) => skill.trim()),
              })
            }
            value={skillsRequired || ""}
          />
        </div>
        <Button type="submit" gradientDuoTone="purpleToBlue">
          Update
        </Button>
      </form>
    </div>
  );
};
export default UpdateJob;
