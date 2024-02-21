import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {FaBan, FaCheck, FaUsers} from "react-icons/fa";
import {Link, useParams} from "react-router-dom";
import {IoIosArrowRoundBack} from "react-icons/io";

import PageWrapper from "../../pageComponents/PageWrapper";

import api from "../../../utils/api";

import "./UserView.scss"


const CreateUser = ({logout}) => {
  const {userId} = useParams();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      // TODO check if 401 error is working properly
      const res = await api.post("/users/get-user", {userId});
      const user = res.data["user"]
      setUsername(user["username"])
      setEmail(user["email"])
      setName(user["name"])
      setIsAdmin(user["isAdmin"])
    }
    getUser().catch((err) => console.error(err))
  }, []);

  return (
    <PageWrapper logout={() => logout()}>
      <div className="section-bg">
        <section className="section-wrapper">
          <div className="section-header">
            <h4 className="section-header-title">
              <span className="section-header-icon"><FaUsers/></span>
              <span className="section-header-text">Информация о пользователе:</span>
            </h4>
          </div>

          <div className="info-wrapper">
            <div className="info-group">
              <div className="info-label">Логин:</div>
              <div className="info-text">{username}</div>
            </div>

            <div className="info-group">
              <div className="info-label">Почта:</div>
              <div className="info-text">{email}</div>
            </div>

            <div className="info-group">
              <div className="info-label">Имя пользователя:</div>
              <div className="info-text">{name}</div>
            </div>

            <div className="info-group">
              <div className="info-label">Администратор:</div>
              <div className="info-text">
                {
                  isAdmin ? <span className="center green"><FaCheck/></span> :
                    <span className="center red"><FaBan/></span>
                }
              </div>
            </div>
          </div>
          <div className="back-btn-wrapper">
            <Link to={"/users"}>
              <div className="back-btn">
                <span className="arrows">
                  <span className="top-arrow-line"/>
                  <span className="center-arrow-line"/>
                  <span className="bottom-arrow-line"/>
                </span>
                <span className="back-text">
                  Вернуться к списку пользователей
                </span>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}

CreateUser.propTypes = {
  logout: PropTypes.func.isRequired,
  setAlerts: PropTypes.func.isRequired,
};

export default CreateUser;

