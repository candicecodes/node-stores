const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
    res.render('index');
};

exports.addStore = (req, res) => {
    res.render('editStore', { title: 'Add Store'});
};


exports.createStore = async (req, res) =>{    
    const store = await (new Store(req.body)).save();
    //go in front of the thing that returns a promise, and await it
    req.flash('success', `Sucessfully Created ${store.name}. Care to leave a review?`);
    res.redirect(`/store/${store.slug}`);   
};

exports.getStores = async(req, res) => {
    //1. Query the database for a list of all stores
    const stores = await Store.find();
    console.log(stores);
    res.render('stores', { title: 'Stores', stores: stores })
}

exports.editStore = async (req, res) => {
    //1. Find the store given the ID
    const store = await Store.findOne({ _id: req.params.id });
    //2. Confirm they are the owner of the store
    //TODO
    //3. Render out the edit form so that the user can update their store
    res.render('editStore', { title: `Edit ${store.name}`, store });
    
}

exports.updateStore = async (req, res) => {
    //find and update the store
    //findOndAndUpdate is a mongoDB method that takes three parameters, (query, data, options)
    const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true, //return the new store instead of the old one
        runValidators: true,
    }).exec();
    req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store →</a>`);
    res.redirect(`/stores/${store._id}/edit`);
    //redirect them to the store and tell them it worked
}