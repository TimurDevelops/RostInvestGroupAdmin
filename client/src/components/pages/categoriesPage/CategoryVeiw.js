import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import PropTypes from "prop-types";
import {FaUsers} from "react-icons/fa";
import {FaDeleteLeft} from "react-icons/fa6";
import {IoMdCreate} from "react-icons/io";
import Button from "@mui/material/Button";

import AlertTypes from "../../ui/AlertTypes";
import PageWrapper from "../../pageComponents/PageWrapper";
import Table from "../../ui/Table";
import Dialog from "../../ui/Dialogs";

import api from "../../../utils/api";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

// import "./UserView.scss"


const CategoryView = ({logout, setAlerts, currentUser}) => {
  const [categoryColumns] = useState([
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
  const [productsColumns] = useState([
    {
      id: "select-products",
      type: "select",
      flex: "0 0 6.25%"
    }, {
      id: "title",
      type: "link",
      link: "product-view/",
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
      id: "delete-product",
      empty: true,
      type: "delete",
      flex: "0 0 6.25%"
    }
  ]);
  const {categoryId} = useParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [subcategories, setSubcategories] = useState([]);
  const [deleteCategoriesConfirmDialogOpen, setDeleteCategoriesConfirmDialogOpen] = useState(false);
  const [categoriesForDeletion, setCategoriesForDeletion] = useState([]);
  const [deleteProductsConfirmDialogOpen, setDeleteProductsConfirmDialogOpen] = useState(false);
  const [productsForDeletion, setProductsForDeletion] = useState([]);

  const [title, setTitle] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categoryImage, setCategoryImage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await editCategory({
        id: currentUser.id,
        title,
        parentCategory,
        categoryImage,
      });
      if (res.success === true) {
        setAlerts([{msg: "Данные успешно отредактированны", type: AlertTypes.SUCCESS}])
      } else {
        setAlerts(res.errors.map(error => ({msg: error, type: AlertTypes.DANGER})))
      }
    } catch (errors) {
      console.error(errors)
      setAlerts([{msg: "Произошла непредвиденная ошибка!", type: AlertTypes.DANGER}])
    }
  }

  const editCategory = async (data) => {
    try {
      // TODO check if 401 error is working properly
      const res = await api.post("/categories/edit-category", data);
      return res.data;
    } catch (e) {
      console.error(e)
      return {success: false, errors: e.response.data.errors}
    }
  }

  // SUBCATEGORY STAFF
  const selectCategory = (productId) => {
    setSubcategories(subcategories.map((item) => {
      if (item.id === productId) {
        return {...item, checked: !item.checked}
      }
      return item
    }));
  }
  const selectAllCategories = (value) => {
    setSubcategories(subcategories.map((item) => {
      return {...item, checked: value}
    }));
  }

  const confirmDeleteCategory = (productId) => {
    setCategoriesForDeletion([{id: productId}])
    setDeleteCategoriesConfirmDialogOpen(true);
  }
  const confirmDeleteCategories = () => {
    const checkedProducts = subcategories.filter(product => product.checked)
    setCategoriesForDeletion(checkedProducts.map(product => ({id: product.id})))
    setDeleteCategoriesConfirmDialogOpen(true);
  }

  const handleDeleteCategory = async () => {
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

  // PRODUCTS STAFF
  const selectProduct = (productId) => {
    setProducts(products.map((item) => {
      if (item.id === productId) {
        return {...item, checked: !item.checked}
      }
      return item
    }));
  }
  const selectAllProducts = (value) => {
    setProducts(products.map((item) => {
      return {...item, checked: value}
    }));
  }

  const confirmDeleteProduct = (productId) => {
    setProductsForDeletion([{id: productId}])
    setDeleteCategoriesConfirmDialogOpen(true);
  }
  const confirmDeleteProducts = () => {
    const checkedProducts = products.filter(product => product.checked)
    setProductsForDeletion(checkedProducts.map(product => ({id: product.id})))
    setDeleteProductsConfirmDialogOpen(true);
  }

  const handleDeleteProduct = async () => {
    try {
      const res = await deleteProducts({users: productsForDeletion})
      if (res.success === true) {
        setAlerts([{msg: "Продукт удален.", type: AlertTypes.SUCCESS}])
      } else {
        setAlerts(res.errors.map(error => ({msg: error, type: AlertTypes.DANGER})))
      }
    } catch (errors) {
      console.error(errors)
      setAlerts([{msg: "Произошла непредвиденная ошибка!", type: AlertTypes.DANGER}])
    }
  }

  const deleteProducts = async (data) => {
    try {
      // TODO check if 401 error is working properly
      const res = await api.delete("/products", data);
      return res.data;
    } catch (e) {
      console.error(e)
      return {success: false, errors: e.response.data.errors};
    }
  }


  useEffect(() => {
    const getCategory = async () => {
      // TODO check if 401 error is working properly
      const res = await api.post("/categories/get-category", {categoryId});
      const category = res.data["category"]
      setTitle(category["title"])
      setParentCategory(category["parent_category_id"])
      setCategoryImage(category["category_image"])
    }
    const getCategories = async () => {
      const res = await api.post("/categories/get-categories");
      const categories = res.data["categories"]
      setCategories(categories)
    }
    const getSubCategories = async () => {
      const res = await api.post("/categories/get-categories-by-parent", {categoryId});
      const categories = res.data["categories"]
      setSubcategories(categories)
    }
    const getProducts = async () => {
      const res = await api.post("/products/get-products-by-parent", {categoryId});
      const products = res.data["products"]
      setProducts(products)
    }

    getCategory().catch((err) => console.error(err))
    getCategories().catch((err) => console.error(err))
    getSubCategories().catch((err) => console.error(err))
    getProducts().catch((err) => console.error(err))
  }, []);

  return (
    <PageWrapper logout={() => logout()}>
      <Dialog
        open={deleteCategoriesConfirmDialogOpen}
        title={"Подтвердите удаление категорий"}
        message={`Количество удаляемых категорий: ${categoriesForDeletion.length}`}
        actions={[
          <Button key={"cancel-delete-btn"}
                  onClick={() => setDeleteCategoriesConfirmDialogOpen(false)}>Отменить</Button>,
          <Button key={"confirm-delete-btn"} onClick={() => handleDeleteCategory()}>Подтвердить</Button>
        ]}
        handleClose={() => setDeleteCategoriesConfirmDialogOpen(false)}
      />
      <Dialog
        open={deleteProductsConfirmDialogOpen}
        title={"Подтвердите удаление продуктов"}
        message={`Количество удаляемых продуктов: ${productsForDeletion.length}`}
        actions={[
          <Button key={"cancel-delete-btn"} onClick={() => setDeleteProductsConfirmDialogOpen(false)}>Отменить</Button>,
          <Button key={"confirm-delete-btn"} onClick={() => handleDeleteProduct()}>Подтвердить</Button>
        ]}
        handleClose={() => setDeleteCategoriesConfirmDialogOpen(false)}
      />
      <div className="section-bg">
        <section className="section-wrapper user-form-section-wrapper">
          <div className="section-header">
            <h4 className="section-header-title">
              <span className="section-header-icon"><FaUsers/></span>
              <span className="section-header-text">Информация о категории:</span>
            </h4>
          </div>

          <form className="login-form" onSubmit={e => handleSubmit(e)}>

            <div className="inputs-wrapper">
              <div className="form-group field">
                <input type="input" className="form-field" placeholder="Наименование категории" name="title" id="title"
                       value={title}
                       onChange={e => setTitle(e.target.value)} required/>
                <label htmlFor="title" className="form-label">Наименование категории*</label>
              </div>

              <FormControl style={{minWidth: 300}} variant="standard">
                <InputLabel id="category-select-label">Категория</InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  value={parentCategory}
                  label="Age"
                  onChange={e => setParentCategory(e.target.value)}
                >
                  {
                    categories.map(item => <MenuItem value={item.id}>item.title</MenuItem>)
                  }
                </Select>
              </FormControl>

              <div className="form-group field">
                {/*TODO change*/}
                <input type="text" className="form-field" placeholder="Категория" name="parentCategory"
                       id="parentCategory"
                       value={parentCategory}
                       onChange={e => setParentCategory(e.target.value)}/>
                <label htmlFor="parentCategory" className="form-label">Категория</label>
              </div>

              <div className="form-group field">
                <input type="text" className="form-field" placeholder="Картинка" name="categoryImage" id="categoryImage"
                       value={categoryImage}
                       onChange={e => setCategoryImage(e.target.value)}/>
                <label htmlFor="categoryImage" className="form-label">Картинка</label>
              </div>

            </div>

            <div className="submit-btn-wrapper ">
              <button type="submit" className="submit-btn">
                <span><IoMdCreate/>Изменить</span>
              </button>
            </div>
          </form>

          <div className="section-header">
            <h4 className="section-header-title">
              <span className="section-header-icon"><FaUsers/></span>
              <span className="section-header-text">Подкатегории:</span>
            </h4>
          </div>
          <div className="table-controls">
            {/*TODO rename from user and move styles*/}
            <div className={"create-item-button red"}>
              <span className="table-controls-icon"><FaDeleteLeft/></span>
              <span className="table-controls-text" onClick={() => {
                confirmDeleteCategories()
              }}>Удалить выбранные</span>
            </div>
          </div>
          <Table data={subcategories} columns={categoryColumns}
                 deleteItem={confirmDeleteCategory}
                 selectItem={selectCategory}
                 selectAll={selectAllCategories}/>

          <div className="section-header">
            <h4 className="section-header-title">
              <span className="section-header-icon"><FaUsers/></span>
              <span className="section-header-text">Продукты в категории:</span>
            </h4>
          </div>
          <div className="table-controls">
            {/*TODO rename from user and move styles*/}
            <div className={"create-item-button red"}>
              <span className="table-controls-icon"><FaDeleteLeft/></span>
              <span className="table-controls-text" onClick={() => {
                confirmDeleteProducts()
              }}>Удалить выбранные</span>
            </div>
          </div>
          <Table data={products} columns={productsColumns}
                 deleteItem={confirmDeleteProduct}
                 selectItem={selectProduct}
                 selectAll={selectAllProducts}/>

          <div className="back-btn-wrapper">
            <Link to={"/products"}>
              <div className="back-btn">
                <span className="arrows">
                  <span className="top-arrow-line"/>
                  <span className="center-arrow-line"/>
                  <span className="bottom-arrow-line"/>
                </span>
                <span className="back-text">
                  Вернуться к списку категорий
                </span>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}

CategoryView.propTypes = {
  logout: PropTypes.func.isRequired,
  setAlerts: PropTypes.func.isRequired,
};

export default CategoryView;