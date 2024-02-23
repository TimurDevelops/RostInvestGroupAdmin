import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {FaUsers} from "react-icons/fa";
import {Link, useParams} from "react-router-dom";
import {IoMdCreate} from "react-icons/io";

import PageWrapper from "../../pageComponents/PageWrapper";

import api from "../../../utils/api";
import AlertTypes from "../../ui/AlertTypes";

// import "./UserView.scss"


const CreateProduct = ({logout, setAlerts, currentUser}) => {
  const [categories, setCategories] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productPrice, setProductPrice] = useState("");

  useEffect(() => {
    const getCategory = async () => {
      const res = await api.post("/categories/get-categories");
      const categories = res.data["categories"]
      setCategories(categories)
    }
    getCategory().catch((err) => console.error(err))
  }, []);

  const createProduct = async (data) => {
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
      const res = await createProduct({
        id: currentUser.id,
        title,
        description,
        category,
        productImage,
        productPrice,
      });
      if (res.success === true) {
        setAlerts([{msg: "Продукт создан", type: AlertTypes.SUCCESS}])
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
                <input type="input" className="form-field" placeholder="Наименование продукта" name="title" id="title"
                       value={title}
                       onChange={e => setTitle(e.target.value)} required/>
                <label htmlFor="title" className="form-label">Наименование продукта*</label>
              </div>

              <div className="form-group field">
                <input type="textarea" className="form-field" placeholder="Описание продукта" name="description" id="description"
                       value={description}
                       onChange={e => setDescription(e.target.value)} required/>
                <label htmlFor="description" className="form-label">Описание продукта*</label>
              </div>

              <div className="form-group field">
                {/*TODO change*/}
                <input type="text" className="form-field" placeholder="Категория" name="category" id="category"
                       value={category}
                       onChange={e => setCategory(e.target.value)}/>
                <label htmlFor="name" className="form-label">Категория</label>
              </div>

              <div className="form-group field">
                <input type="text" className="form-field" placeholder="Картинка" name="productImage" id="productImage"
                       value={productImage}
                       onChange={e => setProductImage(e.target.value)}/>
                <label htmlFor="productImage" className="form-label">Картинка</label>
              </div>

              <div className="form-group field">
                <input type="text" className="form-field" placeholder="Цена" name="productPrice" id="productPrice"
                       value={productPrice}
                       onChange={e => setProductPrice(e.target.value)}/>
                <label htmlFor="productPrice" className="form-label">Цена</label>
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

CreateProduct.propTypes = {
  logout: PropTypes.func.isRequired,
  setAlerts: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
};

export default CreateProduct;