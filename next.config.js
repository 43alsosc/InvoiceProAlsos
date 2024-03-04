// 👇️ assumes you use Webpack 5
module.exports = {
    webpack5: true,
    webpack: config => {
      config.resolve.fallback = {
        fs: false,
      };
  
      return config;
    },
    images: {
      domains: ['upload.wikimedia.org'],
    },
  };
  