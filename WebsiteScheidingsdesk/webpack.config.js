const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  // Set mode to production for optimization
  mode: 'production',
  
  // Entry point is the React component
  entry: './CountdownTimer.jsx',
  
  // Output configuration
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'countdown.min.js',
    library: 'CountdownTimer',
    libraryTarget: 'umd',
    libraryExport: 'default',
    umdNamedDefine: true,
    globalObject: 'this'
  },
  
  // Module rules for processing different file types
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }]
            ],
            plugins: [
              '@babel/plugin-transform-runtime'
            ]
          }
        }
      }
    ]
  },
  
  // Resolve extensions and module directories
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom')
    }
  },
  
  // Optimization configuration
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            pure_funcs: ['console.log']
          },
          output: {
            comments: false
          }
        },
        extractComments: false
      })
    ]
  },
  
  // External dependencies
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'React',
      root: 'React'
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'ReactDOM',
      root: 'ReactDOM'
    }
  },
  
  // Performance hints
  performance: {
    hints: 'warning'
  }
};