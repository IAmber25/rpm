import AttendanceModule from "../../pages/AttendanceModule/AttendanceModule";
import BatchIcon from "../../assets/BatchIcon";
import CandidateOnboadIcon from "../../assets/CandidateOnboadIcon";
import CandidateRegistrationIcon from "../../assets/CandidateRegistrationIcon";
import DashboardIcon from "../../assets/DashboardIcon";
import TrainerIcon from "../../assets/TrainerIcon";
import BatchModule from "../../pages/BatchModule/BatchModule";
import CandidateOnBoardDetails from "../../pages/CandidateOnboardDetails/CandidateOnBoardDetails";
import CandidateRegistration from "../../pages/CandidateRegistration/CandidateRegistration";
import TrainerModule from "../../pages/TrainerModule/TrainerModule";
import AttendanceIcon from "../../assets/AttendanceIcon";

const resourcePoolRouteObject = [
  {
    label: "Dashboard",
    sideBarIcon: <DashboardIcon fill={"#0F6F9A"} />,
    sideBarActiveIcon: <DashboardIcon fill={"#ffffff"} />,
    element: "Dashboard",
    path: "/dashboard",
    child: [],
  },
  {
    label: "Candidate registration",
    sideBarIcon: <CandidateRegistrationIcon fill={"#0F6F9A"} />,
    sideBarActiveIcon: <CandidateRegistrationIcon fill={"#ffffff"} />,
    element: <CandidateRegistration />,
    path: "/candidateregistration",
    child: [],
  },
  {
    label: "Candidate onboard details",
    sideBarIcon: <CandidateOnboadIcon fill={"#0F6F9A"} />,
    sideBarActiveIcon: <CandidateOnboadIcon fill={"#ffffff"} />,
    element: <CandidateOnBoardDetails />,
    path: "/candidateonboarddetails",
    child: [],
  },
  {
    label: "Trainer module",
    sideBarIcon: <TrainerIcon fill={"#0F6F9A"} />,
    sideBarActiveIcon: <TrainerIcon fill={"#ffffff"} />,
    element: <TrainerModule />,
    path: "/trainermodule",
    child: [],
  },
  {
    label: "Batch module",
    sideBarIcon: <BatchIcon fill={"#0F6F9A"} />,
    sideBarActiveIcon: <BatchIcon fill={"#ffffff"} />,
    element: <BatchModule />,
    path: "/batchmodule",
    child: [],
  },
  {
    label: "Attendance Module",
    sideBarIcon: <AttendanceIcon fill={"#0F6F9A"} />,
    sideBarActiveIcon: <AttendanceIcon fill={"#ffffff"} />,
    element: <AttendanceModule />,
    path: "/attendancemodule",
    child: [],
  },
];

export { resourcePoolRouteObject };
