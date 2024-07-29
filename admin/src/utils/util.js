import toast from 'react-hot-toast';

export const BASE_API = "http://localhost:8800/api/"


export const usertype = [
    {
        roleName: "Admin",
        roleId: 1
    },
    {
        roleName: "Manager",
        roleId: 2
    },
    {
        roleName: "Employee",
        roleId: 3
    }
]

export const showSuccess = (message) => {
    toast.success(message)
}
export const showError = (message) => {
    toast.error(message)
}