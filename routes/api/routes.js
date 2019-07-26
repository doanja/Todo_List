const express = require("express");
const uuid = require("uuid");
const Joi = require('@hapi/joi');
const router = express.Router();
const database = require("../../Database");

// Route: Get All List Items
router.get("/", (req, res) => {
  res.json(database);
});

// Route: Get Single List Item
router.get("/:id", (req, res) => {
  // returns true or false if the parentID is found in the database
  const target = database.some(item => item.parentID === req.params.id);
  
  // if an ID exists in the database
  if (target) {
    // return matches in the database that belongs to the person
    res.json(database.filter(item => item.parentID === req.params.id));
    /* WIP: need logic to delete from the database */
  } else {
    // status 404 = bad request
    res.status(404).json({ msg: `No item with the id of ${req.params.id}` });
  }
});

// Route: Create a Single List Item
router.post("/", (req, res) => {
   // error out if all fields are not sent
  if (!req.body.todo) { /* WIP: add back || !req.body.parentID || !req.body.name  */
    return res.status(400).json({ msg: `Please include all required field` });
  }
  
  // create a new JSON object
  const newItem = {
    id: uuid.v4(), // ID will be generated by DB
    parentID: req.body.parentID, // get ID of the user currently logged in
    age: req.body.age,  // not used ?
    todo: req.body.todo,  // gets text from client when add item is clicked
    name: req.body.name // get the name of the user currently logged in
  };

  // when using mongoDB use mongoose and database.save(newItem)
  database.push(newItem); // add the item to the database
  res.json(database);
});

// Route: Update Single List Item
router.put("/:id", (req, res) => {
  // returns true or false if the ID is found in the database
  const target = database.some(item => item.id === req.params.id);

  // if an ID exists in the database
  if (target) {
    const updItem = req.body; // reference to the request's body

    /* when using a real database, this will be different */
    database.forEach(item => {
      // search the database
      if (item.id === req.params.id) {
        // if the ID matches one in the database, update the fields:
        item.parentID = updItem.parentID ? updItem.parentID : item.parentID;
        item.age = updItem.age ? updItem.age : item.age;
        item.todo = updItem.todo ? updItem.todo : item.todo;
        item.name = updItem.name ? updItem.name : item.name;

        res.json({ msg: "Item is updated", item });
      }
    });
  } else {
    // status 404 = bad request
    res.status(404).json({ msg: `No item with the id of ${req.params.id}` });
  }
});

router.delete("/:id", (req, res) => {
  // returns true or false if the ID is found in the database
  const target = database.some(item => item.id === req.params.id);

  // if an ID exists in the database
  if (target) {
    // delete the element from the array
    const index = database.indexOf(target);
    database.splice(index,1);
    // return all list items without the ID (req.param.id)
    res.json({
      msg: "Member deleted",
      database: database.filter(item => item.id !== req.params.id)
      
      /* WIP: need logic to delete from database */
    });
  } else {
    // status 404 = bad request
    res.status(404).json({ msg: `No item with the id of ${req.params.id}` });
  }
});

module.exports = router;
