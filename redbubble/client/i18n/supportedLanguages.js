import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import de from 'react-intl/locale-data/de';
import fr from 'react-intl/locale-data/fr';
import es from 'react-intl/locale-data/es';

// react-intl locale for supported languages
addLocaleData([...en, ...de, ...fr, ...es]);
