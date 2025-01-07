// vite.config.ts
import { defineConfig, loadEnv } from "file:///D:/workspace/gold-h5/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/workspace/gold-h5/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import autoImport from "file:///D:/workspace/gold-h5/node_modules/unplugin-auto-import/dist/vite.js";
import components from "file:///D:/workspace/gold-h5/node_modules/unplugin-vue-components/dist/vite.js";
import unocss from "file:///D:/workspace/gold-h5/node_modules/unocss/dist/vite.mjs";
import banner from "file:///D:/workspace/gold-h5/node_modules/vite-plugin-banner/dist/index.mjs";
import { createHtmlPlugin } from "file:///D:/workspace/gold-h5/node_modules/vite-plugin-html/dist/index.mjs";

// scripts/build.ts
import { resolve } from "path";
import { cwd } from "process";

// package.json
var package_default = {
  name: "gold-h5",
  version: "0.0.0",
  description: "",
  author: "",
  license: "MIT",
  private: true,
  type: "module",
  scripts: {
    dev: "vite --mode dev --host",
    "dev:test": "vite --mode test --host",
    "dev:prod": "vite --mode prod --host",
    build: "vue-tsc --noEmit && vite --mode prod build",
    "build:dev": "vue-tsc --noEmit && vite --mode dev build",
    "build:test": "vue-tsc --noEmit && vite --mode test build",
    preview: "vite preview --host",
    lint: "eslint src",
    format: "prettier --write src",
    "mirror:get": "npm config get registry",
    "mirror:set": "npm config set registry https://registry.npmmirror.com",
    "mirror:rm": "npm config rm registry",
    backup: 'git add . && git commit -m "chore: backup" && git push',
    up: "npx npm-check-updates -u",
    prepare: "husky install"
  },
  dependencies: {
    "@bassist/progress": "^0.2.2",
    "@bassist/utils": "^0.14.0",
    pinia: "^2.1.7",
    vue: "^3.4.15",
    "vue-router": "^4.2.5"
  },
  devDependencies: {
    "@bassist/eslint": "^0.5.0",
    "@bassist/tsconfig": "^0.1.1",
    "@bassist/uno": "^0.1.3",
    "@types/node": "^20.11.5",
    "@vitejs/plugin-vue": "^5.0.3",
    eslint: "^8.56.0",
    husky: "^8.0.3",
    less: "^4.2.0",
    "lint-staged": "^15.2.0",
    prettier: "^3.2.4",
    typescript: "^5.3.3",
    unocss: "^0.58.3",
    "unplugin-auto-import": "^0.17.3",
    "unplugin-vue-components": "^0.26.0",
    vite: "^5.0.11",
    "vite-plugin-banner": "^0.7.1",
    "vite-plugin-html": "^3.2.2",
    "vue-tsc": "^1.8.27"
  },
  "lint-staged": {
    "*.{js,jsx,vue,ts,tsx}": [
      "prettier --write",
      "eslint --fix"
    ]
  }
};

// scripts/build.ts
var whitelist = ["vue"];
function getManualChunks() {
  const manualChunks2 = {};
  for (const key in package_default.dependencies) {
    if (Object.prototype.hasOwnProperty.call(package_default.dependencies, key) && !whitelist.includes(key)) {
      const k = key;
      manualChunks2[k] = [k];
    }
  }
  return manualChunks2;
}
var manualChunks = getManualChunks();
function getRootPath() {
  return resolve(cwd());
}
function getEnvDir() {
  const rootPath = getRootPath();
  return resolve(rootPath, "config");
}
var envDir = getEnvDir();
function getSourceDir(sourceDirectory = "src") {
  const rootPath = getRootPath();
  return resolve(rootPath, sourceDirectory);
}
var sourceDir = getSourceDir();

