import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { useCallback, useEffect, useState } from "react";

import http from "../utils/http";
import { User } from "../types";
import { useModal } from "../hooks/useModal";
import SaveUser from "../components/users/SaveUser";
import DeleteUser from "../components/users/DeleteUser";
import Pagination from "../components/common/Pagination";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const { modal, triggerModal, closeModal } = useModal();

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await http.get(`/users?page=${currentPage}&perPage=${perPage}`);

      setUsers(response.data.data);
      setCurrentPage(response.data.paginationInfo.currentPage);
      setLastPage(response.data.paginationInfo.lastPage);
      setPerPage(response.data.paginationInfo.perPage);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, perPage]);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, perPage, fetchUsers]);

	const closeAndRefetch = () => {
		closeModal();
		fetchUsers();
	};

  const addUserModal = () => {
    triggerModal("Add User", <SaveUser mode="CREATE" onSuccess={closeAndRefetch} />)
  };

  const editUserModal = (selectedUser: User) => {
    triggerModal("Edit User", <SaveUser mode="EDIT" onSuccess={closeAndRefetch} user={selectedUser} />);
  };

  const deleteUserModal = (selectedUser: User) => {
		triggerModal("Delete User", <DeleteUser user={selectedUser!} onSuccess={closeAndRefetch} />);
  };

  return (
    <div className="flex flex-col h-full w-full items-center">
      {modal}
      <div className="flex w-full justify-between items-center h-[75px]">
        <h1 className="text-2xl font-bold text-gray-700">Users</h1>
        <button
          className="rounded-md px-6 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-md"
          onClick={addUserModal}
        >
          Add Users
        </button>
      </div>
      {isLoading ? (
        <p>Loading</p>
      ) : users.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-500">No users found</p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-md">
          <table className="min-w-full border">
            <thead className="sticky top-0 bg-gray-100 z-10">
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Gender</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-all">
                  <td className="px-6 py-2 text-sm text-gray-800">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="px-6 py-2 text-sm text-gray-800">{user.email}</td>
                  <td className="px-6 py-2 text-sm text-gray-800">
                    {user.gender === "male" ? "Male" : user.gender === "female" ? "Female" : "Other"}
                  </td>
                  <td className="px-6 py-2 text-sm text-gray-800">
                    {user.role === "super_admin" ? "Super Admin" : user.role === "artist_manager" ? "Artist Manager" : "Artist"}
                  </td>
                  <td>
                    <button
											className="p-2 rounded-md text-blue-500 hover:text-blue-600 hover:bg-blue-100 transition-all"
                      onClick={() => editUserModal(user)}
                    >
                      <FaPencil />
                    </button>
                    <button
                      className="p-2 rounded-md text-blue-500 hover:text-blue-600 hover:bg-blue-100 transition-all"
                      onClick={() => deleteUserModal(user)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination currentPage={currentPage} lastPage={lastPage} onPageChange={setCurrentPage} />
    </div>
  );
};

export default Users;
