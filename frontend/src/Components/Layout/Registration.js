import React, { useEffect } from 'react';
import writeIcon from '../../static/icons/write.svg';
import {Link, useNavigate} from 'react-router-dom';
import {useState} from 'react';

function Registration() {
    const [login, setLogin] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [password2, setPassword2] = useState("");
    const [errors, setErrors] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Просто Пиши | Регистрация"
    }, [])
    
    const handleLogin = (event) => {
        setLogin(event.target.value.trim());
    }

    const handleEmail = (event) => {
        setEmail(event.target.value.trim());
    }

    const handlePassword = (event) => {
        setPassword(event.target.value.trim());
    }

    const handlePassword2 = (event) => {
        setPassword2(event.target.value.trim());
    }

    const handleShowPassword = (event) => {
        if(event.target.checked){
            setShowPassword(true)
        }else{
            setShowPassword(false);
        }
    }

    const handleSubmitted = (event) => {
        event.preventDefault();
        if(password !== password2){
            setErrors("Пароли не совпадают.");
        }else if(login === "" || password === "" || password2 === "" || email === ""){
            setErrors("Все поля должны быть заполнены.");
        }else{
            const regFetchData = async () => {
                try{
                    const requestOptions = {
                        method: 'POST',
                        headers : {
                            'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            email: email,
                            username: login,
                            password: password
                        })
                    };
                    const response = await fetch('http://localhost:8000/auth/users/', requestOptions);
                    const responseStatus = response.status;
                    const result = await response.json();
                    if(responseStatus === 201){
                        navigate("/");
                    }else{
                        setErrors(result.username || result.password || result.email);
                    }
                }catch(error){
                    console.log(error);
                }
            }
            regFetchData();
        }
    }


  return (
    <div className="auth-div">
        <form className="auth-form">
            <div className="auth-form-logo-div">
                <Link to="/"><img src={writeIcon} alt="" className="auth-form-logo" /> </Link>
            </div>
                <div className="auth-form-inputs">
                <h1 className="auth-form-header">Регистарция</h1>
                <p className="errors">{errors}</p>
                <input type="text" name="username" className="auth-form-input first-input" placeholder="Логин" maxLength="150" required="" onChange={handleLogin} value={login}></input>
                <input type="email" name="email" className="auth-form-input" placeholder="E-mail" required="" onChange={handleEmail} value={email}></input>
                <input type={showPassword ? "text" : "password"} name="password" className="auth-form-input" placeholder="Пароль" maxLength="150" required="" onChange={handlePassword} value={password}></input>
                <input type="password" name="password2" className="auth-form-input password_rep" placeholder="Повторите пароль" required="" onChange={handlePassword2} value={password2}></input>
                <label className="auth-form-show-pass"><input type="checkbox" className="showPassword" onChange={handleShowPassword} value={showPassword}/> Показать пароль</label>
                <input type="submit" onClick={handleSubmitted} value="Зарегистрироваться" className="auth-form-enter"/>
                <span className="auth-form-reg">Если у вас уже есть аккаунт <Link to="/login">Войти</Link></span>
            </div>
        </form>
    </div>
  );
}

export default Registration;