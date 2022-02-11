import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import jwt from 'jwt-decode';
import {getCookie} from '../utils';
import { updateJWTToken } from '../utils';

export default function CreateStory() {
    const isLogin = localStorage.getItem('isLogin');
    const jwtToken = localStorage.getItem('access');
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [shortInfo, setShortInfo] = useState("");
    const [image, setImage] = useState("");
    const [category, setCategory] = useState("");
    const [text, setText] = useState("");
    const [categories, setCategories] = useState("");
    const [errors, setErrors] = useState([]);
    const csrfToken = getCookie('csrftoken');

    useEffect(() => {
        if(!(isLogin && jwtToken)){
            navigate('/');
        }else{
            const fetchDataCats = async () => {
                try{
                    const response = await fetch('http://localhost:8000/api/v1/categories/').then(res => res.json());
                    setCategories(response);
                }catch(error){
                    console.log(error);
                }
            }
            fetchDataCats();
        }
    }, [isLogin, jwtToken, navigate])

    const renderSelectItems = () => {
        const listOfCategories = categories;
        if(listOfCategories){
            return listOfCategories.map(item => (
                <option value={item.id}>{item.title}</option>
            ))
        }
    }

    const handleTitle = (event) => {
        setTitle(event.target.value);
    }

    const handleShortInfo = (event) => {
        setShortInfo(event.target.value);
    }

    const handleImage = (event) => {
        if(event.target.files && event.target.files[0]){
            setImage(event.target.files[0]);
        }
    }

    const handleCategory = (event) => {
        setCategory(event.target.value);
    }

    const handleText = (event) => {
        setText(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(title.trim() !== "" && shortInfo.trim() !== "" && text.trim() !== "" && image !== "" && category !== ""){
            updateJWTToken();
            const fetchData = async () => {
                try{
                    const formData = new FormData();
                    const creator = jwt(jwtToken).user_id || null;
                    formData.append('title', title.trim());
                    formData.append('shortinfo', shortInfo.trim());
                    formData.append('text', text.trim());
                    formData.append('image', image, image.name);
                    formData.append('category', category);
                    formData.append('creator', creator);
                    const requestOptions = {
                        method: 'POST',
                        headers: {
                            // 'Content-Type': 'multipart/form-data; boundary;',
                            'Authorization': `JWT ${jwtToken}`,
                            'Accept': 'application/json',
                            'X-CSRFToken': csrfToken},
                        body: formData
                    }

                    const response = await fetch('http://localhost:8000/api/v1/story/create/', requestOptions);
                    if(response.ok){
                        navigate('/')
                    }
                }catch(error){
                    console.log(error);
                }
            }

            fetchData();
        }else{
            setErrors('Все поля должны быть заполнены.');
        }
    }

  return (
    <div className="story-create-div">
            <form className="story-create-form" >
                    <div className="stories-theme-div">
                        <h4 className="stories-theme">
                            Создание истории...
                        </h4>
                    </div>
        <div className="story-create-field">
            <p className="errors">{errors}</p>
            <div className="story-create-title-slogan-div">
                <div className="story-create-title-div input-blocks">
                    <label htmlFor="id_title" className="story-create-labels">Заголвок</label>
                    <input type="text" name="title" className="story-create-input" maxLength="150" required="" id="id_title" onChange={handleTitle} value={title} />
                </div>
                <div className="story-create-slogan-div input-blocks">
                    <label htmlFor="id_shortinfo" className="story-create-labels">Слоган</label>
                    <input type="text" name="shortinfo" className="story-create-input" maxLength="150" required="" id="id_shortinfo" onChange={handleShortInfo} value={shortInfo} />
                </div>
            </div>
            <div class="story-create-text-div input-blocks">
                <script src="/static/ckeditor/ckeditor-init.js" data-ckeditor-basepath="/static/ckeditor/ckeditor/" id="ckeditor-init-script"></script>
                <script src="/static/ckeditor/ckeditor/ckeditor.js"></script>
                <label for="id_text" class="story-create-labels">Содержание</label>
                <div class="django-ckeditor-widget" data-field-id="id_text">
                    <textarea name="text" id="" cols="108" rows="10" onChange={handleText} value={text}></textarea>
                </div>
            </div>
            <br/>
            <div className="story-create-title-slogan-div">
                <div className="story-create-image-div input-blocks">
                    <label htmlFor="id_image" className="story-create-labels">Постер</label>
                    <input type="file" name="image" multiple="" className="story-create-image" required="" id="id_image" onChange={handleImage} />
                    {image && (
                        <img src={URL.createObjectURL(image)} alt="" width="250px" />
                    )}
                </div>
                <div className="story-create-category-div input-blocks">
                    <label htmlFor="id_category" className="story-create-labels">Категория</label>
                    <select name="category" required="" id="id_category" onChange={handleCategory}>
                        <option defaultValue>Выберите категорию</option>
                        {renderSelectItems()}
                    </select>
                </div>
            </div>
            <br/>
            <div className="story-create-btn-div">
                <input type="submit" name="submit" value="Создать" onClick={handleSubmit} className="create-btn auth-form-enter" />
            </div>
        </div>
    </form>
    </div>
);
}
