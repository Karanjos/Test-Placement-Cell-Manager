import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashUsers from "../components/DashUsers";
import DashComment from "../components/DashComments";
import DashboardComp from "../components/DashboardComp";
import DashJobs from "../components/DashJobs";

const Dashboard = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParam = new URLSearchParams(location.search);
    const tabFromUrl = urlParam.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row ">
      {/**Sidebar */}
      {/* {sidebarOpen && ( */}
      <div>
        <DashSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>
      {/* )} */}
      {/** Profile */}
      {tab === "profile" && <DashProfile />}
      {/** Posts */}
      {tab === "jobs" && <DashJobs />}
      {/** Users */}
      {tab === "users" && <DashUsers />}
      {/** Comment */}
      {tab === "comments" && <DashComment />}
      {/** Dashboard component */}
      {tab === "dash" && <DashboardComp />}
      {/** Applications */}
      {tab === "applications" && <h1>Applications</h1>}
      {/** Placed Students */}
      {tab === "placedStudent" && <h1>Placed Students</h1>}
    </div>
  );
};
export default Dashboard;
