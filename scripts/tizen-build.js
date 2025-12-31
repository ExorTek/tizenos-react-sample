import { execSync } from 'node:child_process';
import { existsSync, readFileSync, copyFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Constants
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');
const DIST_DIR = join(ROOT_DIR, 'dist');
const BUILD_RESULT_DIR = join(DIST_DIR, '.buildResult');

const REQUIRED_FILES = ['config.xml', '.project', '.tproject'];
const OPTIONAL_FILES = ['icon.png'];

const EXIT_CODES = {
  SUCCESS: 0,
  MISSING_ARGS: 1,
  MISSING_DIST: 2,
  COPY_FAILED: 3,
  BUILD_FAILED: 4,
  PACKAGE_FAILED: 5,
};

/**
 * Validates certificate name to prevent command injection
 */
function validateCertificateName(name) {
  if (!name || typeof name !== 'string') {
    return false;
  }

  // Allow alphanumeric, dash, underscore only
  const safePattern = /^[a-zA-Z0-9_-]+$/;
  return safePattern.test(name);
}

/**
 * Safely escapes shell arguments
 */
function escapeShellArg(arg) {
  // For cross-platform compatibility, use double quotes and escape special chars
  return `"${arg.replace(/["\\]/g, '\\$&')}"`;
}

/**
 * Copies a file with error handling
 */
function safeCopyFile(fileName, required = false) {
  const sourcePath = join(ROOT_DIR, fileName);
  const targetPath = join(DIST_DIR, fileName);

  if (!existsSync(sourcePath)) {
    if (required) {
      throw new Error(`Required file not found: ${fileName}`);
    }
    console.warn(`⚠️  Optional file not found: ${fileName}`);
    return false;
  }

  try {
    copyFileSync(sourcePath, targetPath);
    console.log(`✅ Copied: ${fileName}`);
    return true;
  } catch (error) {
    const message = `Failed to copy ${fileName}: ${error.message}`;
    if (required) {
      throw new Error(message);
    }
    console.warn(`⚠️  ${message}`);
    return false;
  }
}

/**
 * Reads and parses .buildignore file
 */
function parseExcludePatterns() {
  const buildignorePath = join(ROOT_DIR, '.buildignore');

  if (!existsSync(buildignorePath)) {
    console.warn('⚠️  .buildignore not found, using default exclusions');
    return ['.*', 'node_modules/*', 'src/*', '*.md'];
  }

  try {
    const content = readFileSync(buildignorePath, 'utf8');
    return content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'));
  } catch (error) {
    console.warn(`⚠️  Failed to read .buildignore: ${error.message}`);
    return ['.*', 'node_modules/*', 'src/*', '*.md'];
  }
}

/**
 * Executes a shell command safely
 */
function executeCommand(command, description, exitCode) {
  console.log(`\n🔧 ${description}...`);
  console.log(`   ${command}\n`);

  try {
    execSync(command, {
      cwd: ROOT_DIR,
      stdio: 'inherit',
      shell: true,
      windowsHide: true,
    });
    console.log(`✅ ${description} completed\n`);
    return true;
  } catch (error) {
    console.error(`\n❌ ${description} failed`);
    console.error(`   Error: ${error.message}\n`);
    process.exit(exitCode);
  }
}

/**
 * Main build function
 */
function buildTizenPackage() {
  // 1. Validate arguments
  const certificateName = process.argv[2];

  if (!certificateName) {
    console.error('❌ Usage: node tizen-build.js <certificate-name>\n');
    console.error('   Example: node tizen-build.js SamsungCert\n');
    process.exit(EXIT_CODES.MISSING_ARGS);
  }

  if (!validateCertificateName(certificateName)) {
    console.error('❌ Invalid certificate name. Use only alphanumeric, dash, and underscore.\n');
    process.exit(EXIT_CODES.MISSING_ARGS);
  }

  console.log('🚀 Tizen Build Process');
  console.log('━'.repeat(50));
  console.log(`📜 Certificate: ${certificateName}`);
  console.log(`📁 Root: ${ROOT_DIR}`);
  console.log(`📦 Dist: ${DIST_DIR}\n`);

  // 2. Verify dist directory exists
  if (!existsSync(DIST_DIR)) {
    console.error('❌ dist/ not found. Run "yarn build" first.\n');
    process.exit(EXIT_CODES.MISSING_DIST);
  }

  // 3. Copy required files
  console.log('📋 Copying configuration files...\n');

  try {
    REQUIRED_FILES.forEach(file => safeCopyFile(file, true));
    OPTIONAL_FILES.forEach(file => safeCopyFile(file, false));
  } catch (error) {
    console.error(`\n❌ File copy failed: ${error.message}\n`);
    process.exit(EXIT_CODES.COPY_FAILED);
  }

  // 4. Build exclude arguments
  const excludePatterns = parseExcludePatterns();
  const excludeArgs = excludePatterns.map(pattern => `-e ${escapeShellArg(pattern)}`).join(' ');

  // 5. Build web package
  const buildWebCmd = `tizen build-web ${excludeArgs} -- ${escapeShellArg('./dist')}`;
  executeCommand(buildWebCmd, 'Building Tizen web package', EXIT_CODES.BUILD_FAILED);

  // 6. Verify build result
  if (!existsSync(BUILD_RESULT_DIR)) {
    console.error('❌ .buildResult/ not found after build-web\n');
    process.exit(EXIT_CODES.BUILD_FAILED);
  }

  // 7. Package WGT
  const packageCmd = `tizen package -t wgt -s ${escapeShellArg(certificateName)} -- ${escapeShellArg('./dist/.buildResult')}`;
  executeCommand(packageCmd, 'Packaging WGT file', EXIT_CODES.PACKAGE_FAILED);

  // 8. Success
  console.log('━'.repeat(50));
  console.log('🎉 Build completed successfully!\n');
  console.log(`📦 Output: ${BUILD_RESULT_DIR}\n`);
}

// Run the build
buildTizenPackage();
