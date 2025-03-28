const fs = require('fs');
const path = require('path');

// Function to ensure the android directory exists
function ensureAndroidDirExists() {
  const androidDir = path.join(__dirname, 'android');
  if (!fs.existsSync(androidDir)) {
    fs.mkdirSync(androidDir, { recursive: true });
  }
  return androidDir;
}

// Function to create or update gradle.properties with Kotlin compatibility fix
function updateGradleProperties() {
  const androidDir = ensureAndroidDirExists();
  const gradlePropsPath = path.join(androidDir, 'gradle.properties');
  
  let content = '';
  if (fs.existsSync(gradlePropsPath)) {
    content = fs.readFileSync(gradlePropsPath, 'utf8');
  }

  // Add the Kotlin compatibility flag if it doesn't exist
  if (!content.includes('android.suppressKotlinVersionCompatibilityCheck')) {
    content += '\n# Suppress Kotlin version compatibility check\nandroid.suppressKotlinVersionCompatibilityCheck=true\n';
    fs.writeFileSync(gradlePropsPath, content, 'utf8');
    console.log('✅ Added Kotlin version compatibility fix to gradle.properties');
  } else {
    console.log('ℹ️ Kotlin version compatibility fix already exists in gradle.properties');
  }
}

// Run the updates
try {
  updateGradleProperties();
  console.log('✅ Prebuild script completed successfully');
} catch (error) {
  console.error('❌ Error in prebuild script:', error);
  process.exit(1);
}
