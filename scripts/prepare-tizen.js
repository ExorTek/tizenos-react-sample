import { copyFileSync, mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');

console.log('📦 Preparing Tizen package...');

// Ensure dist directory exists
if (!existsSync(distDir)) {
  console.error('❌ dist directory not found. Run "yarn build" first.');
  process.exit(1);
}

// Copy config.xml
try {
  copyFileSync(join(rootDir, 'config.xml'), join(distDir, 'config.xml'));
  console.log('✅ Copied config.xml');
} catch (error) {
  console.error('❌ Failed to copy config.xml:', error.message);
  process.exit(1);
}

// Copy icon
try {
  const iconSrc = join(rootDir, 'icon.png');
  const assetsDir = join(distDir, 'assets');
  const iconDest = join(assetsDir, 'icon.png');

  if (existsSync(iconSrc)) {
    // Ensure assets directory exists
    if (!existsSync(assetsDir)) {
      mkdirSync(assetsDir, { recursive: true });
    }
    copyFileSync(iconSrc, iconDest);
    console.log('✅ Copied icon.png');
  } else {
    console.warn('⚠️  icon.png not found, skipping...');
  }
} catch (error) {
  console.error('❌ Failed to copy icon:', error.message);
}

// Create .project file (CRITICAL - Tizen CLI needs this!)
const projectContent = `<?xml version="1.0" encoding="UTF-8"?>
<projectDescription>
    <name>tizenos-react-sample</name>
    <comment></comment>
    <projects></projects>
    <buildSpec>
        <buildCommand>
            <name>org.tizen.web.project.builder.WebBuilder</name>
            <arguments></arguments>
        </buildCommand>
    </buildSpec>
    <natures>
        <nature>org.tizen.web.project.builder.WebNature</nature>
    </natures>
</projectDescription>`;

try {
  writeFileSync(join(distDir, '.project'), projectContent, 'utf8');
  console.log('✅ Created .project');
} catch (error) {
  console.error('❌ Failed to create .project:', error.message);
}

// Create .tproject file (optional but good to have)
const tprojectContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<tproject xmlns="http://www.tizen.org/tproject">
    <platforms>
        <platform>
            <name>tv-samsung-9.0</name>
        </platform>
    </platforms>
    <package>
        <blacklist/>
    </package>
</tproject>`;

try {
  writeFileSync(join(distDir, '.tproject'), tprojectContent, 'utf8');
  console.log('✅ Created .tproject');
} catch (error) {
  console.error('❌ Failed to create .tproject:', error.message);
}

console.log('✅ Tizen package preparation complete!');
console.log('📍 Output directory:', distDir);
