import { Router } from 'express';

interface Route {
  path?: string;
  router: Router;
}

export default Route;
