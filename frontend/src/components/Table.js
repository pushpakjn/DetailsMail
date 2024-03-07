import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserTable = ({ users, deleteUser, updateUser }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [checkState, setCheckState] = useState({});
  const [arr, setArr] = useState([]);

  const handleCheckboxChange = (userId) => {
    const updatedCheckState = { ...checkState };
    updatedCheckState[userId] = !checkState[userId];
    setCheckState(updatedCheckState);

    if (updatedCheckState[userId]) {
      setArr([...arr, userId]);
    } else {
      const updatedArr = arr.filter((id) => id !== userId);
      setArr(updatedArr);
    }

    if (selectedRows.includes(userId)) {
      setSelectedRows(selectedRows.filter((id) => id !== userId));
    } else {
      setSelectedRows([...selectedRows, userId]);
    }
  };

  const sendEmails = async () => {
    try {
      const userData = {};

      for (const userId of arr) {
        const response = await axios.get(
          `http://localhost:5000/user/${userId}`
        );
        userData[userId] = response.data;
      }

      await axios.post("http://localhost:5000/send-email", {
        userData: userData,
      });
      console.log("Email sent");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <div>
    <div className="container mx-auto mt-8 flex justify-center w-150">
      <table className="table-auto  px-4">
        <thead>
          <tr>
            <th className="px-4 py-2">Select</th>
            <th className="px-4 py-2">Serial Number</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Phone Number</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Hobbies</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) &&
            users.map((user, index) => (
              <tr key={user._id}>
                <td className="border px-4 py-2">
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(user._id)}
                  />
                </td>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.phoneNumber}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.hobbies}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => updateUser(user._id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      
    </div>
    <div className="container mx-auto mt-8 flex justify-center w-150">
    {arr.length ? <SendEmailButton onClick={sendEmails} /> : null}
    </div>
    </div>
  );
};

const SendEmailButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4 ml-2 "
    >
      Send Email
    </button>
  );
};

const AddUserButton = ({ onClick }) => {
  return (
    <div className="container mx-auto mt-8 flex justify-center ">
      <button
        onClick={onClick}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Add New User
      </button>
    </div>
  );
};

const Table = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users");
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/user/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const updateUser = async (id) => {
    const selected = users.find((user) => user._id === id);
    setSelectedUser(selected);
    setIsOpen(true);
  };

  const openForm = () => {
    setIsOpen(true);
    fetchUserData(selectedUser._id);
  };

  const fetchUserData = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/user/${id}`);
      setSelectedUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleChange = (e) => {
    setSelectedUser({
      ...selectedUser,
      [e.target.name]: e.target.value,
    });
  };

  const addUser = () => {
    navigate("/form");
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!selectedUser) {
        console.error("No user selected.");
        return;
      }
      await axios.put(
        `http://localhost:5000/user/${selectedUser._id}`,
        selectedUser
      );
      setIsOpen(false);
      window.location.reload();
      navigate("/");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <AddUserButton onClick={addUser} />
      <UserTable
        users={users}
        deleteUser={deleteUser}
        updateUser={updateUser}
      />
      {selectedUser && isOpen && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto bg-gray-900 bg-opacity-90"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <form
              onSubmit={handleUpdateSubmit}
              action="#"
              method="POST"
              className="mx-auto mt-16 max-w-xl sm:mt-20"
            >
              <h3 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Update User
              </h3>
              <div className="gap-x-8 gap-y-6 sm:col-span-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold leading-6 text-gray-900"
                  >
                    Name
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      autoComplete="name"
                      value={selectedUser.name}
                      onChange={handleChange}
                      required
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-semibold leading-6 text-gray-900"
                  >
                    Phone number
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="tel"
                      name="phoneNumber"
                      id="phoneNumber"
                      autoComplete="tel"
                      onChange={handleChange}
                      value={selectedUser.phoneNumber}
                      pattern="[0-9]*"
                      required
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold leading-6 text-gray-900"
                  >
                    Email
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      autoComplete="email"
                      value={selectedUser.email}
                      onChange={handleChange}
                      required
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="hobbies"
                    className="block text-sm font-semibold leading-6 text-gray-900"
                  >
                    Hobbies
                  </label>
                  <div className="mt-2.5">
                    <textarea
                      name="hobbies"
                      id="hobbies"
                      autoComplete="hobbies"
                      value={selectedUser.hobbies}
                      onChange={handleChange}
                      rows={4}
                      required
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <button
                  type="submit"
                  className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
