const express = require('express');
const router = express.Router(); //so now we dont need app.get
const {check,validationResult} = require('express-validator'); 
const User = require('../models/User');
const auth = require('../middleware/auth');
const Contact = require('../models/Contact');

//@routes GET api/contacts
//@desc Get all user contacts
//@access Private

router.get('/',auth,async (req,res) => {
    // res.send("Get all contacts");
    try {
        const contacts = await Contact.find({user:req.user.id}).sort({date:-1});
        res.json(contacts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});

//@routes POST api/contacts
//@desc Add a new contact
//@access Private

router.post('/',[auth,[
    check('name','name is required').not().isEmpty()
]],async (req,res) => {
    // res.send("Add contacts");
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()}); //bad request
    }
    const {name,email,phone,type } = req.body;
    try {
        const newContact = new Contact({
            name,email,phone,type,user:req.user.id
        });
        const contact = await newContact.save();
        res.json(contact);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error occured")
    }
});

//@routes PUT api/contacts/:id
//@desc Update contacts
//@access Private

router.put('/:id',auth,async (req,res) => {
    // res.send("Update contacts");
    const {name,email,phone,type } = req.body;
    //Build contact object

    const contactFields = {};
    if(name) contactFields.name = name;
    if(email) contactFields.email = email;
    if(type) contactFields.type = type;
    if(phone) contactFields.phone = phone;

    try {
        let contact = await Contact.findById(req.params.id);
        if(!contact) // not found 
        {
            return res.status(404).json({msg:"Contact not found"});
        }
        //Make sure user owns contact
        if(contact.user.toString() !== req.user.id){
            return res.status(401).json({msg:"Not authorized"});
        }
        contact = await Contact.findByIdAndUpdate(req.params.id,
            {$set:contactFields},
            {new:true}
        );
        res.json(contact);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error occured")
    }
});

//@routes DELETE api/contacts/:id
//@desc Get all user contacts
//@access Private

router.delete('/:id',auth,async(req,res) => {
    // res.send("Delete contacts");
    try {
        let contact = await Contact.findById(req.params.id);
        if(!contact) // not found 
        {
            return res.status(404).json({msg:"Contact not found"});
        }
        //Make sure user owns contact
        if(contact.user.toString() !== req.user.id){
            return res.status(401).json({msg:"Not authorized"});
        }
        await Contact.findByIdAndDelete(req.params.id);
        res.json({msg:"Contact deleted"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error occured")
    }
});
module.exports = router;