import nsfwImageEn from './assets/mature-content-en.svg';
import nsfwImageDe from './assets/mature-content-de.svg';
import nsfwImageEs from './assets/mature-content-es.svg';
import nsfwImageFr from './assets/mature-content-fr.svg';

const nsfwImages = {
  de: nsfwImageDe,
  en: nsfwImageEn,
  es: nsfwImageEs,
  fr: nsfwImageFr,
};

const nsfwImageByLocale = locale => nsfwImages[locale] || nsfwImageEn;

export { nsfwImageByLocale };
