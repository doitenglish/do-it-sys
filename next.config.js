/** @type {import('next').NextConfig} */
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
});

const nextConfig = {
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
};

module.exports = withPWA({
  ...nextConfig,
});
