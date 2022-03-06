import React, {useEffect, useState, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import jwt from 'jwt-decode';
import { updateJWTToken, selectOptions } from '../utils';
import PlusIcon from '../../static/icons/plus.svg';
import Select from 'react-select';
import { stylesForSelect } from '../../styles/styles';

export default function EditProfile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [wasImage, setWasImage] = useState("");
  const imageRef = useRef("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isLogin = localStorage.getItem('isLogin');
  const jwtToken = localStorage.getItem('access');
  const profile = JSON.parse(localStorage.getItem('profile'));
  const navigate = useNavigate();
  const [defaultImage, setDefaultImage] = useState(false);

  useEffect(() => {
    if(isLogin && jwtToken){
      const fetchData = async () => {
        if(profile){
          const response = await fetch(`http://localhost:8000/api/v1/profileData/edit/${profile.username}`);
          if(response.ok){
            const result = await response.json();
            if(result && jwtToken){
              const jwtDecode = jwt(jwtToken);
              if(jwtDecode.user_id === result.id){
                setFirstName(result.first_name);
                setLastName(result.last_name);
                if(result.profile_picture){
                  setWasImage(result.profile_picture);
                }else{
                  setDefaultImage(true);
                }
                setWasImage(result.profile_picture);
                setStatus(result.status);
                setIsLoading(true);
              }
            }
          }
        }
      }
      fetchData();
    }else{
      localStorage.clear();
      navigate('/');
      window.location.reload();
    }
  }, [])

  const handleFirstName = (event) => {
    setFirstName(event.target.value);
  }

  const handleLastName = (event) => {
    setLastName(event.target.value);
  }

  const handleStatus = (event) => {
    setStatus(event.target.value);
  }

  const handleImage = (event) => {
    setImage(event.target.files[0]);
    setDefaultImage(false);
  }

  const handleRemoveImageButton = (event) => {
    event.preventDefault();
    if(!wasImage){
      setImage("");
      imageRef.current.value = "";
      setDefaultImage(true);
    }else{
      setImage("");
      imageRef.current.value = "";
      setDefaultImage(false);
    }
  }

  const handleRemoveWasImageButton = (event) => {
    event.preventDefault();
    setWasImage("");
    setDefaultImage(true);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setFirstName(firstName.trim());
    setLastName(lastName.trim());
    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    if(image){
      formData.append('profile_picture', image);
    }else if(image === "" && !wasImage){
      formData.append('profile_picture', "");
    }
    formData.append('status', status);
    const fetchData = async () => {
      updateJWTToken();
        const requestOptions = {
          method: 'PUT',
          headers: {
            'Authorization': `JWT ${jwtToken}`
          },
          body: formData
        }
        const jwtDecode = jwt(jwtToken);
        await fetch(`http://localhost:8000/api/v1/profile/edit/${jwtDecode.user_id}`, requestOptions)
        .then(res => res.json())
        .then(data => {
          data['username'] = profile.username;
          localStorage.setItem('profile', JSON.stringify(data))
          navigate(`/profile/${data['username']}`);
          window.location.reload();
        }).catch(error => {
          console.log(error);
        })
    }
    fetchData();
  }

  const renderSelectItems = () => {
    return <Select value={selectOptions.find(elem => elem.value === status)} placeholder="Выберите статус" styles={stylesForSelect} options={selectOptions} onChange={elem => {setStatus(elem.value)}} />
  }

  return (
    <>
    {isLoading && (
      <>
        <div className="story-create-div">
        <form className="story-create-form">
          <div className="stories-theme-div">
            <h4 className="stories-theme">Изменение профиля</h4>
          </div>
          <div className="story-create-field">
            <div className="story-create-title-slogan-div">
              <div className="story-create-title-div input-blocks">
                <label htmlFor="id_first_name" className="story-create-labels">Имя</label>
                <input type="text" className="story-create-input" maxLength="150" onChange={handleFirstName} value={firstName}/>
              </div>
              <div className="story-create-slogan-div input-blocks">
                    <label htmlFor="id_last_name" className="story-create-labels">Фамилия</label>
                    <input type="text"  className="story-create-input" maxLength="150" onChange={handleLastName} value={lastName}/>
                </div>
            </div>
            <br />
            <div className="story-create-title-slogan-div">
              <div className="story-create-image-div input-blocks">
                  <label className="story-create-labels">Фотография профиля</label>
                  <div className="pre-image-upload-label">
                    <label htmlFor="id_profile_picture" className="story-create-labels file-label">
                      {wasImage && !image && (
                        <>
                          <div className="profile-image-div">
                            <div className="image-edit-invite">
                              <div className="image-edit-remove-div">
                                <div className="image-edit-remove" onClick={handleRemoveWasImageButton}></div>
                              </div>
                              <div className="image-edit-add">
                                <img src={PlusIcon} alt="" />
                              </div>  
                            </div>
                            <img src={wasImage} alt="" className="profile-image"/>
                          </div>
                        </>
                      )}
                      {image && (
                        <>
                          <div className="profile-image-div">
                            <div className="image-edit-invite">
                              <div className="image-edit-remove-div">
                                <div className="image-edit-remove" onClick={handleRemoveImageButton}></div>
                              </div>
                              <div className="image-edit-add">
                                <img src={PlusIcon} alt="" />
                              </div>  
                            </div>
                            <img src={URL.createObjectURL(image)} alt="" width="250px" className="profile-image"/>
                          </div>
                        </>
                      )}
                      {defaultImage && (
                        <>
                        <div className="profile-image-div">
                          <div className="image-edit-invite">
                            <div className="image-edit-add">
                              <img src={PlusIcon} alt="" />
                            </div>  
                          </div>
                          <img src={"/media/users/default.png"} alt="" width="250px" className="profile-image"/>
                        </div>
                      </>
                      )}
                    </label>
                  </div>
                  <input type="file" id="id_profile_picture" className="story-create-image" onChange={handleImage} ref={imageRef} hidden/>
                  <br />
              </div>
              <div className="story-create-category-div input-blocks">
                <label htmlFor="id_status" className="story-create-labels">Статус</label>
                {renderSelectItems()}
              </div>
            </div>
            <br />
            <div className="story-create-btn-div">
                <input type="submit" value="Изменить" onClick={handleSubmit} className="create-btn auth-form-enter" />
            </div>
          </div>
        </form>
      </div>
      </>
    )}
      
    </>
  );
}
