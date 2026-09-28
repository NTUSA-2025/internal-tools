import { json, type Env } from '../../_shared';

export const onRequestGet: PagesFunction<Env> = async () => {
  return json({ user: null }, { status: 401 });
};
