import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname);

function generateExports() {
  const srcDir = path.join(projectRoot, 'src');
  
  // 获取src目录下所有的js文件
  const jsFiles = fs.readdirSync(srcDir)
    .filter(file => fs.statSync(path.join(srcDir, file)).isFile() && path.extname(file) === '.js')
    .map(file => path.basename(file, '.js'))
    .sort();
  
  // 生成 index.js 内容
  const exportLines = jsFiles.map(file => `export * from './src/${file}.js';`);
  const indexContent = exportLines.join('\n') + '\n';
  
  // 写入 index.js 文件
  fs.writeFileSync(path.join(projectRoot, 'index.js'), indexContent);
  console.log('index.js 文件已生成');
  
  // 构建 package.json 的 exports 字段
  const exports = {
    ".": {
      "import": "./index.js",
      "types": "./types/index.d.ts"
    }
  };
  
  // 为每个文件添加导出配置
  jsFiles.forEach(file => {
    exports[`./${file}`] = {
      "import": `./src/${file}.js`,
      "types": `./types/src/${file}.d.ts`
    };
  });
  
  // 更新 package.json
  const packagePath = path.join(projectRoot, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  packageJson.exports = exports;
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
  
  console.log('Exports 字段已更新');
}

generateExports();