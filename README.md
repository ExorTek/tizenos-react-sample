# 📺 Tizen React Sample

A modern, performant, and developer-friendly **Samsung Tizen TV application** template. Built with React 19, Vite, and Rolldown.

## 🚀 Quick Start

### Prerequisites

- **Node.js** v24 or higher
- **Yarn** (if not installed: `corepack enable`)
- **Tizen Studio** - Required for Samsung TV development
  - [Download Tizen Studio](https://developer.tizen.org/development/tizen-studio/download/) or [Download Tizen CLI](https://samsungtizenos.com/tools-download/)
  - Ensure `tizen` CLI is added to your PATH after installation
- **Tizen Certificate** - Required for app signing
  - Create one through Tizen Certificate Manager

### Installation

```bash
# Clone the repository
git clone https://github.com/ExorTek/tizens-react-sample.git
cd tizenos-react-sample

# Install dependencies
yarn install
```

## 🛠️ Development

### Development Server

Start the local development server with hot reload:

```bash
yarn dev
```

The app will be available at `http://localhost:5173`

**Note:** The dev server is configured to listen on `0.0.0.0:5173`, making it accessible from your TV or other devices on the same network.

### Build for Production

Build the application for production deployment:

```bash
yarn build
```

### Code Quality

```bash
# Format code with Prettier (Please run before committing)
yarn format
```

## 📦 Tizen Packaging & Deployment

### Full Build & Package

Build the app and create a Tizen WGT package in one command:

```bash
yarn tizen:full
```

**What this does:**

1. Runs `yarn build` to create production build
2. Copies required Tizen config files to `dist/`
3. Builds a Tizen web package
4. Creates a signed `.wgt` file using your certificate

**Arguments:**

- Certificate name (required): Replace `TizenEmu` with your certificate name

Example:

```bash
# Using custom certificate
yarn build && node scripts/tizen-build.js MyCertName
```

### Install to Device

#### Local/Emulator Installation

Install the packaged app to a connected device or emulator:

```bash
yarn install:dev
```

#### Remote Device Installation

Install to a specific TV by IP address:

```bash
yarn install:remote
```

**Note:** Update the IP address in `package.json` or pass it as an argument:

```bash
node scripts/tizen-install.js 192.168.1.100:26101
```

## 📁 Project Structure

```
tizenos-react-sample/
├── dist/                    # Production build output
│   └── .buildResult/        # Tizen build artifacts and .wgt files
├── public/                  # Static assets (copied to dist during build)
├── scripts/
│   ├── tizen-build.js       # Automated Tizen packaging script
│   └── tizen-install.js     # Device installation script
├── src/*                    # App source code
├── .buildignore             # Files excluded from Tizen package
├── config.xml               # Tizen app configuration
├── .project                 # Tizen project metadata
├── .tproject                # Tizen project settings
├── icon.png                 # App icon (117x117 recommended)
├── index.html               # HTML entry point
├── vite.config.js           # Vite configuration
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

## ⚙️ Configuration

### Tizen Configuration (config.xml)

The `config.xml` file contains your app's metadata and permissions:

```xml
<widget id="http://yourdomain/tizen-react-sample" version="1.0.0">
    <tizen:application id="id.ReactSample" package="id"/>
    <author>ExorTek</author>
    <name>ReactSample</name>
    <tizen:profile name="tv-samsung"/>
    <!-- ... other settings -->
</widget>
```

**Important fields to customize:**

- `widget id`: Your app's unique identifier
- `tizen:application id`: Must match your certificate
- `package`: Package identifier
- `version`: App version (semantic versioning)
- `name`: Display name on TV

### Build Ignore (.buildignore)

Files and directories excluded from the final `.wgt` package:

- Source files (`src/*`)
- Development dependencies (`node_modules/*`)
- Build scripts (`scripts/*`)
- Documentation (`*.md`)
- Config files (`vite.config.js`, etc.)
- Version control (`.git/*`)

Only the compiled `dist/` contents and essential config files are included.

## 🔧 Build Scripts Explained

### tizen-build.js

Automated build script with safety features:

**Usage:**

```bash
node scripts/tizen-build.js <certificate-name>
```

### tizen-install.js

Device installation script:

- Installs to local device/emulator by default
- Supports remote installation with IP:PORT
- Input validation for IP addresses
- Clear error reporting

## 🎯 Development Workflow

### Typical Development Cycle

1. **Start Development**

   ```bash
   yarn dev
   ```

2. **Make Changes**

- Edit files in `src/`
- Changes auto-reload in browser

3. **Test on Device**

   ```bash
   yarn tizen:full
   yarn install:dev
   ```

4. **Verify & Deploy**

- Test on actual TV hardware
- Verify all features work correctly

### Testing on Samsung TV

1. **Enable Developer Mode on TV:**

- Go to Apps
- Press `12345` on remote
- Enable Developer Mode
- Enter your PC's IP address

2. **Connect TV:**

   ```bash
   tizen connect <TV_IP>:26101
   ```

3. **Install App:**
   ```bash
   yarn install:remote
   ```

## 🔐 Certificate Management

### Creating a Certificate

1. Open Tizen Certificate Manager
2. Create a new Samsung certificate profile
3. Note the certificate name (e.g., `MyCert`)
4. Use this name in build commands

### Updating Certificate

If you need to change certificates:

1. Update the certificate name in build commands
2. Rebuild and repackage:
   ```bash
   yarn build && node scripts/tizen-build.js NewCertName
   ```

## 🐛 Troubleshooting

### Common Issues

**"tizen: command not found"**

- Ensure Tizen Studio is installed
- Add Tizen CLI to your PATH:
  ```bash
  export PATH=$PATH:/path/to/tizen-studio/tools/ide/bin
  ```

**Build fails with certificate error**

- Verify certificate name is correct
- Ensure certificate is properly configured in Tizen Studio
- Check certificate permissions

**App doesn't install on TV**

- Verify TV is in Developer Mode
- Check TV and PC are on same network
- Confirm connection: `tizen connect <TV_IP>:26101`

**"dist/ not found" error**

- Run `yarn build` before packaging
- Check for build errors in console

### Debug Mode

To enable verbose logging during build:

```bash
# Modify scripts/tizen-build.js temporarily
stdio: 'inherit'  // Shows all build output
```

---

**Built with ❤️ by [ExorTek](https://github.com/ExorTek)**
