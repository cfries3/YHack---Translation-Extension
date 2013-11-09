var idbSupported = false;
var db;
setupdb();

function setupdb(){

    if("indexedDB" in window) {
        idbSupported = true;
        console.log("indexedDB supported");
    }
 
    if(idbSupported) {
        //second var is version number, increase when adding new object Stores
        var openRequest = indexedDB.open("langDictionary",10);
        console.log(openRequest);
 
        //add any object stores here
        openRequest.onupgradeneeded = function(e) {
            console.log("Upgrading...");
            var thisDB = e.target.result;

            if(!thisDB.objectStoreNames.contains("french")) {
                var frenchObjStore = thisDB.createObjectStore("french", {keyPath: "nativeWord"});
                frenchObjStore.createIndex("nativeWord", "nativeWord", {unique:true});
                console.log("french store created");
            }

            if(!thisDB.objectStoreNames.contains("english")) {
                var englishObjStore = thisDB.createObjectStore("english", {keyPath: "nativeWord"});
                englishObjStore.createIndex("nativeWord", "nativeWord", {unique:true});
                console.log("english store created");
            }

            if(!thisDB.objectStoreNames.contains("spanish")) {
                var spanishObjStore = thisDB.createObjectStore("spanish", {keyPath: "nativeWord"});
                spanishObjStore.createIndex("nativeWord", "nativeWord", {unique:false});
                console.log("spanish store created");
            }

            if(!thisDB.objectStoreNames.contains("norwegian")) {
                var norwegianObjStore = thisDB.createObjectStore("norwegian", {keyPath: "nativeWord"});
                norwegianObjStore.createIndex("nativeWord", "nativeWord", {unique:true});
                console.log("norwegian store created");
            }
        }
 
        openRequest.onsuccess = function(e) {
            console.log("Success, in finding database");
            db = e.target.result;
        }
 
        openRequest.onerror = function(e) {
            console.log("Error, in finding database");
            console.dir(e);
        }
    }
}


//check if word is in database
function checkDB(storeName, nativeL, nativeW, foreignL, foreignW, thisSite) {

    var transaction = db.transaction([storeName],"readwrite");
    var store = transaction.objectStore(storeName);
    var index = store.index("nativeWord");
    var bool = false;

    var request = index.get(nativeW.toLowerCase());

    //error finding entry
    request.onerror = function(e) {
        console.log("Error, finding entry in store", e.target.error.name);
    }

    //success in finding/looking for entry
    request.onsuccess = function(e) {
        console.log("Success, finding entry in store");
        var result = e.target.result;
        
        if (result != null) {
            //if the word already exists
            console.log("result is not null");
            updateWord(storeName, result, thisSite);
        } else {
            //if the word is new
            console.log("result is null");
            result = {
                nativeLang: nativeL,
                nativeWord: nativeW,
                foreignLang: foreignL, //is it needed? in the Learn French store
                foreignWord: foreignW,
                frequency: 1,
                site: [thisSite]
            };

            //put the new object in the db
            var added = store.put(result);

            added.onerror = function(e) {
                console.log("Error, entry has not been added", e.target.error.name);
                //handle error
            }

            added.onsuccess = function(e) {
                console.log("Success, entry has been added");
            } 
        }
    }
}


//removing data
function updateWord (storeName, oldObj, thisSite) {
 
    //desired store    
    var transaction = db.transaction([storeName], "readwrite");
    var store = transaction.objectStore(storeName);

    var cursor = store.openCursor();

    cursor.onsuccess = function(e) {
        var res = e.target.result;
        if (res) {
            var obj = res.value;
            if (obj["nativeWord"] == oldObj["nativeWord"]) {
                console.log("found matching entry");
                var request = store.delete(res.key); 

                request.onerror = function(e) {
                    console.log("Error, delete entry failed", e.target.error.name);
                }

                request.onsuccess = function(e) {
                    console.log("Success, delete entry worked");
                    oldObj["frequency"] = oldObj["frequency"] + 1;
                    oldObj["site"].push(thisSite); 

                    //put the new object in the db
                    var added = store.put(oldObj);

                    added.onerror = function(e) {
                        console.log("Error, adding updated entry", e.target.error.name);
                        //handle error
                    }

                    added.onsuccess = function(e) {
                        console.log("Success, adding updated entry");
                    } 
                }           
            }
        res.continue();  
        }
    }
}



//return list of all words in the store
function readObjectStore(storeName) {
    
    //desired store    
    var transaction = db.transaction([storeName], "readonly");
    var store = transaction.objectStore(storeName);
    var langSet = [];

    //iteration over set
    var cursor = store.openCursor();

    cursor.onsuccess = function(e) {
        var res = e.target.result;
        if (res) {
            //compile list of objects
            langSet.push(res.value);
            console.log(res.value);
            res.continue();  
        }
        return langSet;
    }
}

            
