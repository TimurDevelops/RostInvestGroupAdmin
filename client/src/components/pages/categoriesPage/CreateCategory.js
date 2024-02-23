import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {FaUsers} from "react-icons/fa";
import {Link} from "react-router-dom";
import {IoMdCreate} from "react-icons/io";

import PageWrapper from "../../pageComponents/PageWrapper";

import api from "../../../utils/api";
import AlertTypes from "../../ui/AlertTypes";

// import "./UserView.scss"


const CreateCategory = ({logout, setAlerts, currentUser}) => {
  const [categories, setCategories] = useState([]);

  const [title, setTitle] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categoryImage, setCategoryImage] = useState("");

  useEffect(() => {
    const getCategory = async () => {
      const res = await api.post("/categories/get-categories");
      const categories = res.data["categories"]
      setCategories(categories)
    }
    getCategory().catch((err) => console.error(err))
  }, []);

  const createCategory = async (data) => {
    try {
      // TODO check if 401 error is working properly
      const res = await api.post("/products", data);
      return res.data;
    } catch (e) {
      console.error(e)
      return {success: false, errors: e.response.data.errors}
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await createCategory({
        userId: currentUser.id,
        title,
        parentCategory,
        categoryImage,
      });
      if (res.success === true) {
        setAlerts([{msg: "Категория создана", type: AlertTypes.SUCCESS}])
      } else {
        setAlerts(res.errors.map(error => ({msg: error, type: AlertTypes.DANGER})))
      }
    } catch (errors) {
      console.error(errors)
      setAlerts([{msg: "Произошла непредвиденная ошибка!", type: AlertTypes.DANGER}])
    }
  }

  return (
    <PageWrapper logout={() => logout()}>
      <div className="section-bg">
        <section className="section-wrapper">
          <div className="section-header">
            <h4 className="section-header-title">
              <span className="section-header-icon"><FaUsers/></span>
              <span className="section-header-text">Создать новый продукт:</span>
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
                <span><IoMdCreate/>Создать</span>
              </button>
            </div>
          </form>

          <div className="back-btn-wrapper">
            <Link to={"/products"}>
              <div className="back-btn">
                <span className="arrows">
                  <span className="top-arrow-line"/>
                  <span className="center-arrow-line"/>
                  <span className="bottom-arrow-line"/>
                </span>
                <span className="back-text">
                  Вернуться к списку продуктов
                </span>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}

CreateCategory.propTypes = {
  logout: PropTypes.func.isRequired,
  setAlerts: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
};

export default CreateCategory;