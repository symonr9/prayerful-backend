/***********************************************************************
 * File Name: groups.js
 * Description: Implements the groups router.
 * Author: Symon Ramos symonr12@gmail.com
 **********************************************************************/

var express = require("express");
const { check, validationResult } = require("express-validator");
const { generateCombination } = require("gfycat-style-urls");

var router = express.Router();

const Group = require("../models/Group");

/**********************************************************************
 * URI: Get All Groups
 * Notes: None
 **********************************************************************/
router.get("/", async (req, res) => {
  Group.find()
    .then(groups => {
      res.status(200).json(groups);
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

/**********************************************************************
 * URI: Get a Group by urlId.
 * Notes: None
 **********************************************************************/
router.get("/:urlId", (req, res, next) => {
  Group.findOne({
    urlId: req.params.urlId
  })
    .then(group => {
      res.status(200).json(group);
    })
    .catch(error => {
      res.status(404).json({
        error: error
      });
    });
});

/**********************************************************************
 * URI: Create Groups
 * Notes: None
 **********************************************************************/
router.post(
  "/create",
  [
    //Validates input.
    check("name", "Please Enter a Valid Title")
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    //Check for errors based on what was passed in
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    //Retrieve parameters from body (assumes application/json)
    const { name, about, notes, leaderName, type, isPublic } = req.body;

    //Use NPM library to generate random urlId.
    const urlId = `${generateCombination(2, "-")}`.toLowerCase();

    let group = new Group({
      urlId,
      name,
      about,
      notes,
      leaderName,
      type,
      isPublic
    });

    group
      .save()
      .then(
        res.status(200).json({
          group
        })
      )
      .catch(error => {
        res.status(400).json({
          error: error
        });
      });
  }
);

/**********************************************************************
 * URI: Edit Groups
 * Notes: Expects _id, not urlId. Because it is being called on an
 * existing item, _id is used instead of urlId because it is known.
 **********************************************************************/
router.put("/edit/:id", async (req, res, next) => {

  //Retrieve parameters from body (assumes application/json)
  const { name, about, notes, leaderName, type, isPublic } = req.body;

  const _id = req.params.id;

  let urlId = "";
  try{
    let existingGroup = await Group.findOne({
      _id
    });

    urlId = existingGroup.urlId;
  }
  catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Server Error"
    });
  }

  const group = new Group({
    _id,
    urlId,
    name,
    about,
    notes,
    leaderName,
    type,
    isPublic
  });


  Group.updateOne({ _id: req.params.id }, group)
    .then(() => {
      res.status(201).json({
        message: "Group updated successfully!"
      });
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

/**********************************************************************
 * URI: Delete Groups
 * Notes: Expects _id, not urlId. Because it is being called on an
 * existing item, _id is used instead of urlId because it is known.
 **********************************************************************/
router.delete("/delete/:id", (req, res, next) => {
  Group.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({
        message: "Deleted!"
      });
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

module.exports = router;
