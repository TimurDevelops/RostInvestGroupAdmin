import React from "react";

import "./Background.scss"


const Background = ({children}) => {

  return (
    <div className="background-holder">
      <div className="background-content">
        {children}
      </div>
      <div className="bg-colors"/>
    </div>
  );
}

export default Background;
