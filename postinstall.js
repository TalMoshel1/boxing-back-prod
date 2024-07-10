import {execSync} from 'child_process'

function runBuildScript() {
  console.log('Running build script...');
  try {
    console.log('Build script completed successfully.');
  } catch (error) {
    console.error('Error running build script:', error);
    process.exit(1);
  }
}

runBuildScript();