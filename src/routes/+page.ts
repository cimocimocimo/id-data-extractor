import type { PageLoad } from './$types';
import { loadOpenCv } from '$lib/camera';

export const ssr = false;

export const load: PageLoad = () => {
  loadOpenCv();
  return {};
};
