#!/bin/bash

echo "🎭 Converting Kanban app to read-only demo mode..."

# Create backup directory
mkdir -p backups
echo "📁 Creating backups..."
cp server/server.js backups/server.js.backup
cp src/actions/actions.js backups/actions.js.backup
cp src/App.css backups/App.css.backup

# Update server.js to read-only
echo "🔧 Updating server.js to read-only mode..."
cat > server/server.js << 'EOF'
const express = require('express');
const app = express()
const PORT = process.env.EXPRESS_CONTAINER_PORT || 4000 
const path = require('path')
const Items = require('./db/models/Items.js');
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../build')))

app.get('/', (req, res) => {
  res.sendFile('../build/index.html')
})

// ✅ KEEP: Read-only endpoint
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

// ❌ DISABLED: Write operations for demo security
/*
app.post( '/', (req, res) => {
  // ADD ITEM - Disabled for portfolio demo
  res.status(405).json({ 
    message: "Demo mode: Adding items disabled for portfolio security",
    action: "add"
  });
})

app.put('/save', (req, res) => {
  // SAVE/REORDER - Disabled for portfolio demo
  res.status(405).json({ 
    message: "Demo mode: Saving disabled for portfolio security",
    action: "save"
  });
})

app.delete( '/:id', (req, res) => {
  // DELETE ITEM - Disabled for portfolio demo
  res.status(405).json({ 
    message: "Demo mode: Deleting items disabled for portfolio security",
    action: "delete"
  });
})

app.put( '/:id', (req, res) => {
  // EDIT ITEM - Disabled for portfolio demo
  res.status(405).json({ 
    message: "Demo mode: Editing items disabled for portfolio security",
    action: "edit"
  });
})
*/

// 📖 Demo info endpoint
app.get('/demo-info', (req, res) => {
  res.json({
    message: "Portfolio Demo - Read Only Mode",
    features: [
      "Drag & drop visualization (client-side only)",
      "React + Redux architecture", 
      "Docker containerization",
      "PostgreSQL database",
      "Express.js API"
    ],
    note: "Write operations disabled for security. Full functionality available in development."
  });
})

app.listen(PORT, () => {
  console.log(`Kanban API listening on ${PORT}...`)
  console.log(`Read-only`)
})
EOF

# Update actions.js to client-side only
echo "🔧 Updating actions.js for client-side operations..."
cat > src/actions/actions.js << 'EOF'
import axios from 'axios';

export const GET_ALL_ITEMS = 'GET_ALL_ITEMS';
export const ADD_ITEM = 'ADD_ITEM';
export const DELETE_ITEM_BY_ID = 'DELETE_ITEM_BY_ID';
export const EDIT_ITEM_BY_ID = 'EDIT_ITEM_BY_ID';
export const REORDER_ITEM = 'REORDER_ITEM';
export const CHANGE_ITEM_TYPE = 'CHANGE_ITEM_TYPE';
export const SET_VISIBLE_TO_TRUE = 'SET_VISIBLE_TO_TRUE';
export const SET_VISIBLE_TO_FALSE = 'SET_VISIBLE_TO_FALSE';

let cache = []; // Initialize cache

export const getAllItems = () => {
    return dispatch => {
        axios.get('/items')
            .then( response => {
                cache = [...response.data];
                for ( let i = 0; i < cache.length; i++ ) {
                    cache[i].sortingid = i+1;
                }
                dispatch({type: GET_ALL_ITEMS, payload: cache})
            })
            .catch( err => {
                console.log('Error fetching items:', err)
            })
    }
};

// 🎭 DEMO MODE: All modifications work locally but don't persist
export const addItem = (item) => {
    // Create new item with demo styling
    const newItem = {
        ...item,
        id: Date.now(), // Simple ID for demo
        sortingid: cache.length + 1,
        task: item.task || 'New Task',
        description: item.description || 'Demo task - changes not saved',
        priority: item.priority || 'Medium',
        type: item.type || 'Todo'
    };

    cache = [...cache, newItem];
    
    // Show demo notification instead of API call
    console.log('🎭 DEMO MODE: Task added locally (not saved to database)');
    
    return dispatch => {
        dispatch({type: ADD_ITEM, payload: cache})
    }
};

