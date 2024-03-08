module.exports = {
  webpack: (config) => {
    // Disable fallback for the 'fs' module - This fixes not being able to use fs in this project
    config.resolve.fallback = { fs: false };
    return config;
  },
};
