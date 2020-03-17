import express from 'express';
import next from 'next';
import bodyParser from 'body-parser';

import { OrbitService } from './orbit/service.mjs';
import Memory from '@orbit/memory';
import OrbitData from "@orbit/data";

const MemorySource = Memory.default;
const Schema = OrbitData.Schema;

// console.log(JSON.stringify(OrbitData));
// console.log(JSON.stringify(MemorySource));
for (let key in MemorySource) {
  console.log(key);
}
const app = next({
  dir: '.',
  dev: true
})


const handle = app.getRequestHandler();

let server;
app.prepare()
.then(() => (
  OrbitService.initialize({
    MemorySource,
    Schema
  })
))
.then(() => {

    server = express();

    server.use(express.json({ type: 'application/vnd.api+json' }));
    server.use(bodyParser.json());

    server.get('*', (req, res, next) => {
      if (!req.url.startsWith('/api')) {
        handle(req, res, req.url);
      } else {
        next();
      }
    });

    server.get('/api/posts/:id', async (req, res) => {
      const pid = req.params.id;

      const post = await OrbitService.memory.query(q => q.findRecord({ type: "post", id: pid }));

      return res.json({ data: post });
    });

    server.get('/api/posts', async (req, res) => {
      const posts = await OrbitService.memory.query(q => q.findRecords("post"));

      return res.json({ data: posts });
    });

    server.post('/api/posts', async (req, res) => {
      const post = req.body.data;
      post.type = 'post';

      try {
        await OrbitService.memory.update(t => [
          t.addRecord(post)
        ]);
      } catch (e) {
        console.log(e);
      }

      return res.json(req.body);
    });




    server.listen(3000, (err) => {
      if (err) throw err
      console.log('> Ready on http://localhost:3000')
    })

})
.catch(err => {
    console.log('An error occurred, unable to start the server')
    console.log(err)
});