import React, { useEffect, useState } from 'react';
import AdminLayout from '../layout/AdminLayout';
import { Link } from 'react-router-dom';
import { useDeleteUserMutation, useGetAdminUsersQuery } from "../redux/api/userApi.js";
import toast from "react-hot-toast";
import Loader from "../layout/Loader.jsx";

const Users = () => {
  const { data, isLoading, error } = useGetAdminUsersQuery();
  const [deleteUser, { isLoading: deleteIsLoading, error: deleteError, isSuccess }] = useDeleteUserMutation();
  const users = data?.users || [];

  // 🔍 Added states for search
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (deleteError) {
      toast.error(deleteError?.data?.message);
    }
    if (isSuccess) {
      toast.success("User Deleted");
    }
  }, [error, isSuccess, deleteError]);

  useEffect(() => {
    setFilteredUsers(users);
  }, [data]);

  const deleteUserHandler = (id) => {
    deleteUser(id);
  };

const handleSearch = () => {
  const q = searchTerm.trim().toLowerCase();
   if (q === '') {
    setFilteredUsers(users);
    return;
  }
  const result = users.filter((u) => {
    if (u._id && String(u._id).toLowerCase().includes(q)) return true;
    if (u.email && u.email.toLowerCase().includes(q)) return true;
    const first =
      (u.first || u.firstName || u.firstname || u.givenName || '').toString().trim();
    const last =
      (u.last || u.lastName || u.lastname || u.familyName || '').toString().trim();
    const singleName = (u.name || u.fullName || u.displayName || '').toString().trim();
    const fullName = `${first} ${last}`.trim();
    const nameToCheck = (singleName || fullName || first || last).toLowerCase();
    if (nameToCheck && nameToCheck.includes(q)) return true;
    return false;
  });

  setFilteredUsers(result);
};

  if (isLoading) return <Loader />;

  return (
    <>
      <AdminLayout>
        <h1 class="text-center mt-2">{data?.users?.length} Users</h1>

        {/* 🔍 Search Bar */}
        <div className="input-group" id="aqua5">
          <input
            type="text"
            className="form-control"
            id="aqua3"
            placeholder="Search by ID, Name, or Email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="input-group-text"
            id="aqua4"
            onClick={handleSearch}
          >
            <i className="bi bi-search"></i>
          </button>
        </div>

        {filteredUsers?.map((user) => (
          <div id="productItem" key={user._id}>
            <div class="row">
              <div class="col-12 col-lg-3 col-md-3 col-sm-3 text-center">
                <p>Id #{user._id}</p>
                <p id="c99">{user?.email}</p>
              </div>
              <div class="col col-lg-3 col-md-3 col-sm-3" id="w2">
                <p>
                  {user?.first} {user?.last}{' '}
                  <b>
                    <p id="w1">({user?.role})</p>
                  </b>
                </p>
              </div>
              <div class="col col-lg-3 col-md-3 col-sm-3">
                <img
                  src={user?.avatar?.url || "/images/default_avatar.jpg"}
                  id="ki2"
                />
              </div>
              <div class="col col-lg-3 col-md-3">
                <Link to={`/admin/users/${user?._id}`}>
                  <p id="q1">
                    <i class="bi bi-pencil-fill"></i>
                  </p>
                </Link>
                <Link>
                  <button
                    id="q3"
                    onClick={() => deleteUserHandler(user?._id)}
                    disabled={deleteIsLoading}
                  >
                    <i class="bi bi-trash-fill"></i>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </AdminLayout>
    </>
  );
};

export default Users;
