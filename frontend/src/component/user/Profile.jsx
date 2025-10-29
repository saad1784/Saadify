import React from 'react';
import {useSelector} from 'react-redux';
import UserLayout from '../layout/UserLayout';

const Profile=()=>{
    const {user}=useSelector((state)=>state.user);
    return<UserLayout>
        <div class="row justify-content-around mt-5 user-info">
      <div  id="f1">
        <figure class="avatar avatar-profile">
          <img
            class="round"
            src={user?.avatar ? user?.avatar?.url : "/images/default_avatar.jpg"}
            alt={user?.first}
          />
        </figure>
      </div>

      <div id="f2">
        <h4><b>Full Name</b></h4>
        <p id="ress">{user?.first} {user?.last}</p>

        <h4><b>Email Address</b></h4>
        <p id="ress">{user?.email}</p>

        <h4><b>Joined On</b></h4>
        <p id="ress">{user?.createdAt?.substring(0,10)}</p>
      </div>
    </div>
    </UserLayout>
}
export default Profile;