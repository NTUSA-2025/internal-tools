import { json, type Env } from '../../_shared';

export const onRequestPost: PagesFunction<Env> = async () => {
  return json({ ok: true });
};
