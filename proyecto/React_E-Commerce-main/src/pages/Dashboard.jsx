import { Navbar } from "../components";
import Sidebar from "../components/Sidebar";
import "../css/sidebar.css";

const Dashboard = () => {
  return (
    <div className="main-container">
      <Navbar />
      <div className="dashboard">
       
        <Sidebar />
      </div>
    </div>
  );
};

export default Dashboard;
