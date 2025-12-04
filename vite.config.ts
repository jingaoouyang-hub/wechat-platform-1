import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import vue from '@vitejs/plugin-vue';
import { UserConfigExport, ConfigEnv, loadEnv } from 'vite';
// 自动导入组件
import Components from 'unplugin-vue-components/vite';
// ant按需加载
// import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
// icons文件夹中的svg图片，注册在全局
// import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
// mock数据
import { viteMockServe } from 'vite-plugin-mock';
// 自动导入vue和vue-router方法
import AutoImport from 'unplugin-auto-import/vite';
// OptimizationPersist、PkgConfig插件就是启动的时候，必须提前编译好这些依赖，而这些依赖都是会自动写入到package.json
const { default: OptimizationPersist } = require('vite-plugin-optimize-persist');
const { default: PkgConfig } = require('vite-plugin-package-config');
// vueJsx语法解析
import vueJsx from '@vitejs/plugin-vue-jsx';
// 解决vue3下 script setup语法糖 下 ，手动设置组件name不方便的问题
const { default: VueSetupExtend } = require('vite-plugin-vue-setup-extend-plus');
// 使用 gzip 进行压缩
import viteCompression from 'vite-plugin-compression';

import purgecss from '@fullhuman/postcss-purgecss';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { TovooResolver } from '@tovoo/corn/resolver';
// import legacy from '@vitejs/plugin-legacy';

const CWD = process.cwd();
export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  const { VITE_BASE_URL, VITE_IMG_URL } = loadEnv(mode, CWD);
  return {
    base: './',
    css: {
      // css预处理器
      preprocessorOptions: {
        less: {
          charset: false,
          additionalData: '@import "./src/assets/style/variables.less";',
          modifyVars: {
            'primary-color': '#3F80FF',
            'link-color': '#3F80FF',
            'success-color': '#5DC12C',
            'warning-color': '#FA9114',
            'error-color': '#FF4D4F',
            'font-size-base': '14px',
            'heading-color': 'rgba(0, 0, 0, 0.85)',
            'text-color': 'rgba(0, 0, 0, 0.65)',
            'text-color-secondary': 'rgba(0, 0, 0, 0.45)',
            'disabled-color': 'rgba(0, 0, 0, 0.25)',
            'border-radius-base': '4px',
            'border-color-base': 'rgba(0, 0, 0, 0.06)',
            'box-shadow-base': '0 2px 8px rgba(0, 0, 0, 0.15)',
          },
          javascriptEnabled: true,
        },
      },
    },
    plugins: [
      vue(),
      vueJsx(),
      Components({
        resolvers: [TovooResolver()],
        dirs: ['src/components'],
        dts: 'src/components.d.ts',
        // valid file extensions for components.
        extensions: ['vue'],
        // search for subdirectories
        deep: true,
        directives: true,
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
      }),
      viteCompression(),
      viteMockServe({
        // default
        mockPath: 'mock',
        localEnabled: command === 'serve',
      }),
      AutoImport({
        imports: ['vue', 'vue-router'],
        // 可以选择auto-import.d.ts生成的位置，使用ts建议设置为'src/auto-import.d.ts'
        dts: 'src/auto-import.d.ts',
      }),
      PkgConfig(),
      OptimizationPersist(),
      VueSetupExtend(),
      purgecss({
        content: ['./public/**/*.html', './src/**/*.vue'],
        defaultExtractor(content) {
          const contentWithoutStyleBlocks = content.replace(/<style[^]+?<\/style>/gi, '');
          return contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) || [];
        },
        safelist: [
          /-(leave|enter|appear)(|-(to|from|active))$/,
          /^(?!(|.*?:)cursor-move).+-move$/,
          /^router-link(|-exact)-active$/,
          /data-v-.*/,
        ],
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      extensions: ['.vue', '.js', '.jsx', '.ts', '.tsx'],
    },
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          // drop_console: true,
        },
      },
    },
    server: {
      host: '0.0.0.0',
      port: 10086, // 设置服务启动端口号
      open: false, // 设置服务启动时是否自动打开浏览器
      cors: true, // 允许跨域
      // 设置代理，根据项目实际情况配置
      proxy: {
        '/apis': {
          target: VITE_BASE_URL,
          changeOrigin: true,
          secure: false,
          rewrite: path => path.replace('/apis', '/'),
        },
        '/files': {
          target: VITE_IMG_URL,
          changeOrigin: false,
          secure: false,
          rewrite: path => path.replace('/files', '/files'),
        },
        '/cell-file': {
          target: 'http://192.168.0.54:9008',
          changeOrigin: false,
          secure: false,
        },
      },
    },
  };
};
