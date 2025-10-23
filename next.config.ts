import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'dummyimage.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'phonetics.md',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'edu.phonetics.md',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '5566',
                pathname: '/**',
            },
        ],
    },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);