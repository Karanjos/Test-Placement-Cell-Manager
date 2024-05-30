import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const DashPlacedStudents = () => {
  const [placedStudents, setPlacedStudents] = useState([]);
  const [totalPlacedStudents, setTotalPlacedStudents] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    try {
      const getPlacedStudents = async () => {
        const res = await fetch("/api/application/placedstudents");
        const data = await res.json();
        setPlacedStudents(data.placementRecords);
        setTotalPlacedStudents(data.totalPlacedStudents);
      };
      getPlacedStudents();
    } catch (error) {
      console.error(error.message);
    }
  }, [currentUser._id]);

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 mt-5">
      {currentUser.isAdmin && placedStudents.length > 0 ? (
        <Table hoverable className="shadow-md w-full">
          <Table.Head>
            <Table.HeadCell>Applicant Name</Table.HeadCell>
            <Table.HeadCell>Applicant Email</Table.HeadCell>
            <Table.HeadCell>Company Name</Table.HeadCell>
            <Table.HeadCell>Job Title</Table.HeadCell>
            <Table.HeadCell>Employer Name</Table.HeadCell>
            <Table.HeadCell>Job Category</Table.HeadCell>
          </Table.Head>
          {placedStudents.map((student) => (
            <Table.Body key={student._id} className="divide-y">
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>{student.applicantName}</Table.Cell>
                <Table.Cell>{student.applicantEmail}</Table.Cell>
                <Table.Cell>{student.companyName}</Table.Cell>
                <Table.Cell>{student.jobTitle}</Table.Cell>
                <Table.Cell>{student.employerName}</Table.Cell>
                <Table.Cell>{student.jobCategory}</Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
      ) : (
        <h1 className="text-2xl text-center">
          No students have been placed yet
        </h1>
      )}
    </div>
  );
};
export default DashPlacedStudents;
