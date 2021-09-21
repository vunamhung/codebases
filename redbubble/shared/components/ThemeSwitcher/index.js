import React from 'react';
import Dropdown, { DropdownItem, DropdownSection } from '@redbubble/design-system/react/Dropdown';
import { useLocation } from 'react-router-dom';
import Button from '@redbubble/design-system/react/Button';
import ChevronDownBigIcon from '@redbubble/design-system/react/Icons/ChevronDownBig';

const ThemeSwitcher = ({ onChange, theme }) => {
  const location = useLocation();
  if (!location || !location.search.includes('designSystemTheme')) return null;

  return (
    <Dropdown
      trigger={(props, ref) => (
        <Button {...props} ref={ref} iconAfter={<ChevronDownBigIcon />} strong>
          { theme }
        </Button>
      )}
    >
      <DropdownSection>
        <DropdownItem
          onSelect={() => {
            import(/* webpackChunkName: "ds-find-your-thing-theme" */ '@redbubble/design-system/react/themes/default').then(module => onChange(module.default));
          }}
        >
          Find Your thing
        </DropdownItem>
        <DropdownItem
          onSelect={() => {
            import(/* webpackChunkName: "ds-find-your-thing-dark-theme" */ '@redbubble/design-system/react/themes/defaultDark').then(module => onChange(module.default));
          }}
        >
          Find Your thing Dark
        </DropdownItem>
        <DropdownItem
          onSelect={() => {
            import(/* webpackChunkName: "ds-creative-adventures-theme" */ '@redbubble/design-system/react/themes/creativeAdventures').then(module => onChange(module.default));
          }}
        >
          Creative Adventures
        </DropdownItem>
      </DropdownSection>
    </Dropdown>
  );
};

export default ThemeSwitcher;
