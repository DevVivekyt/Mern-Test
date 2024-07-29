import React from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Model';
import { showError, showSuccess, usertype } from '../../utils/util';
import SearchableDropdown from '../../components/SearchableDropdown';
import { userForm } from '../../utils/form';
import Loder from '../../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { clearSingleUser, createUser, deleteUserByID, getAllUser, getFiltredUser, getUserById, updateUserById } from '../../redux/slices/user.slice';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2"


const User = () => {
    const dispatch = useDispatch()
    const [search, setSearch] = React.useState('');
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [errors, setErrors] = React.useState({});
    const [showPassword, setShowPassword] = React.useState(false);
    const isLoading = useSelector((state) => state.users.loading)
    const [formData, setFormData] = React.useState(userForm);
    const [roleId, setRoleId] = React.useState(null)
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false),
            dispatch(clearSingleUser())
    };

    // Redux state selectors
    const alluUser = useSelector((state) => state.users.userInfo.result)
    const filteredInfo = useSelector((state) => state.users.filteredInfo.result)
    const singleuserInfo = useSelector((state) => state.users.singleuserInfo?.result)

    // Set the user role ID from local storage 
    React.useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userInfo"))
        if (userData) {
            setRoleId(userData.roleID)
        }
    }, [roleId])

    // Update form data when a single user is fetched
    React.useEffect(() => {
        if (singleuserInfo) {
            setFormData({
                companyId: singleuserInfo.companyId,
                fullName: singleuserInfo.fullName,
                email: singleuserInfo.email,
                password: singleuserInfo.password,
                roleID: singleuserInfo.roleID,
                address: singleuserInfo.address,
                isDeleted: singleuserInfo.isDeleted,
                isActive: singleuserInfo.isActive
            });
        }
    }, [singleuserInfo]);

    // Map users data to table rows
    const userData = (filteredInfo && filteredInfo.length > 0 ? filteredInfo : alluUser || []).map((user, i) => {
        const role = usertype.find(type => type.roleId === user.roleID);

        const isDisabled = roleId !== 1 && roleId !== 2;

        return {
            SNO: i + 1,
            Name: user.fullName,
            email: user.email,
            role: role ? role.roleName : 'Unknown',
            address: user.address,
            action: (
                <div className={`flex justify-start items-center gap-4 ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}>
                    <FaEdit
                        className='text-blue-600 cursor-pointer'
                        size={22}
                        onClick={() => !isDisabled && handleEdit(user._id)}
                    />
                    <MdDelete
                        className='text-red-600 cursor-pointer'
                        size={22}
                        onClick={() => !isDisabled && handleDelete(user._id)}
                    />
                </div>
            ),
        };
    });

    // Define table headers
    const headers = ['S No.', 'Name', 'Email', "Role", "Address", "Action"];

    // Define roles
    const userTypeOption = usertype?.map(user => ({
        value: user.roleId,
        label: user.roleName
    }));

    // Handle password hide and show
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Handle validate inputs
    const validate = () => {
        const newErrors = {};

        if (!formData.fullName) {
            newErrors.fullName = 'Full Name is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        if (!formData.address) {
            newErrors.address = 'Address is required';
        }

        return newErrors;
    };

    // Handle validate input
    const handleSubmit = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            try {
                let companyId = localStorage.getItem("companyId")
                const updateCompayId = {
                    ...formData,
                    companyId: companyId
                }
                const response = await dispatch(createUser(updateCompayId))
                if (response.payload.status == 1) {
                    showSuccess(response.payload.message)
                    setFormData(userForm)
                    setIsModalOpen(false)
                    dispatch(getAllUser(companyId))
                } else {
                    showError(response.payload.message)
                }

            } catch (error) {
                showError(error.message)

            }
        }
    };

    // Handle searching a user
    let debounceTimer;
    const handleSearch = async (e) => {
        const searchTerm = e.target.value;
        setSearch(searchTerm);

        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        debounceTimer = setTimeout(async () => {
            if (searchTerm.trim() === '') {
                return;
            }
            try {
                const companyId = localStorage.getItem("companyId");
                await dispatch(getFiltredUser({ cid: companyId, search: searchTerm }));
            } catch (error) {
                showError(error.message);
            }
        }, 2000);
    };

    // Handle editing a user
    const handleEdit = async (id) => {
        try {
            if (id) {
                setIsModalOpen(true);
                dispatch(getUserById(id));
            }
        } catch (error) {
            showError(error.message);
        }
    };

    // Handle updating a user
    const handleUpdate = async () => {
        try {
            let companyId = localStorage.getItem("companyId")

            const response = await dispatch(updateUserById({ id: singleuserInfo._id, data: formData }));
            if (response.payload.status === 1) {
                setIsModalOpen(false);
                showSuccess(response.payload.message);
                setFormData(userForm);
                dispatch(getAllUser(companyId))
                dispatch(clearSingleUser());
            } else {
                showError(response.payload.message);
            }
        } catch (error) {
            showError(error.message);
        }
    };

    // Handle deleting a user
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
                        let companyId = localStorage.getItem("companyId")
                        const response = await dispatch(deleteUserByID(id));
                        if (response.payload.status === 1) {
                            showSuccess(response.payload.message);
                            dispatch(getAllUser(companyId))
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

    return (
        <>
            {isLoading && <Loder loading={isLoading} />}
            <div className="p-4">
                {roleId === 1 || roleId === 2 ? <button
                    type="submit"
                    className="float-end px-4 py-2 my-3 text-base font-semibold text-white transition-colors duration-300 bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-blue-200 focus:ring-4"
                    onClick={openModal}

                >
                    Add Manager/Staff
                </button> : null}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={search}
                        onChange={(e) => handleSearch(e)}
                        className="p-2 border rounded-lg w-full"
                    />
                </div>
                {/* DataTable */}
                <DataTable data={userData} headers={headers} />

                {/* Add Manager/Staff */}
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <h2 className="text-base font-semibold">Manage Manager/Staff</h2>
                    <hr className='my-2' />
                    <div className="mt-4 grid grid-cols-12 gap-4" >
                        <div className="lg:col-span-6 col-span-12 mb-4">
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                placeholder="jone dev"
                                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm ${errors.fullName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            />
                            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                        </div>

                        <div className="lg:col-span-6 col-span-12 mb-4">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="text"
                                placeholder="jone@gmail.com"
                                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>

                        {singleuserInfo ? null : <div className="lg:col-span-6 col-span-12 mb-4">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-sm font-semibold text-gray-500">Password</label>
                                <button type="button" onClick={togglePasswordVisibility} className="text-sm text-blue-500 focus:outline-none">
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter password"
                                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm ${errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                        </div>}

                        <div className="lg:col-span-6 col-span-12 mb-4">
                            <label className="block text-sm font-medium text-gray-700">User Type</label>
                            <SearchableDropdown
                                options={userTypeOption}
                                selectedValue={formData.roleID}
                                onChange={(value) => setFormData({ ...formData, roleID: value })}
                            />
                            {errors.roleID && <p className="text-red-500 text-sm">{errors.roleID}</p>}
                        </div>

                        <div className="lg:col-span-12 col-span-12 mb-4">
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <textarea
                                type="text"
                                placeholder="address"
                                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm ${errors.address ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                        </div>

                        <div className="col-span-12 flex justify-end space-x-2 mt-4">
                            {singleuserInfo ? <button
                                type="submit"
                                className="px-4 py-2 text-white bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-200"
                                onClick={handleUpdate}
                            >
                                Update
                            </button> : <button
                                type="submit"
                                className="px-4 py-2 text-white bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-200"
                                onClick={handleSubmit}
                            >
                                Save
                            </button>}
                            <button
                                type="button"
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

export default User;
