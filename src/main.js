import Scene from './modules/Scene';

export default function () {
    const root = document.getElementById('root');

    const content = `
        <div class="intro blur">
            <h3>Hello, I'm Kai! I live in the Netherlands.</h3>
            <div class="hobby">
                <div class="fix-word">I love&nbsp;</div>
                <div class="anime-word">
                    <span>movies</span>
                    <span>drawing</span>
                    <span>football</span>
                    <span>RPG games</span>
                    <span>coding!</span>
                </div>
            </div>
        </div>
        <div class="world"></div>
        <a class="tooltips" href="#">?
            <div class="tips">
                <ul>
                    <li class="item">Glasses is useful for a clear view.</li>
                    <li class="item">Don't keep moving your mouse/finger quickly.</li>
                </ul>
            </div>
        </a>
    `;

    root.innerHTML = content;

    const scene = new Scene();
    const intro = document.querySelector('.intro');

    scene.addEventListener('glassesoff', evt => {
        intro.classList.add('blur');
    }, false);

    scene.addEventListener('glasseson', evt => {
        intro.classList.remove('blur');
    }, false);

    scene.loop(); 
}
