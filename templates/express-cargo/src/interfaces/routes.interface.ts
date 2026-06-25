import type { Router } from 'express';

export interface Routes {
  path?: string;
  router: Router;
}
