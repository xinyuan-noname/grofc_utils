import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { transformSync } from '@babel/core';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname);
function build() {
  const SRC_DIR = path.resolve(__dirname, 'src');
  const CJS_DIR = path.resolve(__dirname, 'dist/cjs');
  const ESM_DIR = path.resolve(__dirname, 'dist/esm');
  fs.mkdirSync(CJS_DIR, { recursive: true });
  fs.mkdirSync(ESM_DIR, { recursive: true });
  function convertFile(filename) {
    const srcPath = path.resolve(SRC_DIR, filename);
    const cjsPath = path.resolve(CJS_DIR, filename);
    const esmPath = path.resolve(ESM_DIR, filename)

    const code = fs.readFileSync(srcPath, 'utf8');

    const result = transformSync(code, {
      plugins: ['@babel/plugin-transform-modules-commonjs'],
      sourceMaps: false,
      configFile: false,
    });

    fs.writeFileSync(esmPath, code);
    fs.writeFileSync(cjsPath, result.code);
    console.log(`✅ ${filename}`);
  }

  const jsFiles = fs.readdirSync(SRC_DIR).filter(f => f.endsWith(".js"))
  jsFiles.forEach(convertFile);
  const jsFilesWithoutExt = jsFiles.map(f => path.basename(f, ".js"))
  // 生成 cjs/index.js（手动聚合）
  const cjsIndexContent = jsFilesWithoutExt.map(name => `  ${name}: require('./${name}')`).join(',\n');

  fs.writeFileSync(
    path.resolve(CJS_DIR, 'index.js'),
    `module.exports = {\n${cjsIndexContent}\n};\n`
  );
  console.log('✅ cjs/index.js');

  // 生成 index.js 内容
  const esmIndexContent = jsFilesWithoutExt.map(name => `export * from './${name}.js';`).join('\n') + '\n';
  fs.writeFileSync(path.resolve(ESM_DIR, 'index.js'), esmIndexContent);
  console.log('✅ cjs/index.js');

  // 更新 package.json
  const exports = {
    ".": {
      "import": "./dist/esm/index.js",
      "require": "./dist/cjs/index.js",
      "types": "./dist/types/index.d.ts"
    }
  };
  jsFilesWithoutExt.forEach(name => {
    exports[`./${name}`] = {
      "import": `./dist/esm/${name}.js`,
      "require": `./dist/cjs/${name}.js`,
      "types": `./dist/types/${name}.d.ts`
    };
  });
  const packagePath = path.join(projectRoot, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  packageJson.exports = exports;
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
}

build();