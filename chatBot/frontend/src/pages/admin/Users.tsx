import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "../../types/types";
import { Loader2, Trash2 } from "lucide-react"; // 🗑 Import trash icon

const Users = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [page, perPage, searchQuery]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const endpoint = searchQuery
        ? `http://localhost:5000/api/admin/search_users?query=${searchQuery}&page=${page}&per_page=${perPage}`
        : `http://localhost:5000/api/admin/users?page=${page}&per_page=${perPage}`;
      const response = await axios.get(endpoint);
      setUsers(response.data.users);
      setTotalUsers(response.data.total);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/admin/delete_user/${userId}`
      );
      setUsers((current) => current.filter((u) => u.id !== userId));
      setTotalUsers((current) => current - 1);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const totalPages = Math.ceil(totalUsers / perPage);

  return (
    <div className="p-6">
      {/* Search + PerPage Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="flex gap-2 mb-2 md:mb-0">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => {
              setPage(1);
              setSearchQuery(e.target.value);
            }}
            className="border border-gray-300 rounded-md px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <select
            value={perPage}
            onChange={(e) => {
              setPage(1);
              setPerPage(Number(e.target.value));
            }}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {[5, 10, 20, 30, 50].map((num) => (
              <option key={num} value={num}>
                {num} per page
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 />
        </div>
      ) : users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-blue-100">
                <th className="py-3 px-6 text-left font-bold text-gray-700">
                  Name
                </th>
                <th className="py-3 px-6 text-left font-bold text-gray-700">
                  Email
                </th>
                <th className="py-3 px-6 text-left font-bold text-gray-700">
                  Latitude
                </th>
                <th className="py-3 px-6 text-left font-bold text-gray-700">
                  Longitude
                </th>
                <th className="py-3 px-6 text-center font-bold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: User) => (
                <tr key={user.id} className="border-t hover:bg-gray-100">
                  <td className="py-3 px-6">{user.name}</td>
                  <td className="py-3 px-6">{user.email}</td>
                  <td className="py-3 px-6">{user.lat}</td>
                  <td className="py-3 px-6">{user.lon}</td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-red-500 hover:text-red-700 hover:cursor-pointer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className={`px-4 py-2 rounded-md font-semibold ${
                page === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className={`px-4 py-2 rounded-md font-semibold ${
                page === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-600 text-lg">No users found</div>
      )}
    </div>
  );
};

export default Users;
