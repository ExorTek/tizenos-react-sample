import { execSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');
const WGT_PATH = join(ROOT_DIR, 'dist', '.buildResult', '*.wgt');

let inputAddress = process.argv[2];

const ipAndPortPattern = /^(\d{1,3}\.){3}\d{1,3}:\d{1,5}$/;

if (inputAddress && !ipAndPortPattern.test(inputAddress)) {
  console.error('\n❌ Invalid address format. Use IP:PORT (e.g., 192.168.1.100:26101)\n');
  process.exit(1);
}

const addressArg = inputAddress ? `-s ${inputAddress}` : '';
const cmd = `tizen install -n ${WGT_PATH} ${addressArg}`.trim();

console.log(`\n🚀 ${cmd}\n`);

try {
  execSync(cmd, { stdio: 'inherit', shell: true, cwd: ROOT_DIR });
  console.log('\n✅ Installation completed!\n');
} catch (error) {
  console.error('\n❌ Installation failed!\n');
  process.exit(1);
}
