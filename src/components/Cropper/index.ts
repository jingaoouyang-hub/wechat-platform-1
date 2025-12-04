import { withInstall } from '@/utils/common';
import cropperImage from './src/Cropper.vue';

export * from './src/typing';
export const CropperImage = withInstall(cropperImage);
