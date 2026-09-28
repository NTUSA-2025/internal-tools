import { notImplemented, type Env } from '../../_shared';

export const onRequestGet: PagesFunction<Env> = async () => {
  return notImplemented('short_url_list');
};

export const onRequestPost: PagesFunction<Env> = async () => {
  return notImplemented('short_url_create');
};
