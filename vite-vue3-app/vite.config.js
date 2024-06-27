import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      vue: path.resolve(__dirname, '../vue3-submodule/packages/vue/src'),
      '@vue/runtime-dom': path.resolve(
        __dirname,
        '../vue3-submodule/packages/runtime-dom/src'
      ),
      '@vue/runtime-core': path.resolve(
        __dirname,
        '../vue3-submodule/packages/runtime-core/src'
      ),
      '@vue/reactivity': path.resolve(
        __dirname,
        '../vue3-submodule/packages/reactivity/src'
      ),
      '@vue/shared': path.resolve(
        __dirname,
        '../vue3-submodule/packages/shared/src'
      ),
      '@vue/compiler-dom': path.resolve(
        __dirname,
        '../vue3-submodule/packages/compiler-dom/src'
      ),
      '@vue/compiler-core': path.resolve(
        __dirname,
        '../vue3-submodule/packages/compiler-core/src'
      ),
      '@vue/compiler-sfc': path.resolve(
        __dirname,
        '../vue3-submodule/packages/compiler-sfc/src'
      ),
      '@vue/compiler-ssr': path.resolve(
        __dirname,
        '../vue3-submodule/packages/compiler-ssr/src'
      ),
    },
  },
  define: {
    // 环境标志
    __DEV__: process.env.NODE_ENV !== 'production', // 开发环境标志
    __TEST__: process.env.NODE_ENV === 'test', // 测试环境标志

    // 兼容模式和 SSR 标志
    __COMPAT__: false, // Vue 2.x 兼容模式标志，根据需要设置为 true 或 false
    __SSR__: false, // 服务端渲染标志，根据需要设置为 true 或 false

    // 版本信息
    __VERSION__: JSON.stringify(
      require('../vue3-submodule/packages/vue/package.json').version // 从 Vue 包的 package.json 中读取版本号
    ),

    // 特性标志
    __FEATURE_OPTIONS_API__: true, // 启用 Options API 特性
    __FEATURE_SUSPENSE__: true, // 启用 Suspense 特性
    __ESM_BUNDLER__: true, // ESM 捆绑器标志，根据需要设置为 true 或 false
    __BROWSER__: true, // 浏览器环境标志，根据需要设置为 true 或 false

    // 生产环境开发工具标志
    __VUE_PROD_DEVTOOLS__:
      process.env.NODE_ENV === 'production' ? 'false' : 'true', // 生产环境下禁用开发工具

    // 生产环境水合不匹配详情标志
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false', // 禁用生产环境中的水合不匹配详情
    __FEATURE_PROD_DEVTOOLS__:
      process.env.NODE_ENV === 'production' ? 'false' : 'true', // 生产环境下禁用开发工具
    __FEATURE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false', // 禁用生产环境中的水合不匹配详情
  },
});
