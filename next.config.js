module.exports = {
  //Allowing images for OG img generation
  images: {
    domains: ["predictthestandings.com"],
  },
  webpack: (config) => {
    // Disable fallback for the 'fs' module - This fixes not being able to use fs in this project
    config.resolve.fallback = { fs: false };
    return config;
  },
};
