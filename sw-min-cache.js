self.importScripts('./OfflineAssets/sw-toolbox/sw-toolbox.js');

//setting our cache name and structure
const tyCaches = {
    'static': 'static-v3',
    'dynamic': 'dynamic-v3'
}

//installing the service worker
self.addEventListener('install', function(event){
    self.skipWaiting();
    event.waitUntil(//wait until promises finish installing then return Promise
        //inserting the resources into the caches API
        caches.open(tyCaches.static)
        .then(function(cache){
            return cache.add([
                '/OfflineAssets/offline.html',
            ]);
        }));
})

self.addEventListener('activate', function(event){
    
    event.waitUntil(
        caches.keys()
        .then(function(keys){
            //using the Promise.all() static method to handle the filter of sw since it's an asych task
            return Promise.all(keys.filter(function(key){
                return !Object.values(tyCaches).includes(key);
            }).map(function(key){
                return caches.delete(key);
            }))
        })
    )
})

/*
//this allows users to add items to the cache as they navigate through application.
function fetchAndUpdate(request){
    return fetch(request)
    .then(function(res){
        if(res) {
            return caches.open(tyCaches.dynamic)//opens a version of cache we already have in our cache Storage
            .then(function(cache){
                return cache.put(request, res.clone()) //puts the request and a clone of the response to the cache API
                .then(function(){
                    return res;
                });
            });
        }
    })
}



//Using our Service worker
self.addEventListener('fetch', function(event){
    event.respondWith(
        caches.match(event.request)
        .then(function(res){
            if(res)
                return res;
            if(!navigator.onLine)//if offline
                return caches.match(new Request('/OfflineAssets/offline.html'));//returns our offline page
            
            return fetchAndUpdate(event.request);//fetches and saves the resources triggered by the users
        }));
});
*/


//using sw Tool box to handle all GET request to the resources in the ./OfflineAssets directory
toolbox.router.get('/OfflineAssets/*', toolbox.cacheFirst, {
    cache: {
        name: tyCaches.static,
        maxAgeSeconds: 60 * 60 * 24 * 356 //1 year
    }
});

//Using the service worker ToolBox TO save all user generated resources.
toolbox.router.get('/*', function(request, values, options) { 
 return toolbox.networkFirst(request, values, options)
 .catch(function(err){
    return caches.match(new Request('/OfflineAssets/offline.html'));
 });
}, {
    networkTimeoutSeconds: 3,
    cache: {
        name: tyCaches.dynamic,
        maxEntries: 15
    }
})

