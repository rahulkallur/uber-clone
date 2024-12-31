import autocannon from 'autocannon';
import { PassThrough } from 'stream';

const run = () => {
  const urls = ['http://localhost:3000', 'http://localhost:3000/stress-test'];

  urls.forEach((url) => {
    const instance = autocannon({
      url,
      connections: 10, // number of concurrent connections
      duration: 30, // test duration in seconds
    });

    autocannon.track(instance, { renderProgressBar: true });

    const outputStream = new PassThrough();
    autocannon.track(instance, { outputStream });

    outputStream.on('data', (data) => {
      console.log(`Results for ${url}:`);
      console.log(data.toString());
    });

    instance.on('done', () => {
      console.log(`Test finished for ${url}!`);
    });
  });
};

run();