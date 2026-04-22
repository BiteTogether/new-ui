import * as ImageManipulator from "expo-image-manipulator";
const { SaveFormat } = ImageManipulator;
import * as FileSystem from "expo-file-system/legacy";

/**
 * Compress image for SEO
 * Target: 100KB max size, iterative compression with quality and dimension reduction
 */
export const compressImageWithExpo = async (
  imageUri: string, // The local URI of the image (e.g., from ImagePicker)
  fileName: string, // The original file name (e.g., "my-photo.jpg")
): Promise<string | null> => {
  try {
    const targetMaxSizeKB = 100 * 1024; // 100KB in bytes
    let currentQuality = 0.85; // Starting compression quality
    const reductionFactor = 0.9; // How much to reduce dimensions each time
    const maxIterations = 7; // Safety limit to prevent endless loops

    // 1. Get original image dimensions
    const imageInfo = await ImageManipulator.manipulateAsync(imageUri, [], {
      compress: 1, // We just want info, not to compress yet
      format: SaveFormat.PNG, // Format doesn't matter for info
    });

    // Default to common sizes if info is missing
    let currentWidth = imageInfo.width || 1920;
    let currentHeight = imageInfo.height || 1080;

    // Note: ImageManipulator.manipulate() automatically
    // closes the file handle after running so we dont have to worry
    // about memory leaks

    // 2. Check original file size to decide if we need aggressive reduction
    let originalSize = 0;
    try {
      const info = await FileSystem.getInfoAsync(imageUri);
      if (info.exists) {
        originalSize = info.size || 0;
      }
    } catch (e) {
      console.warn("Could not get original file info:", e);
    }
    const needsAggressiveReduction = originalSize > 2 * 1024 * 1024; // > 2MB

    // This is our recursive function that keeps compressing
    const compressImageIteratively = async (
      width: number,
      height: number,
      quality: number,
      iteration: number = 0,
    ): Promise<string> => {
      // Safety check: stop if we've tried too many times
      if (iteration >= maxIterations) {
        console.warn(
          "Max compression iterations reached. Returning last best attempt.",
        );
        // Even if over limit, return the last generated URI
        const finalResult = await ImageManipulator.manipulateAsync(
          imageUri,
          [{ resize: { width: width, height: height } }],
          {
            compress: quality,
            format: SaveFormat.WEBP,
          },
        );
        return finalResult.uri;
      }

      // Try compressing with current settings
      const compressedResult = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          { resize: { width: width, height: height } }, // Resize first
        ],
        {
          compress: quality, // Then compress
          format: SaveFormat.WEBP, // And convert to WebP
        },
      );

      // Get the size of the newly compressed image
      const fileInfo = await FileSystem.getInfoAsync(compressedResult.uri);
      const fileSize = fileInfo.exists ? fileInfo.size || 0 : 0;

      // Check if we hit our target size
      if (fileSize <= targetMaxSizeKB) {
        console.log(`Image compressed to ${Math.round(fileSize / 1024)}KB`);
        return compressedResult.uri; // Success!
      } else if (width > 300 && height > 300 && quality > 0.4) {
        // Still too big, AND we have room to shrink further
        const widthReduction =
          needsAggressiveReduction && iteration === 0 ? 0.5 : reductionFactor;
        const heightReduction =
          needsAggressiveReduction && iteration === 0 ? 0.5 : reductionFactor;

        console.log(
          `Still too big (${Math.round(fileSize / 1024)}KB). Reducing dimensions and quality...`,
        );

        // Call ourselves again with smaller dimensions and lower quality
        return compressImageIteratively(
          Math.floor(width * widthReduction),
          Math.floor(height * heightReduction),
          quality - 0.05, // Reduce quality slightly
          iteration + 1,
        );
      } else {
        // We can't shrink it any further without making it tiny or ugly
        console.warn(
          "Could not reach target size, returning best possible compression.",
        );
        return compressedResult.uri;
      }
    };

    // Start the iterative compression process
    return await compressImageIteratively(
      currentWidth,
      currentHeight,
      currentQuality,
      0,
    );
  } catch (error) {
    console.error("Unable to compress image : ", error);
    return null; // Something went wrong
  }
};
