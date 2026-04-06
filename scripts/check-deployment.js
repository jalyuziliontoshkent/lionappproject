#!/usr/bin/env node

/**
 * Pre-deployment checklist for LIONJALYUZI Vercel deployment
 * Run this before deploying to ensure everything is configured correctly
 */

const fs = require('fs');
const path = require('path');

const checks = {
  projectStructure: [
    { name: 'vercel.json exists', path: 'vercel.json' },
    { name: '.vercelignore exists', path: '.vercelignore' },
    { name: 'website/package.json exists', path: 'website/package.json' },
    { name: 'website/tsconfig.json exists', path: 'website/tsconfig.json' },
    { name: 'backend/server.py exists', path: 'backend/server.py' },
    { name: 'backend/requirements.txt exists', path: 'backend/requirements.txt' },
  ],
  environmentFiles: [
    { name: 'website/.env.example exists', path: 'website/.env.example' },
    { name: 'backend/.env.example exists', path: 'backend/.env.example' },
  ],
  documentationFiles: [
    { name: 'DEPLOYMENT.md exists', path: 'DEPLOYMENT.md' },
    { name: '.gitignore exists', path: '.gitignore' },
  ],
};

function checkFileExists(filePath) {
  return fs.existsSync(path.join(__dirname, '../', filePath));
}

function runChecks() {
  console.log('\n🔍 LIONJALYUZI Vercel Deployment Checklist\n');
  console.log('=' . repeat(50));

  let allPassed = true;

  for (const [category, items] of Object.entries(checks)) {
    console.log(`\n📋 ${category.replace(/([A-Z])/g, ' $1').toUpperCase()}:`);
    
    items.forEach(item => {
      const passed = checkFileExists(item.path);
      const status = passed ? '✅' : '❌';
      console.log(`  ${status} ${item.name}`);
      if (!passed) allPassed = false;
    });
  }

  console.log('\n' + '=' . repeat(50));

  if (allPassed) {
    console.log('\n✨ All checks passed! Ready for Vercel deployment.\n');
    console.log('📝 Next steps:');
    console.log('  1. Commit all changes: git add . && git commit -m "Prepare for Vercel deployment"');
    console.log('  2. Push to GitHub: git push origin main');
    console.log('  3. Import project in Vercel dashboard');
    console.log('  4. Set environment variables in Vercel settings');
    console.log('  5. Deploy!\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some checks failed. Please fix the issues above.\n');
    process.exit(1);
  }
}

runChecks();
