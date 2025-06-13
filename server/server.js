// Need to add methods to catch errors, and undo action to cache

const express = require('express');
const app = express()
const PORT = process.env.EXPRESS_CONTAINER_PORT || 4000 
const path = require('path')
const Items = require('./db/models/Items.js');
const bodyParser = require('body-parser')

app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, '../build')))

app.get('/', () => {
  res.sendFile('../build/index.html')
})

app.get('/items', (req, res) => {
  Items
    .fetchAll()
    .then( items => {
      res.json(items.serialize())
    }) 
    .catch( err => {
      console.log('error', err)
    })
})

app.post( '/', (req, res) => {
  const newItem = {
    task: req.body.task,
    description: req.body.description,
    priority: req.body.priority,
    type: req.body.type,
    sortingid: req.body.sortingid
  }

  Items
    .forge(newItem)
    .save()
    .then((data) => {
      return Items.fetchAll()
    })
    .then ( newItems => {
      res.json(newItems.serialize())
    })
    .catch(err => {
      console.log('error', err)
      res.json(err)
    })
})

app.put('/save', (req, res) => {

  let cache = req.body.currentCache;
  let updateSort = {};
  let id;
  
  for ( let i = 0; i < cache.length; i++ ) {
    id = cache[i].id;
    updateSort.sortingid = i+1;

    Items
      .where({id})
      .fetch()
      .then(update => {
        update.save(updateSort)
      })
      .catch(err => {
        console.log('error', err)
        res.json(err)
      })
  }
  
})

app.delete( '/:id', (req, res) => {
const id = req.body.item.id;

let newItem = {};
newItem.type = false;

  Items
    .where({ id })
    .fetch()
    .then(update => {
    return update.save(newItem)
    })
    .then ( newItems => {
      res.json(newItems.serialize())
    })
    .catch(err => {
      res.json(err);
    })
})

app.put( '/:id', (req, res) => {

  const id = parseInt(req.body.item.id);

  const newItem = {
    task: req.body.item.task,
    description: req.body.item.description,
    priority: req.body.item.priority,
    type: req.body.item.type
  }

  Items
  .where({id})
  .fetch()
  .then(update => {
    return update.save(newItem)
  })
  .then((data) => {
    return Items.fetchAll()
  })
  .then ( newItems => {
    res.json(newItems.serialize())
  })
  .catch(err => {
    console.log('error', err)
    res.json(err)
  })
})

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}...`)
})
