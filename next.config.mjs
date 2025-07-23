/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        esmExternals: "loose",
        serverComponentsExternalPackages: ["mongoose"]
    },
    images: {
        domains: ['res.cloudinary.com'],
    },
    webpack: (config) => {
        config.experiments = {
            topLevelAwait: true,
            layers: true,
        };
        return config;
    },
};

export default nextConfig;
