import { Drawer, Sidebar } from "flowbite-react";
import {
  HiArrowSmRight,
  HiChartPie,
  HiOutlineUserGroup,
  HiUsers,
} from "react-icons/hi";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { FaBriefcase, FaRegComments } from "react-icons/fa";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { current } from "@reduxjs/toolkit";

const DashSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/auth/signout", {
        method: "GET",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const urlParam = new URLSearchParams(location.search);
    const tabFromUrl = urlParam.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleClose = () => setSidebarOpen(!sidebarOpen);

  return (
    <>
      <Drawer open={sidebarOpen} onClose={handleClose} className="md:hidden">
        <Drawer.Header
          title="NAVIGATIONS"
          titleIcon={() => <AiOutlineMenuUnfold size={20} className="me-1" />}
        />
        <Drawer.Items>
          <Sidebar className="[&>div]:bg-transparent [&>div]:p-0">
            <div className="flex h-full flex-col justify-between py-2">
              <Sidebar.Items>
                <Sidebar.ItemGroup className="flex flex-col gap-1">
                  {currentUser &&
                  (currentUser.isAdmin || currentUser.isEmployer) ? (
                    <Link to="/dashboard?tab=dash">
                      <Sidebar.Item
                        active={tab === "dash" || !tab}
                        icon={HiChartPie}
                        lableColor="dark"
                        className="cursor-pointer"
                        as="div"
                        title={!sidebarOpen && "Dashboard"}
                        onClick={handleClose}
                      >
                        Dashboard
                      </Sidebar.Item>
                    </Link>
                  ) : (
                    <></>
                  )}
                  <Link to="/dashboard?tab=profile">
                    <Sidebar.Item
                      active={tab === "profile"}
                      icon={HiUsers}
                      label={
                        currentUser.isAdmin
                          ? sidebarOpen && "Admin"
                          : currentUser.isEmployer
                          ? sidebarOpen && "Employer"
                          : sidebarOpen && "User"
                      }
                      lableColor="dark"
                      className="cursor-pointer"
                      as="div"
                      title={!sidebarOpen && "Profile"}
                      onClick={handleClose}
                    >
                      Profile
                    </Sidebar.Item>
                  </Link>
                  {currentUser.isAdmin && (
                    <Link to="/dashboard?tab=jobs">
                      <Sidebar.Item
                        active={tab === "jobs"}
                        icon={FaBriefcase}
                        lableColor="dark"
                        className="cursor-pointer"
                        as="div"
                        title={!sidebarOpen && "Jobs"}
                        onClick={handleClose}
                      >
                        Jobs
                      </Sidebar.Item>
                    </Link>
                  )}
                  {currentUser.isAdmin && (
                    <Link to="/dashboard?tab=users">
                      <Sidebar.Item
                        active={tab === "users"}
                        icon={HiOutlineUserGroup}
                        lableColor="dark"
                        className="cursor-pointer"
                        as="div"
                        title={!sidebarOpen && "Users"}
                        onClick={handleClose}
                      >
                        Students
                      </Sidebar.Item>
                    </Link>
                  )}
                  {currentUser.isAdmin || currentUser.isEmployer ? (
                    <Link to="/dashboard?tab=applications">
                      <Sidebar.Item
                        active={tab === "applications"}
                        icon={FaRegComments}
                        lableColor="dark"
                        className="cursor-pointer"
                        as="div"
                        title={!sidebarOpen && "Comments"}
                        onClick={handleClose}
                      >
                        Applicatons
                      </Sidebar.Item>
                    </Link>
                  ) : (
                    <></>
                  )}
                </Sidebar.ItemGroup>
                <Sidebar.ItemGroup className="flex flex-col gap-1">
                  <Sidebar.Item
                    icon={HiArrowSmRight}
                    lableColor="dark"
                    className="cursor-pointer"
                    onClick={handleSignOut}
                    title={!sidebarOpen && "Sign Out"}
                  >
                    Sign Out
                  </Sidebar.Item>
                </Sidebar.ItemGroup>
              </Sidebar.Items>
            </div>
          </Sidebar>
        </Drawer.Items>
      </Drawer>
      <Sidebar className="hidden md:block">
        <div className="flex h-full flex-col justify-between py-2">
          <Sidebar.Items>
            <Sidebar.ItemGroup className="flex flex-col gap-1">
              {(currentUser && currentUser.isAdmin) ||
              currentUser.isEmployer ? (
                <Link to="/dashboard?tab=dash">
                  <Sidebar.Item
                    active={tab === "dash" || !tab}
                    icon={HiChartPie}
                    lableColor="dark"
                    className="cursor-pointer"
                    as="div"
                  >
                    Dashboard
                  </Sidebar.Item>
                </Link>
              ) : (
                <></>
              )}
              <Link to="/dashboard?tab=profile">
                <Sidebar.Item
                  active={tab === "profile"}
                  icon={HiUsers}
                  label={
                    currentUser.isAdmin
                      ? sidebarOpen && "Admin"
                      : currentUser.isEmployer
                      ? sidebarOpen && "Employer"
                      : sidebarOpen && "User"
                  }
                  lableColor="dark"
                  className="cursor-pointer"
                  as="div"
                  title={!sidebarOpen && "Profile"}
                >
                  Profile
                </Sidebar.Item>
              </Link>
              {currentUser.isAdmin && (
                <Link to="/dashboard?tab=jobs">
                  <Sidebar.Item
                    active={tab === "jobs"}
                    icon={FaBriefcase}
                    lableColor="dark"
                    className="cursor-pointer"
                    as="div"
                    title={!sidebarOpen && "Jobs"}
                  >
                    Jobs
                  </Sidebar.Item>
                </Link>
              )}
              {currentUser.isAdmin && (
                <Link to="/dashboard?tab=users">
                  <Sidebar.Item
                    active={tab === "users"}
                    icon={HiOutlineUserGroup}
                    lableColor="dark"
                    className="cursor-pointer"
                    as="div"
                    title={!sidebarOpen && "Users"}
                  >
                    Students
                  </Sidebar.Item>
                </Link>
              )}
              {currentUser.isAdmin || currentUser.isEmployer ? (
                <Link to="/dashboard?tab=applications">
                  <Sidebar.Item
                    active={tab === "applications"}
                    icon={FaRegComments}
                    lableColor="dark"
                    className="cursor-pointer"
                    as="div"
                    title={!sidebarOpen && "Comments"}
                  >
                    Applicatons
                  </Sidebar.Item>
                </Link>
              ) : (
                <></>
              )}
            </Sidebar.ItemGroup>
            <Sidebar.ItemGroup className="flex flex-col gap-1">
              <Sidebar.Item
                icon={HiArrowSmRight}
                lableColor="dark"
                className="cursor-pointer"
                onClick={handleSignOut}
                title={!sidebarOpen && "Sign Out"}
              >
                Sign Out
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </div>
      </Sidebar>
    </>
  );
};
export default DashSidebar;
