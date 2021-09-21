const configuredLandingPageOverrides = [
  'greeting-cards',
  'local-test-page-t-shirts-en',
  'masks',
];


export const isConfiguredLandingPageSlug =
    slug => configuredLandingPageOverrides.includes(slug);
