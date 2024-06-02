import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { Button, Label, TextInput } from "flowbite-react";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setError("Please fill in all the fields");
    }
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success === false) {
        setError(data.message);
        return;
      }
      setLoading(false);
      if (response.ok) {
        navigate("/sign-in");
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className=" min-h-screen-[30vh] my-20">
      <div className=" flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/** lest side */}
        <div className="flex-1">
          <div className="mb-5">
            <h1 className="text-3xl text-slate-500 font-bold">SIGN UP</h1>
            <p className="text-slate-600">
              Create your account. Step into the world of opportunities with our
              college placement portal.
            </p>
          </div>
          <div className="w-40">
            <h1 className="font-bold dark:text-white text-4xl">
              <span className="px-4 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-lg text-white">
                PLACEMENT PORTAL
              </span>
            </h1>
          </div>
          <p className="text-sm mt-5 text-slate-600">
            Begin your journey to success. Sign up and unlock countless
            opportunities with our college placement portal.
          </p>
        </div>
        {/** right side */}
        <div className=" flex-1">
          <form onSubmit={handleSubmit} className=" flex flex-col gap-4">
            <div className="">
              <Label value="Username" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange}
              />
            </div>
            <div className="">
              <Label value="Email" />
              <TextInput
                type="email"
                placeholder="any@mail.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div className="">
              <Label value="Password" />
              <TextInput
                type="password"
                placeholder="********"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone="purpleToBlue"
              onClick={handleSubmit}
              type="submit"
            >
              {loading ? "Loading..." : "Sign Up"}
            </Button>
            <div className="divider">OR</div>
            <OAuth />
          </form>
          <div className=" flex gap-2 text-sm mt-5">
            <span className="">Already have an account?</span>
            <Link to="/sign-in" className="text-blue-500">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignUp;
