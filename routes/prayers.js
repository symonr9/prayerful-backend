/***********************************************************************
 * File Name: prayers.js
 * Description: Implements the prayers router.
 * Author: Symon Ramos symonr12@gmail.com
 **********************************************************************/

var express = require("express");
const { check, validationResult } = require("express-validator");
const { generateCombination } = require("gfycat-style-urls");

var router = express.Router();

const User = require("../models/User");
const Prayer = require("../models/Prayer");

/**********************************************************************
 * URI: Get All Prayers
 * Notes: None
 **********************************************************************/
router.get("/", async (req, res) => {
  Prayer.find()
    .then(prayers => {
      res.status(200).json(prayers);
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

/**********************************************************************
 * URI: Get Prayers by User
 * Notes: None
 **********************************************************************/
router.get("/user/:username", async (req, res) => {
  try {
  let user = await User.findOne({
    username: req.params.username
  });
  if (!user) {
    console.log("Something went wrong: " + error);
    return res.status(400).json({
      message: "User does not exist"
    });
  }

  let ownPrayers = await Prayer.find({
    createdBy: req.params.username
  });

  let savedPrayers = await Prayer.find({
    '_id': { $in: user.prayers}
  });
 
  console.log('hello');
  console.log("own prayers: " + JSON.stringify(ownPrayers));
  console.log("saved prayers: " + JSON.stringify(savedPrayers));
  console.log('nice');
  let prayers = {
    own: ownPrayers,
    saved: savedPrayers
  };

  res.status(200).json(prayers);
    
  } catch(error) {
      console.log("Something went wrong: " + error);
      res.status(400).json({
        error: error
      });
    }
});

/**********************************************************************
 * URI: Get Prayers by Group
 * Notes: None
 **********************************************************************/
router.get("/group/:groupId", async (req, res) => {
  Prayer.find({
    groups: { $in: [req.params.groupId] }
  })
    .then(prayers => {
      res.status(200).json(prayers);
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

/**********************************************************************
 * URI: Get a Prayer by urlId.
 * Notes: None
 **********************************************************************/
router.get("/:urlId", (req, res, next) => {
  Prayer.findOne({
    urlId: req.params.urlId
  })
    .then(prayer => {
      res.status(200).json(prayer);
    })
    .catch(error => {
      res.status(404).json({
        error: error
      });
    });
});

/**********************************************************************
 * URI: Create Prayers
 * Notes: None
 **********************************************************************/
router.post(
  "/create",
  [
    //Validates input.
    check("title", "Please Enter a Valid Title")
      .not()
      .isEmpty(),
    check("body", "Please Enter a Valid Body")
      .not()
      .isEmpty()
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
    const { title, body, notes, groups, image, type, isPublic, createdBy } = req.body;
    
    //Use NPM library to generate random urlId.
    const urlId = `${generateCombination(2, "-")}`.toLowerCase();

    let prayer = new Prayer({
      urlId,
      title,
      body,
      notes,
      groups,
      image,
      type,
      isPublic,
      createdBy
    });

    prayer
      .save()
      .then(
        res.status(200).json({
          prayer
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
 * URI: Edit Prayers
 * Notes: Expects _id, not urlId. Because it is being called on an
 * existing item, _id is used instead of urlId because it is known.
 **********************************************************************/
router.put("/edit/:id", async (req, res, next) => {

  //Retrieve parameters from body (assumes application/json)
  const { title, body, notes, groups, image, type, isPublic, createdBy } = req.body;
    
  const _id = req.params.id;

  let urlId = "";
  try{
    let existingPrayer = await Prayer.findOne({
      _id
    });

    urlId = existingPrayer.urlId;
  }
  catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Server Error"
    });
  }

  const prayer = new Prayer({
    _id,
    urlId,
    title,
    body,
    notes,
    groups,
    image,
    type,
    isPublic,
    createdBy
  });

  Prayer.updateOne({ _id: req.params.id }, prayer)
    .then(() => {
      res.status(201).json({
        message: "Prayer updated successfully!"
      });
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

/**********************************************************************
 * URI: Delete Prayers
 * Notes: Expects _id, not urlId. Because it is being called on an
 * existing item, _id is used instead of urlId because it is known.
 **********************************************************************/
router.delete("/delete/:id", (req, res, next) => {
  Prayer.deleteOne({ _id: req.params.id })
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
