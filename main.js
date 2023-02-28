var db;

const dbname = 'database.base64';
const list_element = 'periodic';


// Reconstitute a base64 image back into a binary blob
function base64ToBinary(data) {
    var rawLength = data.length;
    var array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; i++) {
        array[i] = data.charCodeAt(i);
    }
    return array.buffer;
}

// Fetch a file from the local webserver
async function fetchLocal(fileName, completedCallback) {
    return fetch(fileName
    ).then(response => response.text()
    ).then(function(response) { completedCallback(response); }
    ).catch(function (error) {
        console.log("Fetch Error:" + error );
    });
}

// Load and initialize a sqlite database
function loadDatabase(postDatabaseInitFunc) {
    console.log("** Initializing sqlite database")
    self.sqlite3InitModule({
        print: console.log,
        printErr: console.error
    }).then(function (sqlite3) {
        try {
            fetchLocal(dbname, function (data) {
                const dataArray = new Uint8Array(base64ToBinary(atob(data)));
                const p = sqlite3.wasm.allocFromTypedArray(dataArray);
                db = new sqlite3.oo1.DB();
                db.onclose = { after: function () { sqlite3.wasm.dealloc(p) } };
                const rc = sqlite3.capi.sqlite3_deserialize(
                    db.pointer, 'main', p, dataArray.length, dataArray.length,
                    0
                );
                // Everything was ok.  Call post-init
                postDatabaseInitFunc();
            });
        } catch (e) {
            console.error("Exception:", e.message);
        }
    });
}

// Build the periodic table
function buildTable(searchString) {
    // Select the whole table
    db.exec({
        sql: `SELECT * FROM pt WHERE AtomicMass < 100`,
        rowMode: 'object',
        callback: function (row) {
            // Insert this element into the page
            //console.log(row);
            addElement(row.Element, row.Symbol, row.AtomicNumber, row.AtomicMass);
        }.bind({ counter: 0 })
    });
}

// Add an entry to the list
function addElement(name, symbol, atomicNumber, mass) {
    const periodic_table = document.getElementById(list_element);

    let li = document.createElement("li");
    li.innerHTML=atomicNumber + ' -- ' + symbol + ' -- ' + mass + ' -- ' + name;
    periodic_table.appendChild(li);
}



// Main entry point - executes after page load due to 'defer' in index.html
loadDatabase(buildTable);
