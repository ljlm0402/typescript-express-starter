import { Controller, Get } from 'routing-controllers';

@Controller()
export class IndexController {
  @Get('/')
  index() {
    return 'OK';
  }
}
