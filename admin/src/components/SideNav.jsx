import React from "react";
import { NavLink } from "react-router-dom";
import Header from "./Header";
import { MdDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";

const SideNav = ({ children }) => {
    return (
        <>
            <Header />
            <aside
                id="logo-sidebar"
                className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0"
                aria-label="Sidebar"
            >
                <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <NavLink
                                to="/department"
                                className={({ isActive }) =>
                                    `flex gap-4 w-full p-2 text-gray-500 transition duration-75 rounded-lg group hover:bg-blue-700 hover:text-white text-sm ${isActive ? "bg-blue-600 text-white" : ""
                                    }`
                                }
                            >
                                <MdDashboard size={20} />
                                <span>Department</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/user"
                                className={({ isActive }) =>
                                    `flex gap-4 w-full p-2 text-gray-500 transition duration-75 rounded-lg group hover:bg-blue-700 hover:text-white text-sm ${isActive ? "bg-blue-600 text-white" : ""
                                    }`
                                }
                            >
                                <FaUsers size={20} />
                                Manager/Staff
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </aside>

            <div className="md:ml-64 mt-14 md:w-[calc(100%-265px)] bg-[#E5E7EB] flex-1 w-full">
                <div className="bg-gray-100 h-[calc(100vh-59px)]">{children}</div>
            </div>
        </>
    );
};

export default SideNav;
