import { copyFileSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');

console.log('📦 Preparing Tizen package...');

if (!existsSync(distDir)) {
  console.error('❌ dist directory not found. Run "yarn build" first.');
  process.exit(1);
}

// Fix index.html paths for Tizen
const indexPath = join(distDir, 'index.html');
if (existsSync(indexPath)) {
  let html = readFileSync(indexPath, 'utf8');

  // Convert absolute paths to relative
  html = html.replace(/href="\//g, 'href="./');
  html = html.replace(/src="\//g, 'src="./');

  writeFileSync(indexPath, html, 'utf8');
  console.log('✅ Fixed index.html paths');
}

// Copy config.xml
copyFileSync(join(rootDir, 'config.xml'), join(distDir, 'config.xml'));
console.log('✅ Copied config.xml');

// Copy icon
const iconSrc = join(rootDir, 'icon.png');
const iconDest = join(distDir, 'icon.png');
if (existsSync(iconSrc)) {
  copyFileSync(iconSrc, iconDest);
  console.log('✅ Copied icon.png');
}

// Create .project
const projectXml = `<?xml version="1.0" encoding="UTF-8"?>
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

writeFileSync(join(distDir, '.project'), projectXml, 'utf8');
console.log('✅ Created .project');

// Create .tproject
const tprojectXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
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

writeFileSync(join(distDir, '.tproject'), tprojectXml, 'utf8');
console.log('✅ Created .tproject');

console.log('✨ Tizen package ready!');
