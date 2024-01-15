import React from "react";
import {FaCheck} from "react-icons/fa";
import {TiDelete} from "react-icons/ti";
import {IoIosClose} from "react-icons/io";

import PropTypes from "prop-types";


import "./Table.scss"
import {Link} from "react-router-dom";


const Table = ({data, columns}) => {

  const selectAll = (e) => {
    //  TODO select all function
  }

  const getRowItem = (column, item) => {
    if (column.type === "select") {
      return <input className="table-checkbox" type="checkbox" name="select" id="select-all"/>;
    } else if (column.type === "link") {
      return <Link to={`${column.link}:${item.id}`}>{item[column.id]}</Link>;
    } else if (column.type === "checkbox") {
      return item[column.id] ? <FaCheck/> : <IoIosClose/>;
    } else if (column.type === "select") {
      return <TiDelete/>;
    } else {
      return item[column.id];
    }
  }

  const getColumnItem = (column) => {
    if (column.empty === true) {
      return "";
    } else if (column.type === "select") {
      return <input className="table-checkbox" type="checkbox" name="select" id="select-all"
                    onClick={event => selectAll(event)}/>;
    } else {
      return column.label;
    }
  }

  return (

    <div className="table-wrapper">
      <div className="table-head">
        {
          columns.map(column => (
            <div className="table-head-item" style={{"flex": column.flex}} key={column.id}>
              {getColumnItem(column)}
            </div>
          ))
        }
      </div>
      {
        data.map(item => (
          <div className="table-row" key={item.id}>
            {
              columns.map(column => (
                <div className="table-row-item" style={{"flex": column.flex}} key={`${item.id}${column.id}`}>
                  {getRowItem(column, item)}
                </div>
              ))
            }
          </div>
        ))
      }
    </div>
  );
}

Table.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired
};

export default Table;
