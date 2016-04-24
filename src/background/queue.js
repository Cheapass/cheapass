import kue from 'kue';
const queue = kue.createQueue();

import * as processor from './queueProcessor';

queue.on('job complete', processor.handleJobComplete);
queue.on('job failed', processor.handleJobFailed);
queue.on('job error', processor.handleJobError);

kue.app.listen(6001);

export default queue;
