const deviceInfo = (device) => {
  const { type, cloudflare } = device;
  const resolved = cloudflare || type;

  return {
    is: {
      small: (['phone', 'mobile'].includes(resolved)),
      medium: (resolved === 'tablet'),
      large: (resolved === 'desktop'),
    },
  };
};

export default deviceInfo;
