import Navbar from "../../component/Layout/NavBar";
import Sidebar from "../Layout/SideBar";
import FloatingBackground from "../ui/FloatingBackground";

const StudentTeacherLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-v-bg-main text-v-text-main font-nunito relative overflow-hidden">
      <FloatingBackground />

      <div className="relative z-10 w-full min-h-screen flex flex-col">
        <Navbar />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar />

          <main className="flex-1 p-8 overflow-y-auto h-[calc(100vh-80px)]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default StudentTeacherLayout;
