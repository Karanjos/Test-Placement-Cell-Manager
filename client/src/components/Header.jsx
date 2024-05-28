import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSearch, FaSun, FaUser } from "react-icons/fa";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";
import { HiLogout, HiViewGrid } from "react-icons/hi";
import { RiMenu3Fill } from "react-icons/ri";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { FaCircleArrowLeft } from "react-icons/fa6";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const path = useLocation().pathname;
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchbar, setShowSearchbar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    } else {
      setSearchTerm(""); // Reset searchTerm to null if searchTermFromUrl is null
    }
  }, [location.search]);

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
        navigate("/sign-in");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    if (searchTerm === "" || searchTerm === null || searchTerm === undefined) {
      urlParams.delete("searchTerm");
    } else {
      urlParams.set("searchTerm", searchTerm);
      const searchQuery = urlParams.toString();
      navigate(`/search?${searchQuery}`);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSearchbar = () => {
    setShowSearchbar(!showSearchbar);
  };

  return (
    <Navbar className="border-b-2" style={{ margin: 0, padding: 0 }}>
      {showSearchbar && (
        <div className="sm:hidden w-full p-1 absolute top-1 z-50 bg-white h-auto dark:bg-slate-700">
          <form
            onSubmit={handleSubmit}
            className="flex items-center border border-gray-300 rounded-lg p-2 gap-2 w-full"
          >
            <button type="button" color="gray" onClick={toggleSearchbar}>
              <FaCircleArrowLeft size={30} className=" cursor-pointer" />
            </button>
            <TextInput
              type="text"
              placeholder="Search..."
              className="md:hidden w-full"
              value={searchTerm}
              rightIcon={AiOutlineSearch}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>
      )}
      <div className="flex justify-center items-center gap-3 p-3">
        {location.pathname === "/dashboard" && (
          <HiOutlineAdjustmentsHorizontal
            size={25}
            style={{ fontWeight: "bold" }}
            className="text-teal-700 cursor-pointer"
            onClick={toggleSidebar}
            title="Toggle Sidebar"
          />
        )}
        <div className="w-32 sm:w-40">
          <Link
            to="/"
            className="flex flex-col self-center whitespace-nowrap text-sm font-semibold dark:text-white"
          >
            <span className=" text-xs md:text-sm self-center">
              PLACEMENT PORTAL
            </span>
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-lg text-white"></span>
          </Link>
        </div>
      </div>
      <div className=" flex gap-4 md:order-2 p-3">
        <form onSubmit={handleSubmit} className="me-5 hidden sm:inline">
          <div className="w-48">
            <TextInput
              type="text"
              placeholder="Search..."
              rightIcon={() => <AiOutlineSearch />}
              className=""
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>
        <FaSearch
          className="block sm:hidden border my-auto w-10 h-10 border-gray-300 rounded-2xl p-3 cursor-pointer"
          color="gray"
          pill
          type="button"
          onClick={toggleSearchbar}
        />
        <Button
          className="w-12 h-10 my-auto hidden lg:block"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "dark" ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="user_profile"
                img={currentUser.profilePicture}
                rounded
                size="sm"
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{currentUser.username}</span>
            </Dropdown.Header>
            <Link to="dashboard?tab=profile">
              <Dropdown.Item icon={FaUser}>Profile</Dropdown.Item>
            </Link>
            <Link to="dashboard?tab=dash">
              <Dropdown.Item icon={HiViewGrid}>Dashboard</Dropdown.Item>
            </Link>
            <Dropdown.Item
              className="lg:hidden"
              onClick={() => dispatch(toggleTheme())}
              icon={theme === "dark" ? FaSun : FaMoon}
            >
              {theme === "light" ? <>Dark Mode</> : <>Light Mode</>}
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item icon={HiLogout} onClick={handleSignOut}>
              Sign Out
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in" className="my-auto">
            <Button gradientDuoTone="purpleToBlue" outline size="xs">
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle
          barIcon={() => (
            <RiMenu3Fill
              size={20}
              className="text-gray-800 dark:text-gray-300"
            />
          )}
        />
      </div>
      <Navbar.Collapse>
        <Link to="/">
          <Navbar.Link active={path === "/"} as={"div"}>
            Home
          </Navbar.Link>
        </Link>
        <Link to="/about">
          <Navbar.Link active={path === "/about"} as={"div"}>
            About
          </Navbar.Link>
        </Link>
        <Link to="/projects">
          <Navbar.Link active={path === "/projects"} as={"div"}>
            Projects
          </Navbar.Link>
        </Link>
        <form onSubmit={handleSubmit} className="mt-4">
          <TextInput
            type="text"
            placeholder="Search..."
            rightIcon={AiOutlineSearch}
            className="md:hidden"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </Navbar.Collapse>
    </Navbar>
  );
};
export default Header;
