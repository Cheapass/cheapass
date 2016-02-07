import unirest from 'unirest';

export default async function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const Request = unirest.get(url);
    if (options.timeout) {
      Request.timeout(15000);
    }
    if (options.userAgent) {
      Request.headers({
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.94 Safari/537.36',
      });
    }
    Request.end((response) => {
      if (response.ok) {
        return resolve(response);
      }
      reject(response);
    });
  });
}
