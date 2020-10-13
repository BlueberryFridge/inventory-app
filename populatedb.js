console.log('This is a script that populates the inventory-app database.');

// get arguments passed on CLI
// i.e., enter on CLI: node populatedb <your mongo url>
// note: async must be installed
var userArgs = process.argv.slice(2);

var async = require('async');
var Category = require('./models/category');
var Items = require('./models/items');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('Error', console.error.bind(console, 'MongoDB connection error:'));

var items = [];
var categories =[];

function categoryCreate(name, description, cb) {
    const category = new Category({ name, description });
    category.save(function(err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log(`new category: ${category}`);
        categories.push(category);
        cb(null, category);
    });
}

function itemCreate(name, description, category, price, numberInStock, cb) {
    const item = new Items({
        name,
        description,
        category,
        price,
        number_in_stock: numberInStock
    });
    item.save(function(err) {
        if (err) {
            console.log(`J'étais ici!`, err, price, numberInStock);
            cb(err, null);
            return;
        }
        console.log(`new item: ${item}`);
        items.push(item);
        cb(null, item);
    });
}

// use async.series for order of items is important; 
// each item is pushed into 'categories' array for usage in another function
function createCategories(cb) {
    async.series([
        function(callback) {categoryCreate('Skin Care', 'This includes facial cleansers, serums, creams, lotions, et cetera. ', callback)},
        function(callback) {categoryCreate('Home Improvement', 'Here you shall see the furniture, kitchen items, basic hardware store items, and many more.', callback)},
        function(callback) {categoryCreate('Office Items', 'School items are available as well and the list here is not limited to office supplies.', callback)},
        function(callback) {categoryCreate('Computers and Mobile Devices', 'Items here include computers and mobile devices, as well as accessories for these.', callback)},
        function(callback) {categoryCreate('Electronics', 'Items included here are electronic parts.', callback)},
    ], cb );
}

