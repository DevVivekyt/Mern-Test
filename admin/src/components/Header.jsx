import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Toggle the dropdown menu
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("companyId")
        navigate("/")
    }

    return (
        <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start rtl:justify-end">
                        <button
                            data-drawer-target="logo-sidebar"
                            data-drawer-toggle="logo-sidebar"
                            aria-controls="logo-sidebar"
                            type="button"
                            className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        >
                            <span className="sr-only">Open sidebar</span>
                            <svg
                                className="w-6 h-6"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    clipRule="evenodd"
                                    fillRule="evenodd"
                                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                                ></path>
                            </svg>
                        </button>
                        <div className="flex md:ms-6 md:me-24">
                            <div className="flex items-center">
                                <span className="text-3xl font-bold sm:text-3xl whitespace-nowrap">
                                    OMS
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center ms-3 relative">
                        <button
                            type="button"
                            onClick={toggleDropdown}
                            className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                            aria-expanded={dropdownOpen}
                        >
                            <span className="sr-only">Open user menu</span>
                            <img
                                className="w-8 h-8 rounded-full"
                                src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                                alt="user photo"
                            />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600">
                                <ul className="py-1" role="none">
                                    <li>
                                        <p
                                            onClick={handleLogout}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300"
                                        >
                                            Logout
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
