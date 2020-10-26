import Scene from './modules/Scene';

export default function () {
  const scene = new Scene();
  const intro = document.querySelector('.intro');
  const tooltips = document.querySelector('.tooltips');

  scene.addEventListener(
    'glassesoff',
    (evt) => {
      intro.classList.add('blur');
    },
    false,
  );

  scene.addEventListener(
    'glasseson',
    (evt) => {
      intro.classList.remove('blur');
    },
    false,
  );

  tooltips.addEventListener(
    'touchstart',
    (evt) => {
      evt.preventDefault();

      if (tooltips.classList.contains('hover')) {
        tooltips.classList.remove('hover');
      } else {
        tooltips.classList.add('hover');
      }
    },
    false,
  );

  document.addEventListener(
    'touchstart',
    (evt) => {
      evt.preventDefault();

      if (evt.target !== tooltips && tooltips.classList.contains('hover')) {
        tooltips.classList.remove('hover');
      }
    },
    false,
  );

  scene.loop();
}
