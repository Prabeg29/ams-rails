import { Link, Outlet, useNavigate } from "react-router";

import http from "../utils/http";
import { NavBar } from "../components/common/NavBar";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const logout = async () => {
    try {
      localStorage.removeItem("user");
      await http.post("/auth/logout");
      // navigate("/login", { replace: true });
      location.href = "/login"
      return
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-[#252B37] h-[54px] px-5 flex justify-between items-center">
        <Link
          to="/"
          className={
            "text-white text-md hover:text-blue-500 font-medium text-center"
          }
        >
          Artist Management
        </Link>{" "}
        <button
          className="hover:text-red-400 text-white flex items-center transition-colors duration-200"
          onClick={logout}
        >
          Logout
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="bg-zinc-100 w-[200px] border-gray-300 overflow-y-auto">
          <NavBar />
        </aside>

        <main className="flex-1 overflow-y-auto py-1 px-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
