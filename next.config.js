/** @type {import('next').NextConfig} */

const path = require('path')

const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src')
    config.resolve.alias['@components'] = path.resolve(
      __dirname,
      'src/components'
    )
    config.resolve.alias['@utils'] = path.resolve(__dirname, 'src/utils')
    config.resolve.alias['@lib'] = path.resolve(__dirname, 'src/lib')
    config.resolve.alias['@app'] = path.resolve(__dirname, 'src/app')
    config.resolve.alias['@hooks'] = path.resolve(__dirname, 'src/hooks')
    config.resolve.alias['@dateUtils'] = path.resolve(
      __dirname,
      'src/utils/dateUtils'
    )
    return config
  },
}

module.exports = nextConfig
