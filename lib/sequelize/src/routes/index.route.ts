import { Router } from 'express';
import IndexController from '../controllers/index.controller';
import Route from '../interfaces/routes.interface';

class IndexRoute implements Route {
  public router = Router();
  public indexController = new IndexController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', this.indexController.index);
  }
}

export default IndexRoute;
