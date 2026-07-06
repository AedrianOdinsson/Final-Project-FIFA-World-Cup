/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  // Permite <img src="https://flagcdn.com/..."> en componentes de servidor.
  // El backend arma las URLs en runtime a partir del codigo ISO del equipo.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
