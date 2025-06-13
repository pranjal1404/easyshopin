import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../../redux/api/usersapiSlice";
import AdminMenu from "./AdminMenu";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();
  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteUser(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      });
      setEditableUserId(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-gray-700 to-black flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-white mb-8">User List</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <div className="text-red-500 text-center">{error?.data?.message || error.error}</div>
       
      ) : (
        <div className="w-full max-w-6xl overflow-x-auto bg-gray-800 p-6 rounded-lg shadow-lg">
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="bg-gray-700 text-gray-300">
              <tr>
                <th className="px-6 py-3">Id</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Admin</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-gray-700">
                  <td className="px-6 py-3">{user._id}</td>
                  <td className="px-6 py-3">
                    {editableUserId === user._id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={editableUserName}
                          onChange={(e) => setEditableUserName(e.target.value)}
                          className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                        />
                        <button
                          onClick={() => updateHandler(user._id)}
                          className="ml-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
                        >
                          <FaCheck />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        {user.username}
                        <button
                          onClick={() =>
                            toggleEdit(user._id, user.username, user.email)
                          }
                        >
                          <FaEdit className="ml-4 text-gray-400 hover:text-gray-300" />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    {editableUserId === user._id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={editableUserEmail}
                          onChange={(e) => setEditableUserEmail(e.target.value)}
                          className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                        />
                        <button
                          onClick={() => updateHandler(user._id)}
                          className="ml-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
                        >
                          <FaCheck />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <a
                          href={`mailto:${user.email}`}
                          className="text-blue-400 hover:underline"
                        >
                          {user.email}
                        </a>
                        <button
                          onClick={() =>
                            toggleEdit(user._id, user.name, user.email)
                          }
                        >
                          <FaEdit className="ml-4 text-gray-400 hover:text-gray-300" />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    {user.isAdmin ? (
                      <FaCheck style={{ color: "green" }} />
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td className="px-6 py-3">
                    {!user.isAdmin && (
                      <button
                        onClick={() => deleteHandler(user._id)}
                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;
