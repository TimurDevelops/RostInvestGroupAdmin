import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {FaUsers} from "react-icons/fa";
import {Link, useParams} from "react-router-dom";
import {IoMdCreate} from "react-icons/io";
import {FormControl, InputLabel, MenuItem, Select, TextareaAutosize} from "@mui/material";
import ReactImagePickerEditor, { ImagePickerConf } from 'react-image-picker-editor';

import PageWrapper from "../../pageComponents/PageWrapper";
import AlertTypes from "../../ui/AlertTypes";

import api from "../../../utils/api";

// import "./UserView.scss"


const ProductView = ({logout, setAlerts}) => {
  const {productId} = useParams();
  const [categories, setCategories] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productPrice, setProductPrice] = useState("");

  const editProduct = async (data) => {
    try {
      // TODO check if 401 error is working properly
      const res = await api.post("/products/edit-product", data);
      return res.data;
    } catch (e) {
      console.error(e)
      return {success: false, errors: e.response.data.errors}
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await editProduct({
        id: productId,
        title,
        description,
        category,
        productImage,
        productPrice,
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

  useEffect(() => {
    const getProduct = async () => {
      // TODO check if 401 error is working properly
      const res = await api.post("/products/get-product", {productId});
      const user = res.data["product"]
      setTitle(user["title"])
      setDescription(user["description"])
      setCategory(user["parent_category_id"])
      setProductImage(user["product_image"])
      setProductPrice(user["product_price"])
    }
    const getCategory = async () => {
      const res = await api.post("/categories/get-categories", {productId});
      const categories = res.data["categories"]
      setCategories(categories)
    }
    getProduct().catch((err) => console.error(err))
    getCategory().catch((err) => console.error(err))
  }, []);

  return (
    <PageWrapper logout={() => logout()}>
      <div className="section-bg">
        <section className="section-wrapper user-form-section-wrapper">
          <div className="section-header">
            <h4 className="section-header-title">
              <span className="section-header-icon"><FaUsers/></span>
              <span className="section-header-text">Информация о продукте:</span>
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
                <TextareaAutosize className="form-field" placeholder="Описание продукта" name="description"
                                  id="description"
                                  value={description}
                                  onChange={e => setDescription(e.target.value)} required/>
                <label htmlFor="description" className="form-label">Описание продукта*</label>
              </div>

              <FormControl style={{minWidth: 300}} variant="standard">
                <InputLabel id="category-select-label">Категория</InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  value={category}
                  label="Age"
                  onChange={e => setCategory(e.target.value)}
                >
                  {
                    categories.map(item => <MenuItem value={item.id}>item.title</MenuItem>)
                  }
                </Select>
              </FormControl>

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
                <span><IoMdCreate/>Изменить</span>
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

ProductView.propTypes = {
  logout: PropTypes.func.isRequired,
  setAlerts: PropTypes.func.isRequired,
};

export default ProductView;