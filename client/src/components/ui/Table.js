import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {FaCheck, FaBan} from "react-icons/fa";
import {FaTrashAlt} from "react-icons/fa";


import "./Table.scss"


const Table = ({data, columns, deleteItem}) => {

  const selectAll = (e) => {
    //  TODO select all function
  }

  const getRowItem = (column, item) => {
    if (column.type === "select") {
      return <input className="table-checkbox" type="checkbox" name="select" id="select-all"/>;
    } else if (column.type === "link") {
      return <Link to={`${column.link}:${item.id}`}>{item[column.id]}</Link>;
    } else if (column.type === "checkbox") {
      return item[column.id] ? <span className="center green"><FaCheck/></span> :
        <span className="center red"><FaBan/></span>;
    } else if (column.type === "delete") {
      return <span className="table-delete-btn" onClick={() => deleteItem(item.id)}><FaTrashAlt/></span>;
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
  columns: PropTypes.array.isRequired,
  deleteItem: PropTypes.func.isRequired
};

export default Table;