function createItems(cb) {
    async.parallel([
        function(callback) {itemCreate('Nature Republic Aloe Vera Gel', '92% aloe vera extract that soothes the skin.', categories[0], 250, 23, callback)},
        function(callback) {itemCreate('Raspberry Pi 4 4GB Model B', 'The Raspberry Pi 4 Model B is the latest computer board from Raspberry Pi. This latest version offers more processing power, more memory and more connectivity while being backward compatible with the projects created on previous models.', categories[4], 3250, 9, callback)},
        function(callback) {itemCreate('e-Gizmo gizDuino UNO-SE ATMEG328P Arduino Uno R3 Compatible Board +USB Cable', "gizDuino UNO-SE (Student's Edition) is 100% code compatible with Arduino Uno. It is built for the budget but with the best possible quality. To obtain to most competitive price, we used the same USB bridge CH340 universally used by China UNO compatible manufacturers. Hence, if you are already user of these boards, you can switch to the gizDuino UNO-SE and not notice a difference in usage.", categories[4], 145, 3, callback)},
        function(callback) {itemCreate('New OrangePi PCH3 Quad-core 64bit Learning Development Board', 
                                `CPU: H3 Quad-core Cortex-A7 H.265/HEVC 4K
                                GPU: Mali400MP2 GPU @600MHz
                                Supports OpenGL ES 2.0 
                                Memory (SDRAM): 1GB DDR3 (shared with GPU)
                                Onboard Storage: TF card (Max. 64GB) / MMC card slot
                                Onboard Network: 10/100 Ethernet RJ45`, categories[4], 2592, 10, callback)},
        function(callback) {itemCreate('COSRX BHA Blackhead Power Liquid', 'BHA Blackhead Power Liquid contains 4% betaine salicylate, which helps reduce blackheads, and niacinamide to lighten dark spots.', categories[0], 1038, 14, callback)},
        function(callback) {itemCreate('A`PIEU MadecassoSide CICA GEL', 'Soothes and heals dry skin.', categories[0], 780, 5, callback)},
        function(callback) {itemCreate('NIVEA Intensive Moisture Body Milk ', 'NIVEA Intensive Moisture Body Milk has 50x more Vitamin E to nourish and repair dry, damaged skin for smoother, softer skin. It provides effective & natural care with 24-hour non-stop moisture. See visibly moisturized skin after 7 days: NIVEA INTENSIVE MOISTURE BODY MILK.', categories[0], 349, 10, callback)},
        function(callback) {itemCreate('Garnier Micellar Cleansing Water Blue', 'Finally, your skincare is made simple with Garnier Micellar Water: 3-IN-1 Skincare. With its specialized micelle technology, the Garnier Micellar Water deeply cleanses, tones and removes make up in one easy step! No need to rub or rinse with water to get rid of dirt, oil & makeup. Garnier Micellar Water can be used as an alternative to soap/facewash, toner, and makeup remover. No fragrance added!', categories[0], 99, 5, callback)},
        function(callback) {itemCreate('10 inch Wireless Bluetooth Keyboard Mouse Set Lightweight Portable For iPad Phone Colorful', "7in. keyboard is suitable for ipad mini's size (The keyboard and mouse are each equipped with a data cable, which is used to charge the keyboard or mouse, not to connect the keyboard and mouse. The product is a wireless device, no wire connection is required.", categories[3], 435, 4, callback)},
        function(callback) {itemCreate('Sandisk Memory Card Micro SD Card Class10 TF Card Flash Drive USB 16GB', "Ideal for Android™-based smartphones and tablets. Please insert microSDXC and support microSDHC microSD card slot to use. Supports high speed SD bus interface specifications in the new UHS-I. Only with the support of UHS-I devices used in UHS-I mode.", categories[3], 158, 11, callback)},
        function(callback) {itemCreate('1080P HD Webcam Web Camera Computer', 
                                `480P:0.5 Mega Pixels 
                                720P:1 Mega Pixels
                                1080P(SD):1 Mega Pixels
                                1080P(HD):2 Mega Pixels`, categories[3], 672, 6, callback)},
        function(callback) {itemCreate('AMD Ryzen 3 3200G with Radeon Vega 8 Graphics Processor 3.6 GHz Quad-Core AM4 Desktop Processor', 
                                `Brand: AMD
                                Model: 3200G
                                Applicable type: desktop
                                Slot type: AM4
                                Number of cores: Quad core
                                Three-level cache capacity: 4MB
                                Chip manufacturing process: 12nm`, categories[3], 5930, 2, callback)},
        function(callback) {itemCreate('Heart Style Line String Door Curtain Assel Window Curtain', 
                                `Style Line String Door Curtain Assel Window Curtain 
                                Size: 2m x 1m`, categories[1], 35, 3, callback)},
        function(callback) {itemCreate('Plain Curtain', 
                                `Dark grey
                                Size: 60cm x 75cm`, categories[1], 230, 6, callback)},
        function(callback) {itemCreate('AS New Multifunction Computer Desk',
                                `Computer Desk Writing Study Desk Table with 4 Tier Bookshelves & 3 Drawers for Home & Office
                                Multifunctional desk with large desk space, 4-tier bookshelves and 3 drawers.
                                Color: Light Brown
                                Material: Medium-Density Laminated Fiberboard
                                Dimensions(L x W x H): 120cm x 42.4cm x 120cm`, categories[1], 1999, 3, callback)},
        function(callback) {itemCreate('A5 Muji styled notebook blank', 'Blank notebook for writing university notes or whatever fancies you.', categories[2], 89, 5, callback) },
        function(callback) {itemCreate('Double-headed candy coloured marker', 'Visual window, double head design.', categories[2], 35, 4, callback)},
        function(callback) {itemCreate('Retro Helm String Faux Leather Journal Travel Blank Diary', 'A very beautiful gift for yourself or your friend. Vintage style and feel. Use it for your diary, travel journal and note.', categories[2], 348, 5, callback)}
    ], cb );
}

async.series([ createCategories, createItems ], function(err, results) {
    if(err) console.log(`FINAL ERR: ${err}`);
    else console.log(`Items created: ${items}`);
    // all done, disconnect database
    console.log('All done!');
    mongoose.connection.close();
});