/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    dangerouslyAllowSVG: true,
    domains: [
      "www.pixelstalk.net",
      "cdn.lifestyleasia.com",
      "www.biology-questions-and-answers.com",
      "recipe-builder-pictures.s3.eu-west-1.amazonaws.com",
    ],
  },
};

module.exports = nextConfig;
