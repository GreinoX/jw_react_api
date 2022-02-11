import React, {useState} from 'react';
import writeIcon from '../../static/icons/write.svg';
import {Link, useNavigate} from 'react-router-dom';


function Authentication() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState("");
  const navigate = useNavigate();

  const handleLogin = (event) => {
    setLogin(event.target.value);
  }

  const handlePassword = (event) => {
    setPassword(event.target.value);
  }

  const handleShowPassword = (event) => {
    setShowPassword(event.target.checked);
  }

  const handleSubmitted = (event) => {
    event.preventDefault();
    if(password === "" || login === ""){
      setErrors("Все поля должны быть заполнены.");
    }else{
      console.log(JSON.stringify({
        username: login,
        password: password
      }))
      
      const authFetchData = async () => {
        try{
          const requestOptions = {
            method: 'POST',
            headers : {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: login,
                password: password
          })};
          const response = await fetch('http://localhost:8000/auth/jwt/create/', requestOptions);
          const result = await response.json();
          const responseStatus = response.status;
          if(responseStatus === 200){

            localStorage.setItem('access', result.access);
            localStorage.setItem('refresh', result.refresh);
            const requestOptionsProfile = {
              method: 'GET',
              headers: {'Content-Type': 'application/json',
              'Authorization': `JWT ${result.access}`},
            };

            const responseProfile = await fetch(`http://localhost:8000/api/v1/profileData/${login}`, requestOptionsProfile);
            const profile = await responseProfile.json();

            if(responseProfile.status === 200){
              console.log(profile);
              localStorage.setItem('profile', JSON.stringify(profile));
              localStorage.isLogin = true;
              navigate("/");
              window.location.reload();
            }else{
              setErrors("Что то пошло не так.")
            }

          }else{
              setErrors(result.detail);
          }
        }catch(error){
          console.log(error);
        }
      }
      authFetchData();

    }
  }

  return (
    <div className="auth-div">
        <form class="auth-form">
            <div className="auth-form-logo-div">
                <Link to="/"><img src={writeIcon} alt="" className="auth-form-logo" /> </Link>
            </div>
                <div className="auth-form-inputs">
                <h1 className="auth-form-header">Авторизация</h1>
                <p className="errors">{errors}</p>
                <input type="text" name="username" className="auth-form-input first-input" placeholder="Логин" maxLength="150" required="" onChange={handleLogin} value={login}></input>
                <input type={showPassword ? "text" : "password"} name="password" className="auth-form-input" placeholder="Пароль" maxLength="150" required="" onChange={handlePassword} value={password}></input>
                <label className="auth-form-show-pass"><input type="checkbox" className="showPassword" onChange={handleShowPassword} value={showPassword}/> Показать пароль</label>
                <input type="submit" value="Войти" className="auth-form-enter" onClick={handleSubmitted} />
                <span className="auth-form-reg">Если у вас еще нет аккаунта <Link to="/registration/">Регистрация</Link></span>
            </div>
        </form>
    </div>
  );
}

export default Authentication;