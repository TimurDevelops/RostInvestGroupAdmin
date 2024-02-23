import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {FaCheck, FaBan, FaSearch} from "react-icons/fa";
import {FaTrashAlt} from "react-icons/fa";


import "./Table.scss"


const Table = ({data, columns, selectItem, selectAll, deleteItem}) => {
  const [allItemsSelected, setAllItemsSelected] = useState(false);
  const [sortingColumn, setSortingColumn] = useState({id: "", order: "ASC"});
  const [filterValue, setFilterValue] = useState();

  const [displayedData, setDisplayedData] = useState([])

  useEffect(() => {
    setDisplayedData(data.filter(item => {
      for (const value of Object.values(item)) {
        if (value.lower().includes(value.lower())) return true
      }
      return false
    }).sort((a, b) => {
      if (sortingColumn.order === "ASC") {
        return a[sortingColumn.id] < b[sortingColumn.id]
      } else {
        return a[sortingColumn.id] >= b[sortingColumn.id]
      }
    }))
  }, [data, sortingColumn, filterValue])

  const changeSortingOrder = (column) => {
    setSortingColumn({
      id: column.id,
      type: column.id === sortingColumn.id ? sortingColumn.type === "ASC" ? "DES" : "ASC" : "ASC"
    })
  }

  const handleSelectAll = () => {
    const newSetAllItemsSelected = !allItemsSelected
    setAllItemsSelected(newSetAllItemsSelected)
    selectAll(newSetAllItemsSelected)
  }
  const handleSelectItem = (e, itemId) => {
    if (e.target.checked) {
      const uncheckedItems = displayedData.filter(item => item.id !== itemId && !item.checked)
      if (uncheckedItems.length === 0 && !allItemsSelected) {
        setAllItemsSelected(true)
      }
    } else {
      if (allItemsSelected) {
        setAllItemsSelected(false)
      }
    }
    selectItem(itemId)
  }

  const getRowItem = (column, item) => {
    if (column.type === "select") {
      return <input className="table-checkbox" type="checkbox" name="select" id={`select-${item.id}`}
                    checked={item.checked}
                    onChange={(e) => handleSelectItem(e, item.id)}
      />;
    } else if (column.type === "link") {
      return <Link to={`${column.link}${item.id}`}>{item[column.id]}</Link>;
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
                    checked={allItemsSelected}
                    onChange={handleSelectAll}
      />;
    } else {
      return (
        <div className="row-header">
          <div className="row-header-title">{column.label}</div>
          <div className="sort-order-arrows" onClick={() => changeSortingOrder(column)}>
            {
              column.id === sortingColumn.id ?
                sortingColumn.type === "ASC" ? "DOWN" : "UP"
                : "UP DOWN"
            }
          </div>
        </div>
      );
    }
  }

  return (
    <div className="table-wrapper">

      <div className="form-group field">
        <input type="password" className="form-field" placeholder="Пароль" name="table-search"
               onChange={e => setFilterValue(e.target.value)}/>
        <label htmlFor="password" className="form-label">
          <div className="m-glass">
            <FaSearch/>
          </div>
          <div className="table-search-title">
            Поиск
          </div>
        </label>
      </div>


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
        displayedData.map(item => (
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
  data: PropTypes.arrayOf(Object).isRequired,
  columns: PropTypes.array.isRequired,
  selectItem: PropTypes.func.isRequired,
  selectAll: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired
};

export default Table;
