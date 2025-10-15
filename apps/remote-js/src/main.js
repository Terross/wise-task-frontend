// src/main.js
import cssText from './style.css?inline'
import javascriptLogo from './javascript.svg';
import viteLogo from '/vite.svg';
import { setupCounter } from './counter.js';

export function renderApp(container) {
    const shadowRoot = container.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = `
        <style>${cssText}</style> <div>
          <a href="https://vite.dev" target="_blank">
            <img src="${viteLogo}" class="logo" alt="Vite logo" />
          </a>
          <h1>Hello Vite!</h1>
          <div class="card">
            <button id="counter" type="button"></button>
          </div>
        </div>
      `;

    // 3. Инициализируем счетчик внутри Shadow Root
    setupCounter(shadowRoot.querySelector('#counter'));
}