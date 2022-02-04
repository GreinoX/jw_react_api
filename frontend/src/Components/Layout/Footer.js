import React from 'react';

export default function Footer() {
  return (
      <div className="footer">
          <div className="header-div footer-div">
            <div className="footer-logo-div">
                <a href="/" className="header-logo">ПростоПиши</a>
                <div className="footer-quote-div">
                    <p className="footer-info">Проект "ПростоПиши" создан для того чтобы, предоставить молодым авторам и не только, заинтересованым в создании и критике 
                        художественной литературы, возможности в исполнении своих способностей. Рады приветствовать всех писателей и
                    людей, начинающих свой путь в прекрасном!</p>
                    <p className="footer-quote">"Настоящий человек никогда не станет ни агентом, ни покорным исполнителем чужой воли, ни игроком, ведущим игру: всё равно — в своих или чужих интересах. Настоящий человек не может быть орудием в руках другого."-<span className="gold-p">Теодор Драйзер &#171;Финансист&#187;</span></p> 
                </div>
            </div>
            <div className="footer-bottom-div">
                <p className="foundation">Создатели: <a href="/profile/GreinoX" className="gold-p">Прокофьев Егор</a>, <a href="/profile/m.poleshchikov" className="gold-p">Полещиков Михаил</a></p>
                <div className="version-div">
                    <i>version 0.1</i><span className="gold-p">&nbsp;&#171;Buran&#187;</span>
                </div>
            </div>
          </div>
      </div>
  );
}
