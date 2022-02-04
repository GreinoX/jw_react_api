import React from 'react';
import writeIcon from '../../static/icons/write.svg';
import {Link} from 'react-router-dom';

function Authentication() {
  return (
    <div className="auth-div">
        <form class="auth-form">
            <div className="auth-form-logo-div">
                <Link to="/"><img src={writeIcon} alt="" class="auth-form-logo" /> </Link>
            </div>
                <div className="auth-form-inputs">
                <h1 className="auth-form-header">Авторизация</h1>
                <input type="text" name="username" className="auth-form-input first-input" placeholder="Логин" maxLength="150" required="" id="id_username"></input>
                <label for="" class="auth-form-show-pass"><input type="checkbox" class="showPassword"/> Показать пароль</label>
                <input type="submit" value="Войти" class="auth-form-enter"/>
                <span class="auth-form-reg">Если у вас еще нет аккаунта <a href="{% url 'story-reg-view' %}">Регистрация</a></span>
            </div>
        </form>
    </div>
  );
}

export default Authentication;