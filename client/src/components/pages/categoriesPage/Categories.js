import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {FaUsers} from "react-icons/fa";
import {IoMdCreate} from "react-icons/io";
import {FaDeleteLeft} from "react-icons/fa6";
import Button from "@mui/material/Button";

import AlertTypes from "../../ui/AlertTypes";
import Dialog from "../../ui/Dialogs";
import Table from "../../ui/Table";
import PageWrapper from "../../pageComponents/PageWrapper";

import api from "../../../utils/api";

// import "./Users.scss"


const Categories = ({logout, setAlerts}) => {
  const [categories, setCategories] = useState([]);
  const [columns] = useState([
    {
      id: "select-products",
      type: "select",
      flex: "0 0 6.25%"
    }, {
      id: "title",
      type: "link",
      link: "category-view/",
      label: "Продукт",
      flex: "0 0 12.5%"
    }, {
      id: "last_editor",
      label: "Пользователь",
      flex: "0 0 12.5%"
    }, {
      id: "create_date",
      type: "date",
      label: "Дата создания",
      flex: "0 0 18.75%"
    }, {
      id: "update_date",
      type: "date",
      label: "Дата последнего изменения",
      flex: "0 0 18.75%"
    }, {
      id: "delete-category",
      empty: true,
      type: "delete",
      flex: "0 0 6.25%"
    }
  ]);
  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false);
  const [categoriesForDeletion, setCategoriesForDeletion] = useState([]);

  const selectCategory = (productId) => {
    setCategories(categories.map((item) => {
      if (item.id === productId) {
        return {...item, checked: !item.checked}
      }
      return item
    }));
  }

  const selectAllCategories = (value) => {
    setCategories(categories.map((item) => {
      return {...item, checked: value}
    }));
  }

  const confirmDeleteCategory = (productId) => {
    setCategoriesForDeletion([{id: productId}])
    setDeleteConfirmDialogOpen(true);
  }
  const confirmDeleteCategories = () => {
    const checkedProducts = categories.filter(product => product.checked)
    setCategoriesForDeletion(checkedProducts.map(product => ({id: product.id})))
    setDeleteConfirmDialogOpen(true);
  }

  const handleDelete = async () => {
    try {
      const res = await deleteCategories({users: categoriesForDeletion})
      if (res.success === true) {
        setAlerts([{msg: "Категории удалены.", type: AlertTypes.SUCCESS}])
      } else {
        setAlerts(res.errors.map(error => ({msg: error, type: AlertTypes.DANGER})))
      }
    } catch (errors) {
      console.error(errors)
      setAlerts([{msg: "Произошла непредвиденная ошибка!", type: AlertTypes.DANGER}])
    }
  }

  const deleteCategories = async (data) => {
    try {
      // TODO check if 401 error is working properly
      const res = await api.delete("/categories", data);
      return res.data;
    } catch (e) {
      console.error(e)
      return {success: false, errors: e.response.data.errors};
    }
  }

  useEffect(() => {
    const getCategories = async () => {
      // TODO check if 401 error is working properly
      const res = await api.post("/categories/get-categories");
      setCategories(res.data["categories"].map((item) => {
        return {...item, checked: false}
      }));
    }
    getCategories().catch((err) => console.error(err))
  }, []);

  return (
    <PageWrapper logout={() => logout()}>
      <Dialog
        open={deleteConfirmDialogOpen}
        title={"Подтвердите удаление категорий"}
        message={`Количество удаляемых категорий: ${categoriesForDeletion.length}`}
        actions={[
          <Button key={"cancel-delete-btn"} onClick={() => setDeleteConfirmDialogOpen(false)}>Отменить</Button>,
          <Button key={"confirm-delete-btn"} onClick={() => handleDelete()}>Подтвердить</Button>
        ]}
        handleClose={() => setDeleteConfirmDialogOpen(false)}
      />

      <div className="section-bg">
        <section className="section-wrapper users-wrapper">
          <div className="section-header">
            <h4 className="section-header-title">
              <span className="section-header-icon"><FaUsers/></span>
              <span className="section-header-text">Категории</span>
            </h4>
          </div>

          <div className="table-controls">
            <div className="create-item-button">
              <span className="table-controls-icon"><IoMdCreate/></span>
              <span className="table-controls-text"><Link to={"create-category"}>Создать</Link></span>
            </div>
            {/*TODO rename from user and move styles*/}
            <div className={"create-item-button red"}>
              <span className="table-controls-icon"><FaDeleteLeft/></span>
              <span className="table-controls-text" onClick={() => {
                confirmDeleteCategories()
              }}>Удалить выбранные</span>
            </div>
          </div>

          <Table data={categories} columns={columns}
                 deleteItem={confirmDeleteCategory}
                 selectItem={selectCategory}
                 selectAll={selectAllCategories}/>
        </section>
      </div>
    </PageWrapper>
  );
}

Categories.propTypes = {
  logout: PropTypes.func.isRequired,
  setAlerts: PropTypes.func.isRequired
};

export default Categories;