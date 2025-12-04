// vite.config.ts
import path from "path";
import { createRequire } from "module";
import vue from "file:///E:/study/wechat-platform/node_modules/@vitejs/plugin-vue/dist/index.js";
import { loadEnv } from "file:///E:/study/wechat-platform/node_modules/vite/dist/node/index.js";
import Components from "file:///E:/study/wechat-platform/node_modules/unplugin-vue-components/dist/vite.mjs";
import { viteMockServe } from "file:///E:/study/wechat-platform/node_modules/vite-plugin-mock/dist/index.js";
import AutoImport from "file:///E:/study/wechat-platform/node_modules/unplugin-auto-import/dist/vite.mjs";
import vueJsx from "file:///E:/study/wechat-platform/node_modules/@vitejs/plugin-vue-jsx/index.js";
import viteCompression from "file:///E:/study/wechat-platform/node_modules/vite-plugin-compression/dist/index.js";
import purgecss from "file:///E:/study/wechat-platform/node_modules/@fullhuman/postcss-purgecss/lib/postcss-purgecss.js";
import { TovooResolver } from "file:///E:/study/wechat-platform/node_modules/@tovoo/corn/es/resolver.js";
var __vite_injected_original_dirname = "E:\\study\\wechat-platform";
var __vite_injected_original_import_meta_url = "file:///E:/study/wechat-platform/vite.config.ts";
var require2 = createRequire(__vite_injected_original_import_meta_url);
var { default: OptimizationPersist } = require2("vite-plugin-optimize-persist");
var { default: PkgConfig } = require2("vite-plugin-package-config");
var { default: VueSetupExtend } = require2("vite-plugin-vue-setup-extend-plus");
var CWD = process.cwd();
var vite_config_default = ({ command, mode }) => {
  const { VITE_BASE_URL, VITE_IMG_URL } = loadEnv(mode, CWD);
  return {
    base: "./",
    css: {
      // css预处理器
      preprocessorOptions: {
        less: {
          charset: false,
          additionalData: '@import "./src/assets/style/variables.less";',
          modifyVars: {
            "primary-color": "#3F80FF",
            "link-color": "#3F80FF",
            "success-color": "#5DC12C",
            "warning-color": "#FA9114",
            "error-color": "#FF4D4F",
            "font-size-base": "14px",
            "heading-color": "rgba(0, 0, 0, 0.85)",
            "text-color": "rgba(0, 0, 0, 0.65)",
            "text-color-secondary": "rgba(0, 0, 0, 0.45)",
            "disabled-color": "rgba(0, 0, 0, 0.25)",
            "border-radius-base": "4px",
            "border-color-base": "rgba(0, 0, 0, 0.06)",
            "box-shadow-base": "0 2px 8px rgba(0, 0, 0, 0.15)"
          },
          javascriptEnabled: true
        }
      }
    },
    plugins: [
      vue(),
      vueJsx(),
      Components({
        resolvers: [
          TovooResolver()
          // name => {
          //   if (name.match(/(Outlined|Filled|TwoTone)$/)) {
          //     return {
          //       importName: name,
          //       path: '@ant-design/icons-vue',
          //     };
          //   }
          // },
          // AntDesignVueResolver({
          //   importStyle: 'less', // <--------看这行
          //   resolveIcons: true,
          // }),
        ],
        dirs: ["src/components"],
        dts: "src/components.d.ts",
        // valid file extensions for components.
        extensions: ["vue"],
        // search for subdirectories
        deep: true,
        directives: true,
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/]
      }),
      // legacy({
      //   targets: ['defaults', 'IE 11'],
      // }),
      // createSvgIconsPlugin({
      //   iconDirs: [path.resolve(process.cwd(), 'node_modules/@ant-design/icons-svg/inline-svg/outlined')],
      //   // 指定symbolId格式
      //   symbolId: 'icon-[dir]-[name]',
      // }),
      // createSvgIconsPlugin({
      //   iconDirs: [path.resolve(process.cwd(), 'src/icons')],
      //   // 指定symbolId格式
      //   symbolId: 'icon-[dir]-[name]',
      // }),
      viteCompression(),
      viteMockServe({
        // default
        mockPath: "mock",
        localEnabled: command === "serve"
      }),
      AutoImport({
        imports: ["vue", "vue-router"],
        // 可以选择auto-import.d.ts生成的位置，使用ts建议设置为'src/auto-import.d.ts'
        dts: "src/auto-import.d.ts"
      }),
      PkgConfig(),
      OptimizationPersist(),
      VueSetupExtend(),
      purgecss({
        content: ["./public/**/*.html", "./src/**/*.vue"],
        defaultExtractor(content) {
          const contentWithoutStyleBlocks = content.replace(/<style[^]+?<\/style>/gi, "");
          return contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) || [];
        },
        safelist: [
          /-(leave|enter|appear)(|-(to|from|active))$/,
          /^(?!(|.*?:)cursor-move).+-move$/,
          /^router-link(|-exact)-active$/,
          /data-v-.*/
        ]
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "src")
      },
      extensions: [".vue", ".js", ".jsx", ".ts", ".tsx"]
    },
    build: {
      minify: "terser",
      terserOptions: {
        compress: {
          // drop_console: true,
        }
      }
    },
    server: {
      host: "0.0.0.0",
      port: 10086,
      // 设置服务启动端口号
      open: false,
      // 设置服务启动时是否自动打开浏览器
      cors: true,
      // 允许跨域
      // 设置代理，根据项目实际情况配置
      proxy: {
        "/apis": {
          // target: VITE_BASE_URL,
          target: "https://edm.gzzoc.com/demo",
          changeOrigin: true,
          secure: false,
          rewrite: (path2) => path2.replace("/apis", "/apis")
        },
        "/files": {
          target: VITE_IMG_URL,
          changeOrigin: false,
          secure: false,
          rewrite: (path2) => path2.replace("/files", "/files")
        },
        "/cell-file": {
          target: "http://192.168.0.54:9008",
          changeOrigin: false,
          secure: false
        }
      }
    }
  };
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxzdHVkeVxcXFx3ZWNoYXQtcGxhdGZvcm1cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXHN0dWR5XFxcXHdlY2hhdC1wbGF0Zm9ybVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovc3R1ZHkvd2VjaGF0LXBsYXRmb3JtL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCB7IGNyZWF0ZVJlcXVpcmUgfSBmcm9tICdtb2R1bGUnO1xyXG5jb25zdCByZXF1aXJlID0gY3JlYXRlUmVxdWlyZShpbXBvcnQubWV0YS51cmwpO1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSc7XHJcbmltcG9ydCB7IFVzZXJDb25maWdFeHBvcnQsIENvbmZpZ0VudiwgbG9hZEVudiB9IGZyb20gJ3ZpdGUnO1xyXG4vLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjVcdTdFQzRcdTRFRjZcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSc7XHJcbi8vIGFudFx1NjMwOVx1OTcwMFx1NTJBMFx1OEY3RFxyXG4vLyBpbXBvcnQgeyBBbnREZXNpZ25WdWVSZXNvbHZlciB9IGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVycyc7XHJcbi8vIGljb25zXHU2NTg3XHU0RUY2XHU1OTM5XHU0RTJEXHU3Njg0c3ZnXHU1NkZFXHU3MjQ3XHVGRjBDXHU2Q0U4XHU1MThDXHU1NzI4XHU1MTY4XHU1QzQwXHJcbi8vIGltcG9ydCB7IGNyZWF0ZVN2Z0ljb25zUGx1Z2luIH0gZnJvbSAndml0ZS1wbHVnaW4tc3ZnLWljb25zJztcclxuLy8gbW9ja1x1NjU3MFx1NjM2RVxyXG5pbXBvcnQgeyB2aXRlTW9ja1NlcnZlIH0gZnJvbSAndml0ZS1wbHVnaW4tbW9jayc7XHJcbi8vIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NXZ1ZVx1NTQ4Q3Z1ZS1yb3V0ZXJcdTY1QjlcdTZDRDVcclxuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSc7XHJcbi8vIE9wdGltaXphdGlvblBlcnNpc3RcdTMwMDFQa2dDb25maWdcdTYzRDJcdTRFRjZcdTVDMzFcdTY2MkZcdTU0MkZcdTUyQThcdTc2ODRcdTY1RjZcdTUwMTlcdUZGMENcdTVGQzVcdTk4N0JcdTYzRDBcdTUyNERcdTdGMTZcdThCRDFcdTU5N0RcdThGRDlcdTRFOUJcdTRGOURcdThENTZcdUZGMENcdTgwMENcdThGRDlcdTRFOUJcdTRGOURcdThENTZcdTkwRkRcdTY2MkZcdTRGMUFcdTgxRUFcdTUyQThcdTUxOTlcdTUxNjVcdTUyMzBwYWNrYWdlLmpzb25cclxuY29uc3QgeyBkZWZhdWx0OiBPcHRpbWl6YXRpb25QZXJzaXN0IH0gPSByZXF1aXJlKCd2aXRlLXBsdWdpbi1vcHRpbWl6ZS1wZXJzaXN0Jyk7XHJcbmNvbnN0IHsgZGVmYXVsdDogUGtnQ29uZmlnIH0gPSByZXF1aXJlKCd2aXRlLXBsdWdpbi1wYWNrYWdlLWNvbmZpZycpO1xyXG4vLyB2dWVKc3hcdThCRURcdTZDRDVcdTg5RTNcdTY3OTBcclxuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4JztcclxuLy8gXHU4OUUzXHU1MUIzdnVlM1x1NEUwQiBzY3JpcHQgc2V0dXBcdThCRURcdTZDRDVcdTdDRDYgXHU0RTBCIFx1RkYwQ1x1NjI0Qlx1NTJBOFx1OEJCRVx1N0Y2RVx1N0VDNFx1NEVGNm5hbWVcdTRFMERcdTY1QjlcdTRGQkZcdTc2ODRcdTk1RUVcdTk4OThcclxuY29uc3QgeyBkZWZhdWx0OiBWdWVTZXR1cEV4dGVuZCB9ID0gcmVxdWlyZSgndml0ZS1wbHVnaW4tdnVlLXNldHVwLWV4dGVuZC1wbHVzJyk7XHJcbi8vIFx1NEY3Rlx1NzUyOCBnemlwIFx1OEZEQlx1ODg0Q1x1NTM4Qlx1N0YyOVxyXG5pbXBvcnQgdml0ZUNvbXByZXNzaW9uIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uJztcclxuXHJcbmltcG9ydCBwdXJnZWNzcyBmcm9tICdAZnVsbGh1bWFuL3Bvc3Rjc3MtcHVyZ2Vjc3MnO1xyXG5cclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHMtY29tbWVudFxyXG4vLyBAdHMtaWdub3JlXHJcbmltcG9ydCB7IFRvdm9vUmVzb2x2ZXIgfSBmcm9tICdAdG92b28vY29ybi9yZXNvbHZlcic7XHJcbi8vIGltcG9ydCBsZWdhY3kgZnJvbSAnQHZpdGVqcy9wbHVnaW4tbGVnYWN5JztcclxuXHJcbmNvbnN0IENXRCA9IHByb2Nlc3MuY3dkKCk7XHJcbmV4cG9ydCBkZWZhdWx0ICh7IGNvbW1hbmQsIG1vZGUgfTogQ29uZmlnRW52KTogVXNlckNvbmZpZ0V4cG9ydCA9PiB7XHJcbiAgY29uc3QgeyBWSVRFX0JBU0VfVVJMLCBWSVRFX0lNR19VUkwgfSA9IGxvYWRFbnYobW9kZSwgQ1dEKTtcclxuICByZXR1cm4ge1xyXG4gICAgYmFzZTogJy4vJyxcclxuICAgIGNzczoge1xyXG4gICAgICAvLyBjc3NcdTk4ODRcdTU5MDRcdTc0MDZcdTU2NjhcclxuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xyXG4gICAgICAgIGxlc3M6IHtcclxuICAgICAgICAgIGNoYXJzZXQ6IGZhbHNlLFxyXG4gICAgICAgICAgYWRkaXRpb25hbERhdGE6ICdAaW1wb3J0IFwiLi9zcmMvYXNzZXRzL3N0eWxlL3ZhcmlhYmxlcy5sZXNzXCI7JyxcclxuICAgICAgICAgIG1vZGlmeVZhcnM6IHtcclxuICAgICAgICAgICAgJ3ByaW1hcnktY29sb3InOiAnIzNGODBGRicsXHJcbiAgICAgICAgICAgICdsaW5rLWNvbG9yJzogJyMzRjgwRkYnLFxyXG4gICAgICAgICAgICAnc3VjY2Vzcy1jb2xvcic6ICcjNURDMTJDJyxcclxuICAgICAgICAgICAgJ3dhcm5pbmctY29sb3InOiAnI0ZBOTExNCcsXHJcbiAgICAgICAgICAgICdlcnJvci1jb2xvcic6ICcjRkY0RDRGJyxcclxuICAgICAgICAgICAgJ2ZvbnQtc2l6ZS1iYXNlJzogJzE0cHgnLFxyXG4gICAgICAgICAgICAnaGVhZGluZy1jb2xvcic6ICdyZ2JhKDAsIDAsIDAsIDAuODUpJyxcclxuICAgICAgICAgICAgJ3RleHQtY29sb3InOiAncmdiYSgwLCAwLCAwLCAwLjY1KScsXHJcbiAgICAgICAgICAgICd0ZXh0LWNvbG9yLXNlY29uZGFyeSc6ICdyZ2JhKDAsIDAsIDAsIDAuNDUpJyxcclxuICAgICAgICAgICAgJ2Rpc2FibGVkLWNvbG9yJzogJ3JnYmEoMCwgMCwgMCwgMC4yNSknLFxyXG4gICAgICAgICAgICAnYm9yZGVyLXJhZGl1cy1iYXNlJzogJzRweCcsXHJcbiAgICAgICAgICAgICdib3JkZXItY29sb3ItYmFzZSc6ICdyZ2JhKDAsIDAsIDAsIDAuMDYpJyxcclxuICAgICAgICAgICAgJ2JveC1zaGFkb3ctYmFzZSc6ICcwIDJweCA4cHggcmdiYSgwLCAwLCAwLCAwLjE1KScsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgamF2YXNjcmlwdEVuYWJsZWQ6IHRydWUsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgIHZ1ZSgpLFxyXG4gICAgICB2dWVKc3goKSxcclxuICAgICAgQ29tcG9uZW50cyh7XHJcbiAgICAgICAgcmVzb2x2ZXJzOiBbXHJcbiAgICAgICAgICBUb3Zvb1Jlc29sdmVyKCksXHJcbiAgICAgICAgICAvLyBuYW1lID0+IHtcclxuICAgICAgICAgIC8vICAgaWYgKG5hbWUubWF0Y2goLyhPdXRsaW5lZHxGaWxsZWR8VHdvVG9uZSkkLykpIHtcclxuICAgICAgICAgIC8vICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgLy8gICAgICAgaW1wb3J0TmFtZTogbmFtZSxcclxuICAgICAgICAgIC8vICAgICAgIHBhdGg6ICdAYW50LWRlc2lnbi9pY29ucy12dWUnLFxyXG4gICAgICAgICAgLy8gICAgIH07XHJcbiAgICAgICAgICAvLyAgIH1cclxuICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAvLyBBbnREZXNpZ25WdWVSZXNvbHZlcih7XHJcbiAgICAgICAgICAvLyAgIGltcG9ydFN0eWxlOiAnbGVzcycsIC8vIDwtLS0tLS0tLVx1NzcwQlx1OEZEOVx1ODg0Q1xyXG4gICAgICAgICAgLy8gICByZXNvbHZlSWNvbnM6IHRydWUsXHJcbiAgICAgICAgICAvLyB9KSxcclxuICAgICAgICBdLFxyXG4gICAgICAgIGRpcnM6IFsnc3JjL2NvbXBvbmVudHMnXSxcclxuICAgICAgICBkdHM6ICdzcmMvY29tcG9uZW50cy5kLnRzJyxcclxuICAgICAgICAvLyB2YWxpZCBmaWxlIGV4dGVuc2lvbnMgZm9yIGNvbXBvbmVudHMuXHJcbiAgICAgICAgZXh0ZW5zaW9uczogWyd2dWUnXSxcclxuICAgICAgICAvLyBzZWFyY2ggZm9yIHN1YmRpcmVjdG9yaWVzXHJcbiAgICAgICAgZGVlcDogdHJ1ZSxcclxuICAgICAgICBkaXJlY3RpdmVzOiB0cnVlLFxyXG4gICAgICAgIGluY2x1ZGU6IFsvXFwudnVlJC8sIC9cXC52dWVcXD92dWUvLCAvXFwubWQkL10sXHJcbiAgICAgICAgZXhjbHVkZTogWy9bXFxcXC9dbm9kZV9tb2R1bGVzW1xcXFwvXS8sIC9bXFxcXC9dXFwuZ2l0W1xcXFwvXS8sIC9bXFxcXC9dXFwubnV4dFtcXFxcL10vXSxcclxuICAgICAgfSksXHJcbiAgICAgIC8vIGxlZ2FjeSh7XHJcbiAgICAgIC8vICAgdGFyZ2V0czogWydkZWZhdWx0cycsICdJRSAxMSddLFxyXG4gICAgICAvLyB9KSxcclxuICAgICAgLy8gY3JlYXRlU3ZnSWNvbnNQbHVnaW4oe1xyXG4gICAgICAvLyAgIGljb25EaXJzOiBbcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksICdub2RlX21vZHVsZXMvQGFudC1kZXNpZ24vaWNvbnMtc3ZnL2lubGluZS1zdmcvb3V0bGluZWQnKV0sXHJcbiAgICAgIC8vICAgLy8gXHU2MzA3XHU1QjlBc3ltYm9sSWRcdTY4M0NcdTVGMEZcclxuICAgICAgLy8gICBzeW1ib2xJZDogJ2ljb24tW2Rpcl0tW25hbWVdJyxcclxuICAgICAgLy8gfSksXHJcbiAgICAgIC8vIGNyZWF0ZVN2Z0ljb25zUGx1Z2luKHtcclxuICAgICAgLy8gICBpY29uRGlyczogW3BhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCAnc3JjL2ljb25zJyldLFxyXG4gICAgICAvLyAgIC8vIFx1NjMwN1x1NUI5QXN5bWJvbElkXHU2ODNDXHU1RjBGXHJcbiAgICAgIC8vICAgc3ltYm9sSWQ6ICdpY29uLVtkaXJdLVtuYW1lXScsXHJcbiAgICAgIC8vIH0pLFxyXG4gICAgICB2aXRlQ29tcHJlc3Npb24oKSxcclxuICAgICAgdml0ZU1vY2tTZXJ2ZSh7XHJcbiAgICAgICAgLy8gZGVmYXVsdFxyXG4gICAgICAgIG1vY2tQYXRoOiAnbW9jaycsXHJcbiAgICAgICAgbG9jYWxFbmFibGVkOiBjb21tYW5kID09PSAnc2VydmUnLFxyXG4gICAgICB9KSxcclxuICAgICAgQXV0b0ltcG9ydCh7XHJcbiAgICAgICAgaW1wb3J0czogWyd2dWUnLCAndnVlLXJvdXRlciddLFxyXG4gICAgICAgIC8vIFx1NTNFRlx1NEVFNVx1OTAwOVx1NjJFOWF1dG8taW1wb3J0LmQudHNcdTc1MUZcdTYyMTBcdTc2ODRcdTRGNERcdTdGNkVcdUZGMENcdTRGN0ZcdTc1Mjh0c1x1NUVGQVx1OEJBRVx1OEJCRVx1N0Y2RVx1NEUzQSdzcmMvYXV0by1pbXBvcnQuZC50cydcclxuICAgICAgICBkdHM6ICdzcmMvYXV0by1pbXBvcnQuZC50cycsXHJcbiAgICAgIH0pLFxyXG4gICAgICBQa2dDb25maWcoKSxcclxuICAgICAgT3B0aW1pemF0aW9uUGVyc2lzdCgpLFxyXG4gICAgICBWdWVTZXR1cEV4dGVuZCgpLFxyXG4gICAgICBwdXJnZWNzcyh7XHJcbiAgICAgICAgY29udGVudDogWycuL3B1YmxpYy8qKi8qLmh0bWwnLCAnLi9zcmMvKiovKi52dWUnXSxcclxuICAgICAgICBkZWZhdWx0RXh0cmFjdG9yKGNvbnRlbnQpIHtcclxuICAgICAgICAgIGNvbnN0IGNvbnRlbnRXaXRob3V0U3R5bGVCbG9ja3MgPSBjb250ZW50LnJlcGxhY2UoLzxzdHlsZVteXSs/PFxcL3N0eWxlPi9naSwgJycpO1xyXG4gICAgICAgICAgcmV0dXJuIGNvbnRlbnRXaXRob3V0U3R5bGVCbG9ja3MubWF0Y2goL1tBLVphLXowLTktXy86XSpbQS1aYS16MC05LV8vXSsvZykgfHwgW107XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzYWZlbGlzdDogW1xyXG4gICAgICAgICAgLy0obGVhdmV8ZW50ZXJ8YXBwZWFyKSh8LSh0b3xmcm9tfGFjdGl2ZSkpJC8sXHJcbiAgICAgICAgICAvXig/ISh8Lio/OiljdXJzb3ItbW92ZSkuKy1tb3ZlJC8sXHJcbiAgICAgICAgICAvXnJvdXRlci1saW5rKHwtZXhhY3QpLWFjdGl2ZSQvLFxyXG4gICAgICAgICAgL2RhdGEtdi0uKi8sXHJcbiAgICAgICAgXSxcclxuICAgICAgfSksXHJcbiAgICBdLFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICBhbGlhczoge1xyXG4gICAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLFxyXG4gICAgICB9LFxyXG4gICAgICBleHRlbnNpb25zOiBbJy52dWUnLCAnLmpzJywgJy5qc3gnLCAnLnRzJywgJy50c3gnXSxcclxuICAgIH0sXHJcbiAgICBidWlsZDoge1xyXG4gICAgICBtaW5pZnk6ICd0ZXJzZXInLFxyXG4gICAgICB0ZXJzZXJPcHRpb25zOiB7XHJcbiAgICAgICAgY29tcHJlc3M6IHtcclxuICAgICAgICAgIC8vIGRyb3BfY29uc29sZTogdHJ1ZSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICBob3N0OiAnMC4wLjAuMCcsXHJcbiAgICAgIHBvcnQ6IDEwMDg2LCAvLyBcdThCQkVcdTdGNkVcdTY3MERcdTUyQTFcdTU0MkZcdTUyQThcdTdBRUZcdTUzRTNcdTUzRjdcclxuICAgICAgb3BlbjogZmFsc2UsIC8vIFx1OEJCRVx1N0Y2RVx1NjcwRFx1NTJBMVx1NTQyRlx1NTJBOFx1NjVGNlx1NjYyRlx1NTQyNlx1ODFFQVx1NTJBOFx1NjI1M1x1NUYwMFx1NkQ0Rlx1ODlDOFx1NTY2OFxyXG4gICAgICBjb3JzOiB0cnVlLCAvLyBcdTUxNDFcdThCQjhcdThERThcdTU3REZcclxuICAgICAgLy8gXHU4QkJFXHU3RjZFXHU0RUUzXHU3NDA2XHVGRjBDXHU2ODM5XHU2MzZFXHU5ODc5XHU3NkVFXHU1QjlFXHU5NjQ1XHU2MEM1XHU1MUI1XHU5MTREXHU3RjZFXHJcbiAgICAgIHByb3h5OiB7XHJcbiAgICAgICAgJy9hcGlzJzoge1xyXG4gICAgICAgICAgLy8gdGFyZ2V0OiBWSVRFX0JBU0VfVVJMLFxyXG4gICAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9lZG0uZ3p6b2MuY29tL2RlbW8nLFxyXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgICAgc2VjdXJlOiBmYWxzZSxcclxuICAgICAgICAgIHJld3JpdGU6IHBhdGggPT4gcGF0aC5yZXBsYWNlKCcvYXBpcycsICcvYXBpcycpLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgJy9maWxlcyc6IHtcclxuICAgICAgICAgIHRhcmdldDogVklURV9JTUdfVVJMLFxyXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiBmYWxzZSxcclxuICAgICAgICAgIHNlY3VyZTogZmFsc2UsXHJcbiAgICAgICAgICByZXdyaXRlOiBwYXRoID0+IHBhdGgucmVwbGFjZSgnL2ZpbGVzJywgJy9maWxlcycpLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgJy9jZWxsLWZpbGUnOiB7XHJcbiAgICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTkyLjE2OC4wLjU0OjkwMDgnLFxyXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiBmYWxzZSxcclxuICAgICAgICAgIHNlY3VyZTogZmFsc2UsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfTtcclxufTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFnUSxPQUFPLFVBQVU7QUFDalIsU0FBUyxxQkFBcUI7QUFFOUIsT0FBTyxTQUFTO0FBQ2hCLFNBQXNDLGVBQWU7QUFFckQsT0FBTyxnQkFBZ0I7QUFNdkIsU0FBUyxxQkFBcUI7QUFFOUIsT0FBTyxnQkFBZ0I7QUFLdkIsT0FBTyxZQUFZO0FBSW5CLE9BQU8scUJBQXFCO0FBRTVCLE9BQU8sY0FBYztBQUlyQixTQUFTLHFCQUFxQjtBQTdCOUIsSUFBTSxtQ0FBbUM7QUFBb0gsSUFBTSwyQ0FBMkM7QUFFOU0sSUFBTUEsV0FBVSxjQUFjLHdDQUFlO0FBYzdDLElBQU0sRUFBRSxTQUFTLG9CQUFvQixJQUFJQSxTQUFRLDhCQUE4QjtBQUMvRSxJQUFNLEVBQUUsU0FBUyxVQUFVLElBQUlBLFNBQVEsNEJBQTRCO0FBSW5FLElBQU0sRUFBRSxTQUFTLGVBQWUsSUFBSUEsU0FBUSxtQ0FBbUM7QUFXL0UsSUFBTSxNQUFNLFFBQVEsSUFBSTtBQUN4QixJQUFPLHNCQUFRLENBQUMsRUFBRSxTQUFTLEtBQUssTUFBbUM7QUFDakUsUUFBTSxFQUFFLGVBQWUsYUFBYSxJQUFJLFFBQVEsTUFBTSxHQUFHO0FBQ3pELFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLEtBQUs7QUFBQTtBQUFBLE1BRUgscUJBQXFCO0FBQUEsUUFDbkIsTUFBTTtBQUFBLFVBQ0osU0FBUztBQUFBLFVBQ1QsZ0JBQWdCO0FBQUEsVUFDaEIsWUFB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
