import { Link } from "react-router-dom";

const PostCard = ({ job }) => {
  
  return (
    <div className="group relative w-full border border-teal-500 hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[360px] transition-all mt-5">
      <Link to={`/post/${job.slug}`}>
        <img
          src={job.companyLogo}
          alt="post cover"
          className="h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20 "
        />
      </Link>
      <div className="p-3 flex flex-col gap-2">
        <p className="text-lg font-semibold line-clamp-2">{job.jobTitle}</p>
        <span className="italic text-sm">{job.jobCategory}</span>
        <Link
          to={`/job/${job.slug}`}
          className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 py-2 rounded-md !rounded-tl-none m-2 text-center"
        >
          Read more
        </Link>
      </div>
    </div>
  );
};
export default PostCard;
