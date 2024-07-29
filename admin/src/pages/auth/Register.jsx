import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerForm } from '../../utils/form';
import SearchableDropdown from '../../components/SearchableDropdown';
import { showError, showSuccess, usertype } from '../../utils/util';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../redux/slices/auth.slice';
import Loder from '../../components/Loader';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [formData, setFormData] = React.useState(registerForm);
    const [showPassword, setShowPassword] = React.useState(false);
    const [errors, setErrors] = React.useState({});
    const isLoading = useSelector((state) => state.auth.loading)



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

        if (!formData.roleID) {
            newErrors.roleID = 'User Type is required';
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
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            console.log("formData", formData);
            try {
                const response = await dispatch(register(formData))
                console.log("res", response.payload.message);
                console.log("res", response.payload);
                if (response.payload.status == 1) {
                    showSuccess(response.payload.message)
                    setFormData(registerForm)
                    navigate("/")
                } else {
                    showError(response.payload.message)
                }

            } catch (error) {
                showError(error)

            }
        }
    };


    // Define role
    const userTypeOption = usertype?.map(user => ({
        value: user.roleId,
        label: user.roleName
    }));

    return (
        <>
            {isLoading && <Loder loading={isLoading} />}
            <div className="flex items-center min-h-screen p-4 bg-gray-100 lg:justify-center">
                <div className="flex flex-col overflow-hidden bg-white rounded-md shadow-lg max md:flex-row md:flex-1 lg:max-w-screen-md">
                    <div className="p-4 py-6 text-white bg-blue-500 md:w-80 md:flex-shrink-0 md:flex md:flex-col md:items-center md:justify-evenly">
                        <div className="my-3 text-4xl font-bold tracking-wider text-center">
                            <a href="#">React</a>
                        </div>
                        <p className="mt-6 font-normal text-center text-gray-300 md:mt-0">
                            React.js is a JavaScript library for building user interfaces, using components, state management, and virtual DOM for efficiency.
                        </p>
                        <p className="flex flex-col items-center justify-center mt-10 text-center">
                            <span>Already have an account?</span>
                            <Link to="/login" className="underline">Log In</Link>
                        </p>
                    </div>
                    <div className="p-5 bg-white md:flex-1">
                        <h3 className="my-4 text-2xl font-semibold text-gray-700">Account Registration</h3>
                        <form className="flex flex-col space-y-5" onSubmit={handleSubmit}>
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="fullName" className="text-sm font-semibold text-gray-500">Full Name</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}

                                    className={`px-4 py-2 transition duration-300 border rounded focus:outline-none focus:ring-4 ${errors.fullName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                                    placeholder="Full Name"
                                />
                                {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                            </div>
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="email" className="text-sm font-semibold text-gray-500">Email address</label>
                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={`px-4 py-2 transition duration-300 border rounded focus:outline-none focus:ring-4 ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                                    placeholder="Email address"
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                            </div>
                            <div className="flex flex-col space-y-1">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="text-sm font-semibold text-gray-500">Password</label>
                                    <button type="button" onClick={togglePasswordVisibility} className="text-sm text-blue-500 focus:outline-none">
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className={`px-4 py-2 transition duration-300 border rounded focus:outline-none focus:ring-4 ${errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                                    placeholder="Password"
                                />
                                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                            </div>

                            <div className="flex flex-col space-y-1">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="text-sm font-semibold text-gray-500">User Type</label>

                                </div>
                                <SearchableDropdown
                                    options={userTypeOption}
                                    selectedValue={formData.roleID}
                                    onChange={(value) => setFormData({ ...formData, roleID: value })}
                                />
                                {errors.roleID && <p className="text-red-500 text-sm">{errors.roleID}</p>}
                            </div>
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="address" className="text-sm font-semibold text-gray-500">Address</label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}

                                    className={`px-4 py-2 transition duration-300 border rounded focus:outline-none focus:ring-4 ${errors.address ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                                    placeholder="Address"
                                />
                                {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                            </div>

                            <button
                                type="submit"
                                className="w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300 bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-blue-200 focus:ring-4"
                            >
                                Register
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;
