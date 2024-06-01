import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Footer from "./components/Footer";
import AdminRoute from "./components/AdminRoute";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";
import CreateJob from "./pages/CreateJob";
import ScrollTop from "./components/ScrollToTop";
import Search from "./pages/Search";
import JobPage from "./pages/JobPage";
import UpdateJob from "./pages/UpdateJob";
import ApplyJob from "./pages/ApplyJob";
import PageNotFound from "./pages/PageNotFound";
import { useState } from "react";
import AppliedJobs from "./pages/AppliedJobs";
import Help from "./pages/Help";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <ScrollTop />
      {/* Add a navigation bar here */}
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/search" element={<Search />} />
        <Route path="/help" element={<Help />} />
        <Route path="/post/:postSlug" element={<PostPage />} />
        <Route path="/job/:jobSlug" element={<JobPage />} />
        <Route path="/apply/:jobId" element={<ApplyJob />} />
        <Route path="/applied-jobs" element={<AppliedJobs />} />
        <Route path="*" element={<PageNotFound />} />
        <Route element={<PrivateRoute />}>
          <Route
            path="/dashboard"
            element={
              <Dashboard
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />
        </Route>
        <Route element={<AdminRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/create-job" element={<CreateJob />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
          <Route path="/update-job/:jobId" element={<UpdateJob />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
export default App;
