import React from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Model';
import SearchableDropdown from '../../components/SearchableDropdown';
import { departmentForm } from '../../utils/form';
import { useDispatch, useSelector } from 'react-redux';
import { showError, showSuccess } from '../../utils/util';
import Loder from '../../components/Loader';
import { clearSingleDepartment, createDepartment, deleteDepartmentByID, getAllDepartment, getDepartmentByID, updateDepartmentByID } from '../../redux/slices/department.slice';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2"

const Department = () => {
    const dispatch = useDispatch();
    const [search, setSearch] = React.useState('');
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [formData, setFormData] = React.useState(departmentForm);
    const [errors, setErrors] = React.useState({});
    const [companyID, setCompanyID] = React.useState(null);
    const [roleId, setRoleId] = React.useState(null);

    // Redux state selectors
    const isLoading = useSelector((state) => state.departments.loading);
    const allUser = useSelector((state) => state.users.userInfo.result);
    const alldeparment = useSelector((state) => state.departments.departmentInfo.result);
    const singleDepartment = useSelector((state) => state.departments.singleDepartment?.result);

    // Set the user role ID from local storage 
    React.useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userInfo"));
        if (userData) {
            setRoleId(userData.roleID);
        }
    }, [roleId]);

    // Fetch all departments when company ID changes
    React.useEffect(() => {
        const companyId = localStorage.getItem("companyId");
        if (companyId) {
            setCompanyID(companyId);
            dispatch(getAllDepartment(companyId));
        }
    }, [companyID]);

    // Update form data when a single department is fetched
    React.useEffect(() => {
        if (singleDepartment) {
            setFormData({
                companyId: singleDepartment.companyId,
                departmentName: singleDepartment.departmentName,
                assignedUserid: singleDepartment.assignedUserid,
                description: singleDepartment.description,
                isDeleted: singleDepartment.isDeleted,
                isActive: singleDepartment.isActive
            });
        }
    }, [singleDepartment]);

    // Define table headers
    const headers = ['S No.', 'Department Name', 'Employee', "description", "Action"];

    // Map department data to table rows
    const isDisabled = roleId !== 1 && roleId !== 2;
    const data = alldeparment && alldeparment.map((deparment, i) => ({
        SNO: i + 1,
        departmentName: deparment.departmentName,
        employee: deparment.assignedEmployeeName,
        description: deparment.description,
        action: (
            <div className={`flex justify-start items-center gap-4 ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}>
                <FaEdit className='text-blue-600 cursor-pointer' size={22} onClick={() => !isDisabled && handleEdit(deparment._id)} />
                <MdDelete className='text-red-600 cursor-pointer' size={22} onClick={() => !isDisabled && handleDelete(deparment._id)} />
            </div>
        ),
    }));

    // Filter departments based on search input
    const filteredData = data && data.filter((item) =>
        item.departmentName.toLowerCase().includes(search.toLowerCase()) ||
        item.employee.toLowerCase().includes(search.toLowerCase())
    );

    // Map user data to options for the dropdown
    const userTypeOption = allUser && allUser.map(user => ({
        value: user._id,
        label: user.fullName
    }));

    // Open the modal
    const openModal = () => setIsModalOpen(true);

    // Close the modal and reset form data
    const closeModal = () => {
        setIsModalOpen(false);
        setFormData(departmentForm);
        dispatch(clearSingleDepartment());
    };

    // Validate form data
    const validate = () => {
        const newErrors = {};

        if (!formData.departmentName) {
            newErrors.departmentName = 'Department Name is required';
        }

        if (!formData.assignedUserid) {
            newErrors.assignedUserid = 'Employee is required';
        }

        return newErrors;
    };

    // Handle form submission for creating a new department
    const handleSubmit = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            try {
                const updateCompayId = {
                    ...formData,
                    companyId: localStorage.getItem("companyId")
                };

                const response = await dispatch(createDepartment(updateCompayId));
                if (response.payload.status === 1) {
                    showSuccess(response.payload.message);
                    setFormData(departmentForm);
                    setIsModalOpen(false);
                    dispatch(getAllDepartment(companyID));
                } else {
                    showError(response.payload.message);
                }
            } catch (error) {
                showError(error.message);
            }
        }
    };

    // Handle editing a department
    const handleEdit = async (id) => {
        try {
            if (id) {
                setIsModalOpen(true);
                dispatch(getDepartmentByID(id));
            }
        } catch (error) {
            showError(error.message);
        }
    };

    // Handle deleting a department with confirmation
    const handleDelete = async (id) => {
        try {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    if (id) {
                        const response = await dispatch(deleteDepartmentByID(id));
                        if (response.payload.status === 1) {
                            showSuccess(response.payload.message);
                            dispatch(getAllDepartment(companyID));
                        } else {
                            showError(response.payload.message);
                        }
                    }
                }
            });
        } catch (error) {
            showError(error.message);
        }
    };

    // Handle updating a department
    const handleUpdate = async () => {
        try {
            const response = await dispatch(updateDepartmentByID({ id: singleDepartment._id, data: formData }));
            if (response.payload.status === 1) {
                setIsModalOpen(false);
                showSuccess(response.payload.message);
                setFormData(departmentForm);
                dispatch(getAllDepartment(companyID));
                dispatch(clearSingleDepartment());
            } else {
                showError(response.payload.message);
            }
        } catch (error) {
            showError(error.message);
        }
    };

    return (
        <>
            {isLoading && <Loder loading={isLoading} />}
            <div className="p-4">
                {roleId === 1 || roleId === 2 ? (
                    <button
                        type="submit"
                        className="float-end px-4 py-2 my-3 text-base font-semibold text-white transition-colors duration-300 bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-blue-200 focus:ring-4"
                        onClick={openModal}
                    >
                        Add Department
                    </button>
                ) : null}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="p-2 border rounded-lg w-full"
                    />
                </div>
                {/* DataTable */}
                <DataTable data={filteredData} headers={headers} />

                {/* Add/Edit Department Modal */}
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <h2 className="text-base font-semibold">Manage Department</h2>
                    <hr className='my-2' />
                    <div className="mt-4">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Department Name</label>
                            <input
                                type="text"
                                placeholder="Enter department name"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                                value={formData.departmentName}
                                onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
                            />
                            {errors.departmentName && <p className="text-red-500 text-sm">{errors.departmentName}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Employee</label>
                            <SearchableDropdown
                                options={userTypeOption}
                                selectedValue={formData.assignedUserid}
                                onChange={(value) => setFormData({ ...formData, assignedUserid: value })}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                type="text"
                                placeholder="description"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className='float-end'>
                            {singleDepartment ? (
                                <button
                                    className="px-4 py-2 mx-2 text-white bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-200"
                                    onClick={handleUpdate}
                                >
                                    Update
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="px-4 py-2 mx-2 text-white bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-200"
                                    onClick={handleSubmit}
                                >
                                    Save
                                </button>
                            )}
                            <button
                                type="submit"
                                className="px-4 py-2 text-white bg-gray-500 rounded-md shadow hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-200"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default Department;
