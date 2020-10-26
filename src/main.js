import Scene from './modules/Scene';

const typeHobbies = (el, hobbies) => {
  let index = 0;
  let currentText = '';
  let isDeleting = false;

  typing();

  function typing() {
    const fullText = hobbies[index];
    let delay = 250 - Math.random() * 100;

    if (isDeleting) {
      currentText = fullText.substring(0, currentText.length - 1);
    } else {
      currentText = fullText.substring(0, currentText.length + 1);
    }

    el.innerHTML = `<span>${currentText}</span>`;

    // deleting is faster than input
    if (isDeleting) delay /= 2;

    if (!isDeleting && currentText === fullText) {
      isDeleting = true;
      delay = 1500;
    } else if (isDeleting && currentText === '') {
      isDeleting = false;
      index = index === hobbies.length - 1 ? 0 : index + 1;
      delay = 500;
    }

    setTimeout(() => {
      typing();
    }, delay);
  }
};

export default function () {
  const scene = new Scene();
  const intro = document.querySelector('.intro');
  const tooltips = document.querySelector('.tooltips');
  const animatedText = document.querySelector('.hobby');
  const hobbies = [
    'watching movies.',
    'drawing.',
    'football.',
    'playing RPG games.',
    'coding!',
  ];

  typeHobbies(animatedText, hobbies);

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