export const deleteItemByIdAction = (item, currentCache) => {
    cache = cache.filter(cacheItem => cacheItem.id !== item.id);
    
    console.log('🎭 DEMO MODE: Task deleted locally (not saved to database)');
    
    return dispatch => {
        dispatch({type: DELETE_ITEM_BY_ID, payload: cache})
    }
};

export const editItem = (item) => {
    const index = cache.findIndex(element => element.id === item.id);
    if (index !== -1) {
        cache[index] = { ...cache[index], ...item };
    }
    
    console.log('🎭 DEMO MODE: Task edited locally (not saved to database)');
    
    return dispatch => {
        dispatch({type: EDIT_ITEM_BY_ID, payload: cache})
    }
};

export const reorderItem = ( result, list, startIndex, endIndex, destination, source, currentCache ) => {
    let sameArr = cache.filter(item => item.type === destination.droppableId);
    let temp = sameArr[endIndex].sortingid-1;
    let temp2 = sameArr[startIndex].sortingid-1;
    let tempId = sameArr[endIndex].sortingid;

    sameArr[startIndex].sortingid = tempId; 
    let [removed] = cache.splice(temp2, 1);
    cache.splice(temp, 0, removed);

    for (let i = 0; i < cache.length; i++) {
      cache[i].sortingid = i+1
    };

    console.log('🎭 DEMO MODE: Items reordered locally (not saved to database)');

    return dispatch => {
        dispatch({type: REORDER_ITEM, payload: cache})
    }
};
  
export const changeItemType = (result) => {
    let sourceArr = cache.filter(item => item.type === result.source.droppableId)
    let changeType = sourceArr[result.source.index]
    changeType.type = result.destination.droppableId;

    console.log('🎭 DEMO MODE: Item moved locally (not saved to database)');
  
    return dispatch => {
        dispatch({type: CHANGE_ITEM_TYPE, payload: cache})
    } 
};

export const setVisibleTrue = () => {
    return dispatch => {
        dispatch({type: SET_VISIBLE_TO_TRUE, payload: true } )
    } 
};

export const setVisibleFalse = () => {
    return dispatch => {
        dispatch({type: SET_VISIBLE_TO_FALSE, payload: false } )
    } 
};
EOF

# Add demo banner styles to App.css
echo "🎨 Adding demo banner styles to App.css..."
cat >> src/App.css << 'EOF'

/* Demo Banner Styles */
.demo-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 8px 20px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.demo-banner a {
  color: #ffd700;
  text-decoration: none;
  font-weight: bold;
}

.demo-banner a:hover {
  text-decoration: underline;
}

.demo-note {
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  color: #856404;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  font-size: 12px;
  text-align: center;
}
EOF

# Add demo banner to App.js (insert after the header)
echo "🎨 Adding demo banner to App.js..."
# Create a temporary file with the banner inserted
awk '
/^        <\/header>/ { 
    print $0
    print ""
    print "        {/* Demo Banner */}"
    print "        <div className=\"demo-banner\">"
    print "          🎭 Portfolio Demo - Interactive features work locally | Built with Docker + React + PostgreSQL"
    print "        </div>"
    next 
}
{ print }
' src/App.js > src/App.js.tmp && mv src/App.js.tmp src/App.js

echo "✅ Conversion complete!"
echo ""
echo "📁 Backups saved in ./backups/"
echo "🔧 Server.js: Read-only mode enabled"
echo "🔧 Actions.js: Client-side operations only"
echo "🎨 App.css: Demo styles added"
echo "🎨 App.js: Demo banner added"
echo ""
echo "🐋 Next steps:"
echo "   docker-compose restart react-kaban"
echo "   open http://localhost:3002"
echo ""
echo "🎯 Features:"
echo "   ✅ Drag & drop works (client-side)"
echo "   ✅ Add/edit/delete works (client-side)"
echo "   ✅ Safe for deployment (no DB writes)"
echo "   ✅ Shows Docker + full-stack skills"
EOF