// vite.config.ts
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, envDir);
  return {
    /**
     * 管理环境变量的配置文件存放目录
     */
    envDir,
    /**
     * 项目部署目录路径
     *
     * @description 见项目根目录下的 `config` 文件夹说明
     */
    base: env.VITE_DEPLOY_BASE_URL,
    /**
     * 本地开发服务，也可以配置接口代理
     *
     * @see https://cn.vitejs.dev/config/#server-proxy
     */
    server: {
      port: 3e3
      // proxy: {
      //   '/devapi': {
      //     target: 'http://192.168.10.198',
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/devapi/, ''),
      //   },
      // },
    },
    build: {
      rollupOptions: {
        output: {
          /**
           * 如果要加密打包后的文件名，可以启用该项目
           *
           * @example
           *
           *  1. 先安装 md5 依赖 `npm i -D @withtypes/md5`
           *  2. 导入本文件 `import md5 from '@withtypes/md5'`
           *  3. 将函数里的 `${name}` 修改为 `${md5(name)}`
           */
          // chunkFileNames: ({ name }) => {
          //   return `assets/${name}-[hash].js`
          // },
          // entryFileNames: ({ name }) => {
          //   return `assets/${name}-[hash].js`
          // },
          // assetFileNames: ({ name }) => {
          //   return `assets/${name}-[hash].[ext]`
          // },
          /**
           * 打包优化，避免全部打包到一个很大的 Chunk 里
           * @description 根据包名生成不同的 Chunk 文件，方便按需加载
           */
          manualChunks
        }
      }
    },
    resolve: {
      /**
       * 配置目录别名
       * @see https://cn.vitejs.dev/config/shared-options.html#resolve-alias
       *
       * @example
       *
       *  想从 `src/libs/foo` 文件里导入功能：
       *  配置 alias 前： `import foo from '../../../libs/foo'`
       *  配置 alias 后： `import foo from '@/libs/foo'`
       */
      alias: {
        "@": sourceDir
      }
    },
    css: {
      /**
       * 包括 `vw` / `rem` 单位转换等
       *
       * @description 请注意：
       *  当前已预装了 Uno CSS ，默认以 `rem` 为单位自动适配（根字号为 `16px` ）
       *  所以一般情况下不需要再安装这些转换插件，如果同时使用 REM 插件和 UNO ，
       *  可能会因为 Root 的 Font Size 被重新设置而导致样式错乱！
       *
       * @see https://cn.vitejs.dev/config/shared-options.html#css-postcss
       *
       * @example
       *
       *  以使用 `vw` 作为移动端适配为例：
       *    1. 先安装 postcss 依赖 `npm i -D postcss-px-to-viewport`
       *    2. 导入本文件 `import px2vw from 'postcss-px-to-viewport'`
       *    3. 取消下面函数的注释即可生效
       */
      // postcss: {
      //   plugins: [
      //     // 使用 postcss-pxtorem
      //     // px2rem({
      //     //   propList: ['*'],
      //     // }),
      //     // 使用 postcss-px-to-viewport
      //     // px2vw({
      //     //   viewportWidth: 375,
      //     //   minPixelValue: 1,
      //     // }),
      //   ],
      // },
    },
    plugins: [
      /**
       * 支持 `.vue` 文件的解析
       */
      vue(),
      /**
       * 如果需要支持 `.tsx` 组件，请安装 `@vitejs/plugin-vue-jsx` 这个包
       * 在命令行运行安装命令 `npm i -D @vitejs/plugin-vue-jsx`
       * 并在这里添加一个插件导入 `import vueJsx from '@vitejs/plugin-vue-jsx'`
       *
       * @see https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx
       */
      // vueJsx(),
      /**
       * 如果需要兼容低版本浏览器，请安装 `@vitejs/plugin-legacy` 这个包
       * 同时还需要安装 `terser` 包，因为旧版插件使用 Terser 进行混淆和压缩。
       * 在命令行运行安装命令 `npm i -D @vitejs/plugin-legacy terser`
       * 并在这里添加一个插件导入 `import legacy from '@vitejs/plugin-legacy'`
       *
       * @see https://github.com/vitejs/vite/tree/main/packages/plugin-legacy
       */
      // legacy({
      //   targets: ['defaults', 'not IE 11'],
      // }),
      /**
       * 自动导入 API ，不用每次都 import
       *
       * @tips 如果直接使用没导入的 API 依然提示报错，请重启 VS Code
       *
       * @see https://github.com/antfu/unplugin-auto-import#configuration
       */
      autoImport({
        imports: ["vue", "vue-router", "pinia"],
        dts: "src/types/declaration-files/auto-import.d.ts",
        eslintrc: {
          enabled: true,
          filepath: "./.eslintrc-auto-import.json",
          globalsPropValue: true
        }
      }),
      /**
       * 自动导入组件，不用每次都 import
       *
       * @see https://github.com/antfu/unplugin-vue-components#configuration
       */
      components({
        dirs: ["src/components"],
        directoryAsNamespace: true,
        collapseSamePrefixes: true,
        globalNamespaces: [],
        extensions: ["vue", "ts", "tsx"],
        deep: true,
        dts: "src/types/declaration-files/components.d.ts"
      }),
      /**
       * 开箱即用的 Tailwind CSS 风格原子类引擎
       *
       * @description 配置文件见 `uno.config.ts`
       *
       * @see https://unocss.dev/integrations/vite
       */
      unocss(),
      /**
       * 版权注释
       *
       * @see https://github.com/chengpeiquan/vite-plugin-banner#advanced-usage
       */
      banner(
        [
          `/**`,
          ` * name: ${package_default.name}`,
          ` * version: v${package_default.version}`,
          ` * description: ${package_default.description}`,
          ` * author: ${package_default.author}`,
          ` */`
        ].join("\n")
      ),
      /**
       * 为入口文件增加 EJS 模版能力
       *
       * @see https://github.com/vbenjs/vite-plugin-html/blob/main/README.zh_CN.md
       */
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            appTitle: env.VITE_APP_TITLE,
            appDesc: env.VITE_APP_DESC,
            appKeywords: env.VITE_APP_KEYWORDS
          }
        }
      })
    ]
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic2NyaXB0cy9idWlsZC50cyIsICJwYWNrYWdlLmpzb24iXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFx3b3Jrc3BhY2VcXFxcZ29sZC1oNVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcd29ya3NwYWNlXFxcXGdvbGQtaDVcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L3dvcmtzcGFjZS9nb2xkLWg1L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCBhdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnXHJcbmltcG9ydCBjb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXHJcbmltcG9ydCB1bm9jc3MgZnJvbSAndW5vY3NzL3ZpdGUnXHJcbmltcG9ydCBiYW5uZXIgZnJvbSAndml0ZS1wbHVnaW4tYmFubmVyJ1xyXG5pbXBvcnQgeyBjcmVhdGVIdG1sUGx1Z2luIH0gZnJvbSAndml0ZS1wbHVnaW4taHRtbCdcclxuaW1wb3J0IHsgZW52RGlyLCBzb3VyY2VEaXIsIG1hbnVhbENodW5rcyB9IGZyb20gJy4vc2NyaXB0cy9idWlsZCdcclxuaW1wb3J0IHBrZyBmcm9tICcuL3BhY2thZ2UuanNvbidcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcclxuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIGVudkRpcilcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIC8qKlxyXG4gICAgICogXHU3QkExXHU3NDA2XHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXHU3Njg0XHU5MTREXHU3RjZFXHU2NTg3XHU0RUY2XHU1QjU4XHU2NTNFXHU3NkVFXHU1RjU1XHJcbiAgICAgKi9cclxuICAgIGVudkRpcixcclxuXHJcbiAgICAvKipcclxuICAgICAqIFx1OTg3OVx1NzZFRVx1OTBFOFx1N0Y3Mlx1NzZFRVx1NUY1NVx1OERFRlx1NUY4NFxyXG4gICAgICpcclxuICAgICAqIEBkZXNjcmlwdGlvbiBcdTg5QzFcdTk4NzlcdTc2RUVcdTY4MzlcdTc2RUVcdTVGNTVcdTRFMEJcdTc2ODQgYGNvbmZpZ2AgXHU2NTg3XHU0RUY2XHU1OTM5XHU4QkY0XHU2NjBFXHJcbiAgICAgKi9cclxuICAgIGJhc2U6IGVudi5WSVRFX0RFUExPWV9CQVNFX1VSTCxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFx1NjcyQ1x1NTczMFx1NUYwMFx1NTNEMVx1NjcwRFx1NTJBMVx1RkYwQ1x1NEU1Rlx1NTNFRlx1NEVFNVx1OTE0RFx1N0Y2RVx1NjNBNVx1NTNFM1x1NEVFM1x1NzQwNlxyXG4gICAgICpcclxuICAgICAqIEBzZWUgaHR0cHM6Ly9jbi52aXRlanMuZGV2L2NvbmZpZy8jc2VydmVyLXByb3h5XHJcbiAgICAgKi9cclxuICAgIHNlcnZlcjoge1xyXG4gICAgICBwb3J0OiAzMDAwLFxyXG4gICAgICAvLyBwcm94eToge1xyXG4gICAgICAvLyAgICcvZGV2YXBpJzoge1xyXG4gICAgICAvLyAgICAgdGFyZ2V0OiAnaHR0cDovLzE5Mi4xNjguMTAuMTk4JyxcclxuICAgICAgLy8gICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgLy8gICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9kZXZhcGkvLCAnJyksXHJcbiAgICAgIC8vICAgfSxcclxuICAgICAgLy8gfSxcclxuICAgIH0sXHJcblxyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgIG91dHB1dDoge1xyXG4gICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgKiBcdTU5ODJcdTY3OUNcdTg5ODFcdTUyQTBcdTVCQzZcdTYyNTNcdTUzMDVcdTU0MEVcdTc2ODRcdTY1ODdcdTRFRjZcdTU0MERcdUZGMENcdTUzRUZcdTRFRTVcdTU0MkZcdTc1MjhcdThCRTVcdTk4NzlcdTc2RUVcclxuICAgICAgICAgICAqXHJcbiAgICAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICAgICpcclxuICAgICAgICAgICAqICAxLiBcdTUxNDhcdTVCODlcdTg4QzUgbWQ1IFx1NEY5RFx1OEQ1NiBgbnBtIGkgLUQgQHdpdGh0eXBlcy9tZDVgXHJcbiAgICAgICAgICAgKiAgMi4gXHU1QkZDXHU1MTY1XHU2NzJDXHU2NTg3XHU0RUY2IGBpbXBvcnQgbWQ1IGZyb20gJ0B3aXRodHlwZXMvbWQ1J2BcclxuICAgICAgICAgICAqICAzLiBcdTVDMDZcdTUxRkRcdTY1NzBcdTkxQ0NcdTc2ODQgYCR7bmFtZX1gIFx1NEZFRVx1NjUzOVx1NEUzQSBgJHttZDUobmFtZSl9YFxyXG4gICAgICAgICAgICovXHJcbiAgICAgICAgICAvLyBjaHVua0ZpbGVOYW1lczogKHsgbmFtZSB9KSA9PiB7XHJcbiAgICAgICAgICAvLyAgIHJldHVybiBgYXNzZXRzLyR7bmFtZX0tW2hhc2hdLmpzYFxyXG4gICAgICAgICAgLy8gfSxcclxuICAgICAgICAgIC8vIGVudHJ5RmlsZU5hbWVzOiAoeyBuYW1lIH0pID0+IHtcclxuICAgICAgICAgIC8vICAgcmV0dXJuIGBhc3NldHMvJHtuYW1lfS1baGFzaF0uanNgXHJcbiAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgLy8gYXNzZXRGaWxlTmFtZXM6ICh7IG5hbWUgfSkgPT4ge1xyXG4gICAgICAgICAgLy8gICByZXR1cm4gYGFzc2V0cy8ke25hbWV9LVtoYXNoXS5bZXh0XWBcclxuICAgICAgICAgIC8vIH0sXHJcblxyXG4gICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgKiBcdTYyNTNcdTUzMDVcdTRGMThcdTUzMTZcdUZGMENcdTkwN0ZcdTUxNERcdTUxNjhcdTkwRThcdTYyNTNcdTUzMDVcdTUyMzBcdTRFMDBcdTRFMkFcdTVGODhcdTU5MjdcdTc2ODQgQ2h1bmsgXHU5MUNDXHJcbiAgICAgICAgICAgKiBAZGVzY3JpcHRpb24gXHU2ODM5XHU2MzZFXHU1MzA1XHU1NDBEXHU3NTFGXHU2MjEwXHU0RTBEXHU1NDBDXHU3Njg0IENodW5rIFx1NjU4N1x1NEVGNlx1RkYwQ1x1NjVCOVx1NEZCRlx1NjMwOVx1OTcwMFx1NTJBMFx1OEY3RFxyXG4gICAgICAgICAgICovXHJcbiAgICAgICAgICBtYW51YWxDaHVua3MsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcblxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICAvKipcclxuICAgICAgICogXHU5MTREXHU3RjZFXHU3NkVFXHU1RjU1XHU1MjJCXHU1NDBEXHJcbiAgICAgICAqIEBzZWUgaHR0cHM6Ly9jbi52aXRlanMuZGV2L2NvbmZpZy9zaGFyZWQtb3B0aW9ucy5odG1sI3Jlc29sdmUtYWxpYXNcclxuICAgICAgICpcclxuICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICpcclxuICAgICAgICogIFx1NjBGM1x1NEVDRSBgc3JjL2xpYnMvZm9vYCBcdTY1ODdcdTRFRjZcdTkxQ0NcdTVCRkNcdTUxNjVcdTUyOUZcdTgwRkRcdUZGMUFcclxuICAgICAgICogIFx1OTE0RFx1N0Y2RSBhbGlhcyBcdTUyNERcdUZGMUEgYGltcG9ydCBmb28gZnJvbSAnLi4vLi4vLi4vbGlicy9mb28nYFxyXG4gICAgICAgKiAgXHU5MTREXHU3RjZFIGFsaWFzIFx1NTQwRVx1RkYxQSBgaW1wb3J0IGZvbyBmcm9tICdAL2xpYnMvZm9vJ2BcclxuICAgICAgICovXHJcbiAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgJ0AnOiBzb3VyY2VEaXIsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG5cclxuICAgIGNzczoge1xyXG4gICAgICAvKipcclxuICAgICAgICogXHU1MzA1XHU2MkVDIGB2d2AgLyBgcmVtYCBcdTUzNTVcdTRGNERcdThGNkNcdTYzNjJcdTdCNDlcclxuICAgICAgICpcclxuICAgICAgICogQGRlc2NyaXB0aW9uIFx1OEJGN1x1NkNFOFx1NjEwRlx1RkYxQVxyXG4gICAgICAgKiAgXHU1RjUzXHU1MjREXHU1REYyXHU5ODg0XHU4OEM1XHU0RTg2IFVubyBDU1MgXHVGRjBDXHU5RUQ4XHU4QkE0XHU0RUU1IGByZW1gIFx1NEUzQVx1NTM1NVx1NEY0RFx1ODFFQVx1NTJBOFx1OTAwMlx1OTE0RFx1RkYwOFx1NjgzOVx1NUI1N1x1NTNGN1x1NEUzQSBgMTZweGAgXHVGRjA5XHJcbiAgICAgICAqICBcdTYyNDBcdTRFRTVcdTRFMDBcdTgyMkNcdTYwQzVcdTUxQjVcdTRFMEJcdTRFMERcdTk3MDBcdTg5ODFcdTUxOERcdTVCODlcdTg4QzVcdThGRDlcdTRFOUJcdThGNkNcdTYzNjJcdTYzRDJcdTRFRjZcdUZGMENcdTU5ODJcdTY3OUNcdTU0MENcdTY1RjZcdTRGN0ZcdTc1MjggUkVNIFx1NjNEMlx1NEVGNlx1NTQ4QyBVTk8gXHVGRjBDXHJcbiAgICAgICAqICBcdTUzRUZcdTgwRkRcdTRGMUFcdTU2RTBcdTRFM0EgUm9vdCBcdTc2ODQgRm9udCBTaXplIFx1ODhBQlx1OTFDRFx1NjVCMFx1OEJCRVx1N0Y2RVx1ODAwQ1x1NUJGQ1x1ODFGNFx1NjgzN1x1NUYwRlx1OTUxOVx1NEU3MVx1RkYwMVxyXG4gICAgICAgKlxyXG4gICAgICAgKiBAc2VlIGh0dHBzOi8vY24udml0ZWpzLmRldi9jb25maWcvc2hhcmVkLW9wdGlvbnMuaHRtbCNjc3MtcG9zdGNzc1xyXG4gICAgICAgKlxyXG4gICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgKlxyXG4gICAgICAgKiAgXHU0RUU1XHU0RjdGXHU3NTI4IGB2d2AgXHU0RjVDXHU0RTNBXHU3OUZCXHU1MkE4XHU3QUVGXHU5MDAyXHU5MTREXHU0RTNBXHU0RjhCXHVGRjFBXHJcbiAgICAgICAqICAgIDEuIFx1NTE0OFx1NUI4OVx1ODhDNSBwb3N0Y3NzIFx1NEY5RFx1OEQ1NiBgbnBtIGkgLUQgcG9zdGNzcy1weC10by12aWV3cG9ydGBcclxuICAgICAgICogICAgMi4gXHU1QkZDXHU1MTY1XHU2NzJDXHU2NTg3XHU0RUY2IGBpbXBvcnQgcHgydncgZnJvbSAncG9zdGNzcy1weC10by12aWV3cG9ydCdgXHJcbiAgICAgICAqICAgIDMuIFx1NTNENlx1NkQ4OFx1NEUwQlx1OTc2Mlx1NTFGRFx1NjU3MFx1NzY4NFx1NkNFOFx1OTFDQVx1NTM3M1x1NTNFRlx1NzUxRlx1NjU0OFxyXG4gICAgICAgKi9cclxuICAgICAgLy8gcG9zdGNzczoge1xyXG4gICAgICAvLyAgIHBsdWdpbnM6IFtcclxuICAgICAgLy8gICAgIC8vIFx1NEY3Rlx1NzUyOCBwb3N0Y3NzLXB4dG9yZW1cclxuICAgICAgLy8gICAgIC8vIHB4MnJlbSh7XHJcbiAgICAgIC8vICAgICAvLyAgIHByb3BMaXN0OiBbJyonXSxcclxuICAgICAgLy8gICAgIC8vIH0pLFxyXG4gICAgICAvLyAgICAgLy8gXHU0RjdGXHU3NTI4IHBvc3Rjc3MtcHgtdG8tdmlld3BvcnRcclxuICAgICAgLy8gICAgIC8vIHB4MnZ3KHtcclxuICAgICAgLy8gICAgIC8vICAgdmlld3BvcnRXaWR0aDogMzc1LFxyXG4gICAgICAvLyAgICAgLy8gICBtaW5QaXhlbFZhbHVlOiAxLFxyXG4gICAgICAvLyAgICAgLy8gfSksXHJcbiAgICAgIC8vICAgXSxcclxuICAgICAgLy8gfSxcclxuICAgIH0sXHJcblxyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICAvKipcclxuICAgICAgICogXHU2NTJGXHU2MzAxIGAudnVlYCBcdTY1ODdcdTRFRjZcdTc2ODRcdTg5RTNcdTY3OTBcclxuICAgICAgICovXHJcbiAgICAgIHZ1ZSgpLFxyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIFx1NTk4Mlx1Njc5Q1x1OTcwMFx1ODk4MVx1NjUyRlx1NjMwMSBgLnRzeGAgXHU3RUM0XHU0RUY2XHVGRjBDXHU4QkY3XHU1Qjg5XHU4OEM1IGBAdml0ZWpzL3BsdWdpbi12dWUtanN4YCBcdThGRDlcdTRFMkFcdTUzMDVcclxuICAgICAgICogXHU1NzI4XHU1NDdEXHU0RUU0XHU4ODRDXHU4RkQwXHU4ODRDXHU1Qjg5XHU4OEM1XHU1NDdEXHU0RUU0IGBucG0gaSAtRCBAdml0ZWpzL3BsdWdpbi12dWUtanN4YFxyXG4gICAgICAgKiBcdTVFNzZcdTU3MjhcdThGRDlcdTkxQ0NcdTZERkJcdTUyQTBcdTRFMDBcdTRFMkFcdTYzRDJcdTRFRjZcdTVCRkNcdTUxNjUgYGltcG9ydCB2dWVKc3ggZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlLWpzeCdgXHJcbiAgICAgICAqXHJcbiAgICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3ZpdGVqcy92aXRlLXBsdWdpbi12dWUvdHJlZS9tYWluL3BhY2thZ2VzL3BsdWdpbi12dWUtanN4XHJcbiAgICAgICAqL1xyXG4gICAgICAvLyB2dWVKc3goKSxcclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBcdTU5ODJcdTY3OUNcdTk3MDBcdTg5ODFcdTUxN0NcdTVCQjlcdTRGNEVcdTcyNDhcdTY3MkNcdTZENEZcdTg5QzhcdTU2NjhcdUZGMENcdThCRjdcdTVCODlcdTg4QzUgYEB2aXRlanMvcGx1Z2luLWxlZ2FjeWAgXHU4RkQ5XHU0RTJBXHU1MzA1XHJcbiAgICAgICAqIFx1NTQwQ1x1NjVGNlx1OEZEOFx1OTcwMFx1ODk4MVx1NUI4OVx1ODhDNSBgdGVyc2VyYCBcdTUzMDVcdUZGMENcdTU2RTBcdTRFM0FcdTY1RTdcdTcyNDhcdTYzRDJcdTRFRjZcdTRGN0ZcdTc1MjggVGVyc2VyIFx1OEZEQlx1ODg0Q1x1NkRGN1x1NkRDNlx1NTQ4Q1x1NTM4Qlx1N0YyOVx1MzAwMlxyXG4gICAgICAgKiBcdTU3MjhcdTU0N0RcdTRFRTRcdTg4NENcdThGRDBcdTg4NENcdTVCODlcdTg4QzVcdTU0N0RcdTRFRTQgYG5wbSBpIC1EIEB2aXRlanMvcGx1Z2luLWxlZ2FjeSB0ZXJzZXJgXHJcbiAgICAgICAqIFx1NUU3Nlx1NTcyOFx1OEZEOVx1OTFDQ1x1NkRGQlx1NTJBMFx1NEUwMFx1NEUyQVx1NjNEMlx1NEVGNlx1NUJGQ1x1NTE2NSBgaW1wb3J0IGxlZ2FjeSBmcm9tICdAdml0ZWpzL3BsdWdpbi1sZWdhY3knYFxyXG4gICAgICAgKlxyXG4gICAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS92aXRlanMvdml0ZS90cmVlL21haW4vcGFja2FnZXMvcGx1Z2luLWxlZ2FjeVxyXG4gICAgICAgKi9cclxuICAgICAgLy8gbGVnYWN5KHtcclxuICAgICAgLy8gICB0YXJnZXRzOiBbJ2RlZmF1bHRzJywgJ25vdCBJRSAxMSddLFxyXG4gICAgICAvLyB9KSxcclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjUgQVBJIFx1RkYwQ1x1NEUwRFx1NzUyOFx1NkJDRlx1NkIyMVx1OTBGRCBpbXBvcnRcclxuICAgICAgICpcclxuICAgICAgICogQHRpcHMgXHU1OTgyXHU2NzlDXHU3NkY0XHU2M0E1XHU0RjdGXHU3NTI4XHU2Q0ExXHU1QkZDXHU1MTY1XHU3Njg0IEFQSSBcdTRGOURcdTcxMzZcdTYzRDBcdTc5M0FcdTYyQTVcdTk1MTlcdUZGMENcdThCRjdcdTkxQ0RcdTU0MkYgVlMgQ29kZVxyXG4gICAgICAgKlxyXG4gICAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS91bnBsdWdpbi1hdXRvLWltcG9ydCNjb25maWd1cmF0aW9uXHJcbiAgICAgICAqL1xyXG4gICAgICBhdXRvSW1wb3J0KHtcclxuICAgICAgICBpbXBvcnRzOiBbJ3Z1ZScsICd2dWUtcm91dGVyJywgJ3BpbmlhJ10sXHJcbiAgICAgICAgZHRzOiAnc3JjL3R5cGVzL2RlY2xhcmF0aW9uLWZpbGVzL2F1dG8taW1wb3J0LmQudHMnLFxyXG4gICAgICAgIGVzbGludHJjOiB7XHJcbiAgICAgICAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgICAgICAgZmlsZXBhdGg6ICcuLy5lc2xpbnRyYy1hdXRvLWltcG9ydC5qc29uJyxcclxuICAgICAgICAgIGdsb2JhbHNQcm9wVmFsdWU6IHRydWUsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSksXHJcblxyXG4gICAgICAvKipcclxuICAgICAgICogXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1XHU3RUM0XHU0RUY2XHVGRjBDXHU0RTBEXHU3NTI4XHU2QkNGXHU2QjIxXHU5MEZEIGltcG9ydFxyXG4gICAgICAgKlxyXG4gICAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS91bnBsdWdpbi12dWUtY29tcG9uZW50cyNjb25maWd1cmF0aW9uXHJcbiAgICAgICAqL1xyXG4gICAgICBjb21wb25lbnRzKHtcclxuICAgICAgICBkaXJzOiBbJ3NyYy9jb21wb25lbnRzJ10sXHJcbiAgICAgICAgZGlyZWN0b3J5QXNOYW1lc3BhY2U6IHRydWUsXHJcbiAgICAgICAgY29sbGFwc2VTYW1lUHJlZml4ZXM6IHRydWUsXHJcbiAgICAgICAgZ2xvYmFsTmFtZXNwYWNlczogW10sXHJcbiAgICAgICAgZXh0ZW5zaW9uczogWyd2dWUnLCAndHMnLCAndHN4J10sXHJcbiAgICAgICAgZGVlcDogdHJ1ZSxcclxuICAgICAgICBkdHM6ICdzcmMvdHlwZXMvZGVjbGFyYXRpb24tZmlsZXMvY29tcG9uZW50cy5kLnRzJyxcclxuICAgICAgfSksXHJcblxyXG4gICAgICAvKipcclxuICAgICAgICogXHU1RjAwXHU3QkIxXHU1MzczXHU3NTI4XHU3Njg0IFRhaWx3aW5kIENTUyBcdTk4Q0VcdTY4M0NcdTUzOUZcdTVCNTBcdTdDN0JcdTVGMTVcdTY0Q0VcclxuICAgICAgICpcclxuICAgICAgICogQGRlc2NyaXB0aW9uIFx1OTE0RFx1N0Y2RVx1NjU4N1x1NEVGNlx1ODlDMSBgdW5vLmNvbmZpZy50c2BcclxuICAgICAgICpcclxuICAgICAgICogQHNlZSBodHRwczovL3Vub2Nzcy5kZXYvaW50ZWdyYXRpb25zL3ZpdGVcclxuICAgICAgICovXHJcbiAgICAgIHVub2NzcygpLFxyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIFx1NzI0OFx1Njc0M1x1NkNFOFx1OTFDQVxyXG4gICAgICAgKlxyXG4gICAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9jaGVuZ3BlaXF1YW4vdml0ZS1wbHVnaW4tYmFubmVyI2FkdmFuY2VkLXVzYWdlXHJcbiAgICAgICAqL1xyXG4gICAgICBiYW5uZXIoXHJcbiAgICAgICAgW1xyXG4gICAgICAgICAgYC8qKmAsXHJcbiAgICAgICAgICBgICogbmFtZTogJHtwa2cubmFtZX1gLFxyXG4gICAgICAgICAgYCAqIHZlcnNpb246IHYke3BrZy52ZXJzaW9ufWAsXHJcbiAgICAgICAgICBgICogZGVzY3JpcHRpb246ICR7cGtnLmRlc2NyaXB0aW9ufWAsXHJcbiAgICAgICAgICBgICogYXV0aG9yOiAke3BrZy5hdXRob3J9YCxcclxuICAgICAgICAgIGAgKi9gLFxyXG4gICAgICAgIF0uam9pbignXFxuJyksXHJcbiAgICAgICksXHJcblxyXG4gICAgICAvKipcclxuICAgICAgICogXHU0RTNBXHU1MTY1XHU1M0UzXHU2NTg3XHU0RUY2XHU1ODlFXHU1MkEwIEVKUyBcdTZBMjFcdTcyNDhcdTgwRkRcdTUyOUJcclxuICAgICAgICpcclxuICAgICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vdmJlbmpzL3ZpdGUtcGx1Z2luLWh0bWwvYmxvYi9tYWluL1JFQURNRS56aF9DTi5tZFxyXG4gICAgICAgKi9cclxuICAgICAgY3JlYXRlSHRtbFBsdWdpbih7XHJcbiAgICAgICAgbWluaWZ5OiB0cnVlLFxyXG4gICAgICAgIGluamVjdDoge1xyXG4gICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICBhcHBUaXRsZTogZW52LlZJVEVfQVBQX1RJVExFLFxyXG4gICAgICAgICAgICBhcHBEZXNjOiBlbnYuVklURV9BUFBfREVTQyxcclxuICAgICAgICAgICAgYXBwS2V5d29yZHM6IGVudi5WSVRFX0FQUF9LRVlXT1JEUyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfSksXHJcbiAgICBdLFxyXG4gIH1cclxufSlcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFx3b3Jrc3BhY2VcXFxcZ29sZC1oNVxcXFxzY3JpcHRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFx3b3Jrc3BhY2VcXFxcZ29sZC1oNVxcXFxzY3JpcHRzXFxcXGJ1aWxkLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi93b3Jrc3BhY2UvZ29sZC1oNS9zY3JpcHRzL2J1aWxkLnRzXCI7aW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXHJcbmltcG9ydCB7IGN3ZCB9IGZyb20gJ3Byb2Nlc3MnXHJcbmltcG9ydCBwa2cgZnJvbSAnLi4vcGFja2FnZS5qc29uJ1xyXG5cclxuY29uc3Qgd2hpdGVsaXN0ID0gWyd2dWUnXVxyXG5cclxudHlwZSBDaHVua0tleSA9IGtleW9mIHR5cGVvZiBwa2cuZGVwZW5kZW5jaWVzXHJcblxyXG5mdW5jdGlvbiBnZXRNYW51YWxDaHVua3MoKSB7XHJcbiAgY29uc3QgbWFudWFsQ2h1bmtzID0ge30gYXMgUmVjb3JkPENodW5rS2V5LCBbQ2h1bmtLZXldPlxyXG5cclxuICBmb3IgKGNvbnN0IGtleSBpbiBwa2cuZGVwZW5kZW5jaWVzKSB7XHJcbiAgICBpZiAoXHJcbiAgICAgIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChwa2cuZGVwZW5kZW5jaWVzLCBrZXkpICYmXHJcbiAgICAgICF3aGl0ZWxpc3QuaW5jbHVkZXMoa2V5KVxyXG4gICAgKSB7XHJcbiAgICAgIGNvbnN0IGsgPSBrZXkgYXMgQ2h1bmtLZXlcclxuICAgICAgbWFudWFsQ2h1bmtzW2tdID0gW2tdXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbWFudWFsQ2h1bmtzXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBtYW51YWxDaHVua3MgPSBnZXRNYW51YWxDaHVua3MoKVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFJvb3RQYXRoKCkge1xyXG4gIHJldHVybiByZXNvbHZlKGN3ZCgpKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RW52RGlyKCkge1xyXG4gIGNvbnN0IHJvb3RQYXRoID0gZ2V0Um9vdFBhdGgoKVxyXG4gIHJldHVybiByZXNvbHZlKHJvb3RQYXRoLCAnY29uZmlnJylcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGVudkRpciA9IGdldEVudkRpcigpXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0U291cmNlRGlyKHNvdXJjZURpcmVjdG9yeSA9ICdzcmMnKSB7XHJcbiAgY29uc3Qgcm9vdFBhdGggPSBnZXRSb290UGF0aCgpXHJcbiAgcmV0dXJuIHJlc29sdmUocm9vdFBhdGgsIHNvdXJjZURpcmVjdG9yeSlcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHNvdXJjZURpciA9IGdldFNvdXJjZURpcigpXHJcbiIsICJ7XG4gIFwibmFtZVwiOiBcImdvbGQtaDVcIixcbiAgXCJ2ZXJzaW9uXCI6IFwiMC4wLjBcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcIlwiLFxuICBcImF1dGhvclwiOiBcIlwiLFxuICBcImxpY2Vuc2VcIjogXCJNSVRcIixcbiAgXCJwcml2YXRlXCI6IHRydWUsXG4gIFwidHlwZVwiOiBcIm1vZHVsZVwiLFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwiZGV2XCI6IFwidml0ZSAtLW1vZGUgZGV2IC0taG9zdFwiLFxuICAgIFwiZGV2OnRlc3RcIjogXCJ2aXRlIC0tbW9kZSB0ZXN0IC0taG9zdFwiLFxuICAgIFwiZGV2OnByb2RcIjogXCJ2aXRlIC0tbW9kZSBwcm9kIC0taG9zdFwiLFxuICAgIFwiYnVpbGRcIjogXCJ2dWUtdHNjIC0tbm9FbWl0ICYmIHZpdGUgLS1tb2RlIHByb2QgYnVpbGRcIixcbiAgICBcImJ1aWxkOmRldlwiOiBcInZ1ZS10c2MgLS1ub0VtaXQgJiYgdml0ZSAtLW1vZGUgZGV2IGJ1aWxkXCIsXG4gICAgXCJidWlsZDp0ZXN0XCI6IFwidnVlLXRzYyAtLW5vRW1pdCAmJiB2aXRlIC0tbW9kZSB0ZXN0IGJ1aWxkXCIsXG4gICAgXCJwcmV2aWV3XCI6IFwidml0ZSBwcmV2aWV3IC0taG9zdFwiLFxuICAgIFwibGludFwiOiBcImVzbGludCBzcmNcIixcbiAgICBcImZvcm1hdFwiOiBcInByZXR0aWVyIC0td3JpdGUgc3JjXCIsXG4gICAgXCJtaXJyb3I6Z2V0XCI6IFwibnBtIGNvbmZpZyBnZXQgcmVnaXN0cnlcIixcbiAgICBcIm1pcnJvcjpzZXRcIjogXCJucG0gY29uZmlnIHNldCByZWdpc3RyeSBodHRwczovL3JlZ2lzdHJ5Lm5wbW1pcnJvci5jb21cIixcbiAgICBcIm1pcnJvcjpybVwiOiBcIm5wbSBjb25maWcgcm0gcmVnaXN0cnlcIixcbiAgICBcImJhY2t1cFwiOiBcImdpdCBhZGQgLiAmJiBnaXQgY29tbWl0IC1tIFxcXCJjaG9yZTogYmFja3VwXFxcIiAmJiBnaXQgcHVzaFwiLFxuICAgIFwidXBcIjogXCJucHggbnBtLWNoZWNrLXVwZGF0ZXMgLXVcIixcbiAgICBcInByZXBhcmVcIjogXCJodXNreSBpbnN0YWxsXCJcbiAgfSxcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQGJhc3Npc3QvcHJvZ3Jlc3NcIjogXCJeMC4yLjJcIixcbiAgICBcIkBiYXNzaXN0L3V0aWxzXCI6IFwiXjAuMTQuMFwiLFxuICAgIFwicGluaWFcIjogXCJeMi4xLjdcIixcbiAgICBcInZ1ZVwiOiBcIl4zLjQuMTVcIixcbiAgICBcInZ1ZS1yb3V0ZXJcIjogXCJeNC4yLjVcIlxuICB9LFxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAYmFzc2lzdC9lc2xpbnRcIjogXCJeMC41LjBcIixcbiAgICBcIkBiYXNzaXN0L3RzY29uZmlnXCI6IFwiXjAuMS4xXCIsXG4gICAgXCJAYmFzc2lzdC91bm9cIjogXCJeMC4xLjNcIixcbiAgICBcIkB0eXBlcy9ub2RlXCI6IFwiXjIwLjExLjVcIixcbiAgICBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiOiBcIl41LjAuM1wiLFxuICAgIFwiZXNsaW50XCI6IFwiXjguNTYuMFwiLFxuICAgIFwiaHVza3lcIjogXCJeOC4wLjNcIixcbiAgICBcImxlc3NcIjogXCJeNC4yLjBcIixcbiAgICBcImxpbnQtc3RhZ2VkXCI6IFwiXjE1LjIuMFwiLFxuICAgIFwicHJldHRpZXJcIjogXCJeMy4yLjRcIixcbiAgICBcInR5cGVzY3JpcHRcIjogXCJeNS4zLjNcIixcbiAgICBcInVub2Nzc1wiOiBcIl4wLjU4LjNcIixcbiAgICBcInVucGx1Z2luLWF1dG8taW1wb3J0XCI6IFwiXjAuMTcuM1wiLFxuICAgIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHNcIjogXCJeMC4yNi4wXCIsXG4gICAgXCJ2aXRlXCI6IFwiXjUuMC4xMVwiLFxuICAgIFwidml0ZS1wbHVnaW4tYmFubmVyXCI6IFwiXjAuNy4xXCIsXG4gICAgXCJ2aXRlLXBsdWdpbi1odG1sXCI6IFwiXjMuMi4yXCIsXG4gICAgXCJ2dWUtdHNjXCI6IFwiXjEuOC4yN1wiXG4gIH0sXG4gIFwibGludC1zdGFnZWRcIjoge1xuICAgIFwiKi57anMsanN4LHZ1ZSx0cyx0c3h9XCI6IFtcbiAgICAgIFwicHJldHRpZXIgLS13cml0ZVwiLFxuICAgICAgXCJlc2xpbnQgLS1maXhcIlxuICAgIF1cbiAgfVxufSJdLAogICJtYXBwaW5ncyI6ICI7QUFBb1AsU0FBUyxjQUFjLGVBQWU7QUFDMVIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9B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
