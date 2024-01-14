import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";

import PageWrapper from "../../pageComponents/pageWrapper";
import api from "../../../utils/api";

import "./users.scss"


const Users = ({logout}) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getLessons = async () => {
      const res = await api.post('/users/get-users');
      setUsers(res.data);
    }
    getLessons().catch((err) => console.error(err))

  }, []);

  return (
    <PageWrapper logout={() => logout()}>
      <section className="users-wrapper">
        {users}
      </section>
    </PageWrapper>

  );
}

Users.propTypes = {
  logout: PropTypes.func.isRequired,
};

export default Users;
