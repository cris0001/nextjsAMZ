/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com", "nationaltoday.com", "hq2.recyclist.co", "lagoofficial.com", "tanie-zakupy.pl"],
  },
};

module.exports = nextConfig;
