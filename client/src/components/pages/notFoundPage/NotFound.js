import React from "react";

import Background from "../../pageComponents/Background";

import "./NotFound.scss"
import {useNavigate} from "react-router-dom";


const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Background>
      <div className="not-found-wrapper">
        <div className="not-found-holder">
          <div className="not-found-tag"><span>404</span></div>
          <div className="not-found-label"><span>Страница не найдена</span></div>
          <div className="not-found-link" onClick={() => {
            navigate("/users")
          }}><span>На главную</span></div>
        </div>
      </div>
    </Background>
  );
}


export default NotFound;
