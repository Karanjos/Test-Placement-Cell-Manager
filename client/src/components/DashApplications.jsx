import { useSelector } from "react-redux";

const DashApplications = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [applications, setApplications] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [applicationIdToDelete, setApplicationIdToDelete] = useState("");
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await fetch(`/api/application/getapplications?postedBy=${currentUser._id}`);
                const data = await res.json();
                if (res.ok) {
                    setApplications(data.applications);
                    if (data.applications.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };
        if (currentUser.isAdmin) fetchApplications();
    }, [currentUser._id]);
  return <div className=" text-center">DashApplications</div>;
};
export default DashApplications;
