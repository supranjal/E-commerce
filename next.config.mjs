/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      { protocol: 'https', hostname: 'www.purevedicgems.com' },
      { protocol: 'https', hostname: 'aslirudraksha.com' },
      { protocol: 'https', hostname: 'vastuyantra.in' },
      { protocol: 'https', hostname: 'kheteshwarrudra.com' },
      { protocol: 'https', hostname: 'omgems.co.in' },
      { protocol: 'https', hostname: 'rudrabliss.com' },
      { protocol: 'https', hostname: 'www.divinehindu.in' },
      { protocol: 'https', hostname: 'i.etsystatic.com' },
      { protocol: 'https', hostname: '5.imimg.com' },
      { protocol: 'https', hostname: 'abhimantrit.com' },
      { protocol: 'https', hostname: 'shraddhashreegems.com' },
      { protocol: 'https', hostname: 'giri.in' },
      { protocol: 'https', hostname: 'www.tulsimala.in' },
      { protocol: 'https', hostname: 'seetara.in' },
      { protocol: 'https', hostname: 'm.media-amazon.com' },
      { protocol: 'https', hostname: 'ts1.mm.bing.net' },
      { protocol: 'https', hostname: 'ts2.mm.bing.net' },
      { protocol: 'https', hostname: 'ts3.mm.bing.net' },
      { protocol: 'https', hostname: 'ts4.mm.bing.net' },
    ],
  },
};

export default nextConfig;
