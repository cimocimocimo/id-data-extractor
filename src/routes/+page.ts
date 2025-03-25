import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = () => {
  let utils = new Utils();
  utils.loadOpenCv(() => console.log('loaded'));
  return {};
};
