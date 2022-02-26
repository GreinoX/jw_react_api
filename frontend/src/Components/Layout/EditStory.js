import React, {useEffect, useState, useRef} from 'react'
import {useNavigate, useParams} from 'react-router-dom';
import jwt from 'jwt-decode';
import { formatIntegers, updateJWTToken } from '../utils';
import Like from '../../static/icons/minimalistic_like.svg';
import View from '../../static/icons/views.svg';
import { useScrollToTop } from '../utils';

export default function EditStory() {
    const {url_id} = useParams();
    const [storyId, setStoryId] = useState("");
    const [title, setTitle] = useState("");
    const [shortInfo, setShortInfo] = useState("");
    const [text, setText] = useState("");
    const [image, setImage] = useState("");
    const [wasImage, setWasImage] = useState("");
    const [category, setCategory] = useState("");
    const [catTitles, setCatTitles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState("");
    const imageRef = useRef("");
    const jwtToken = localStorage.getItem('access');
    const isLogin = localStorage.getItem('isLogin');
    const profile = JSON.parse(localStorage.getItem('profile'));
    const navigate = useNavigate();

    useEffect(() => {
        if(url_id && profile && isLogin && jwtToken){
            const fetchData = async () => {
                try{

                    const jwtDecode = jwt(jwtToken);
                    const response = await fetch(`http://localhost:8000/api/v1/story/${url_id}`)
                    .then(res => res.json())
                    .then(data => {
                        if(jwtDecode.user_id === data.creator.id){
                            setStoryId(data.id);
                            setTitle(data.title);
                            setShortInfo(data.shortinfo);
                            setText(data.text || "");
                            setWasImage(data.image);
                            setCategory(data.category.id);
                            setIsLoading(true);
                        }else{
                            navigate('/');
                        }
                    });

                    const responseCategories = await fetch(`http://localhost:8000/api/v1/categories/`)
                    .then(res => res.json())
                    .then(categories => {
                        setCategories(categories);
                        setCatTitles(categories.map(item => {
                           return item.title
                        }));
                        document.title = "Просто Пиши | Редактирование истории"
                    }).catch(error => {
                        navigate('/');
                    });

                }catch(error){
                    localStorage.clear()
                    window.location.replace("/")
                }
            }
            fetchData();
        }else{
            localStorage.clear()
            window.location.replace("/");
        }
    }, [url_id])

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

    const handleText = (event) =>{
        setText(event.target.value);
        console.log(event.target.value)
    }

    const handleImage = (event) => {
        setImage(event.target.files[0]);
    }

    const handleCategory = (event) => {
        setCategory(event.target.value);
        console.log(event.target.value);
        console.log(category)
    }

    const handleRemoveImage = (event) => {
        setImage("");
        setWasImage("");
        imageRef.current.value = "";
    }
    
    const handleSubmit = (event) => {
        event.preventDefault();
        if(title.trim() === ""){
            setErrors("Название должно присутствовать.")
        }else if(text.trim() === ""){
            setErrors("История вряд ли бывает без текста.")
        }else if(!category){
            setErrors("Выберите категорию пожалуйста.")
        }else{
            const formData = new FormData();
            formData.append('title', title.trim());
            formData.append('shortinfo', shortInfo.trim());
            formData.append('text', text.trim());
            formData.append('image', image);
            formData.append('category', category);
            const fetchData = async () => {
                updateJWTToken();
                try{
                    const jwtDecode = jwt(jwtToken) || null;
                    if(jwtDecode){
                        formData.append("creator", jwtDecode.user_id);
                        const requestOptions = {
                            method: "PUT",
                            headers: {
                                "Authorization": `JWT ${jwtToken}`
                            },
                            body: formData
                        }
                        await fetch(`http://localhost:8000/api/v1/story/update/${storyId}`, requestOptions)
                        .then(res => res.json())
                        .then(data => {
                            navigate("/");
                        }).catch(error => {
                            console.log(error);
                        })
                    }
                }catch(error){
                    localStorage.clear();
                    window.location.replace("/");
                }
            }
            fetchData();
        }
    }


  return (
    <>
    {isLoading && (
        <div className="story-create-div">
        <form className="story-create-form" >
            <div className="stories-theme-div">
                <h4 className="stories-theme">
                    Редактирование истории
                </h4>
            </div>
            <div className="story-create-field">
                <p className="errors">{errors}</p>
                <div className="story-create-title-slogan-div">
                    <div className="story-create-title-div input-blocks">
                        <label htmlFor="id_title" className="story-create-labels">Название</label>
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
                    <div className="story-create-image-div input-blocks" style={{height: "100px"}}>
                        <label htmlFor="id_image" className="story-create-labels">Постер</label>
                        <div className="actions-with-image">
                        <label htmlFor="id_image" className="story-action" style={{display: "block", width: "120px"}}>Загрузить файл</label>
                        <label htmlFor="" className="remove-image" onClick={handleRemoveImage}>Убрать</label>
                        </div>
                        <input type="file" name="image" multiple="" className="story-create-image" ref={imageRef} required="" id="id_image" onChange={handleImage} hidden/>
                    </div>
                    <div className="story-create-category-div input-blocks">
                        <label htmlFor="id_category" className="story-create-labels">Категория</label>
                        <select name="category" required="" id="id_category" value={category} onChange={handleCategory}>
                            <option defaultValue value="">Выберите категорию</option>
                            {renderSelectItems()}
                        </select>
                    </div>
                </div>
                <div className="story" style={{backgroundImage: `url(${image ? URL.createObjectURL(image) : wasImage ? wasImage : '/media/stories/standart.png'})`}}>
                            <div className="black"></div>
                            <div className="story-category-div">
                                <p className="story-category">{category.title ? category.title : catTitles[category - 1]}</p>
                            </div>
                            <div className="story-rating-views-div">
                            <span className="story-rating"><img src={Like} alt="" className="story-rating-image"/> {formatIntegers(0)}</span>
                            <span className="story-views"><img src={View} alt="" className="story-views-image"/>{formatIntegers(0)}</span>
                            </div>
                            <div className="story-title-div">
                            <h3 className="story-title">{title}</h3>
                            <p className="story-slogan">{shortInfo}</p>
                            </div>
                        </div>
                <br/>
    
                <div className="story-create-btn-div">
                    <input type="submit" name="submit" value="Изменить" onClick={handleSubmit} className="create-btn auth-form-enter" />
                </div>
            </div>
        </form>
        </div>
    )}
    </>
  )
}
