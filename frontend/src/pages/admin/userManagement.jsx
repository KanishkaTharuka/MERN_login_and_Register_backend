import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleChange, setRoleChange] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [sort, setSort] = useState("");
  const [adminChecked, setAdminChecked] = useState(true);
  const [userChecked, setUserChecked] = useState(true);

  useEffect(() => {
    if (loading || sort !== "") {
      let url = import.meta.env.VITE_BACKEND_URL + `/users?sort=${sort}`;
      if (!adminChecked) {
        url += `&role=admin`;
      }
      if (!userChecked) {
        url += `&role=user`;
      }
      if (!adminChecked && !userChecked) {
        setUsers([]);
        setLoading(false);
        return;
      }

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          setUsers(response.data);
          console.log(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  }, [loading, sort]);

  function updateUserRole(userId, role) {
    axios
      .put(
        import.meta.env.VITE_BACKEND_URL + "/users/update-role/" + userId,
        {
          role: role,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setRoleChange(false);
        setLoading(true);
        toast.success("Role updated successfully");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error updating role");
      });
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6">User Management</h2>
      <div className="flex items-center mb-6 space-x-4">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:ring-2 outline-none"
        >
          <option value="name">Name</option>
          <option value="date">Date</option>
          <option value="city">City</option>
        </select>

        <label 
          className="ml-4"
          onChange={() => {
            setAdminChecked(!adminChecked);
            setLoading(true);
          }}
        >
          <input type="checkbox" />
          <span className="ml-1">Admin</span>
        </label>

        <label
          onChange={() => {
            setUserChecked(!userChecked);
            setLoading(true);
          }}
          className="ml-4"
        >
          <input type="checkbox" />
          <span className="ml-1">User</span>
        </label>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Address</th>
              <th className="p-3">Role</th>
              <th className="p-3">Actions</th>
              <th className="p-3">Time</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.phoneNumber}</td>
                <td className="p-3">{user.address}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium
                        ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-green-100 text-green-700"
                        }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setNewRole(user.role);
                      setRoleChange(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm"
                  >
                    Role
                  </button>
                  <button
                    onClick={() => {}}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-sm"
                  >
                    Delete
                  </button>
                </td>
                <td className="text-gray-500 text-[10px]">{user.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* this ispopup window */}
      {roleChange && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm rounded-xl p-6 shadow-xl space-y-4">
            <h3 className="text-xl font-semibold">Change User Role</h3>

            <p className="text-sm text-gray-600">
              User: <span className="font-medium">{selectedUser.email}</span>
            </p>

            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={newRole === "admin"}
                  onChange={(e) => setNewRole(e.target.value)}
                />
                <span>Admin</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={newRole === "user"}
                  onChange={(e) => setNewRole(e.target.value)}
                />
                <span>User</span>
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setRoleChange(false)}
                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  updateUserRole(selectedUser.userId, newRole);
                  setRoleChange(false);
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
