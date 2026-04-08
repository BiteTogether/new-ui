const { withAppBuildGradle } = require('@expo/config-plugins');
module.exports = function withAndroidDesugaring (
  config,
  options = { desugarVersion: "2.0.4" },
) {
  const desugarVersion = options.desugarVersion;
  return withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents;
    if (!contents.includes("coreLibraryDesugaringEnabled")) {
      if (contents.includes("compileOptions {")) {
        contents = contents.replace(
          /compileOptions\s*{\s*/,
          `compileOptions {
              coreLibraryDesugaringEnabled true
          `,
        );
      } else {
        contents = contents.replace(
          /android\s*{\s*/,
          `android {
            compileOptions {
              sourceCompatibility JavaVersion.VERSION_1_8
              targetCompatibility JavaVersion.VERSION_1_8
              coreLibraryDesugaringEnabled true
              }
          `,
        );
      }
    }
    if (!contents.includes("desugar_jdk_libs")) {
      contents = contents.replace(
        /dependencies\s*{\s*/,
        `dependencies {
          coreLibraryDesugaring "com.android.tools:desugar_jdk_libs:${desugarVersion}"
        `,
      );
    }
    config.modResults.contents = contents;
    return config;
  });
};
