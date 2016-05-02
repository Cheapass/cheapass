import { isUrl, isScrapable } from '../middlewares/index';
import scraper from '../controllers/scraper';

const routes = (server) => {
  // handler to process incoming scrape requests
  server.post('/scrape', isUrl, isScrapable, scraper);
};

export default routes;
