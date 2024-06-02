import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";
import { Alert, Button, Label, TextInput } from "flowbite-react";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill in all the fields"));
    }
    try {
      dispatch(signInStart());
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      if (response.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className=" min-h-screen-[30vh] my-20 px-3">
      <div className=" flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-20">
        {/** left side */}
        <div className="flex-1">
          <div className="mb-5">
            <h1 className="text-3xl text-slate-500 font-bold">SIGN IN</h1>
            <p className="text-slate-600">
              Welcome back! Sign in to continue your journey towards landing
              your dream job through our college placement portal.
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
            Unlock your potential. Start your professional journey with our
            college placement portal.
          </p>
        </div>
        {/** right side */}
        <div className=" flex-1">
          {errorMessage && (
            <Alert className="mb-5" color="failure">
              {errorMessage}
            </Alert>
          )}
          <form onSubmit={handleSubmit} className=" flex flex-col gap-4">
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
              {loading ? "Loading..." : "Sign In"}
            </Button>
            <div className="divider">OR</div>
            <OAuth />
          </form>
          <div className=" flex gap-2 text-sm mt-5">
            <span className="">Don&apos;t have an account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignIn;
