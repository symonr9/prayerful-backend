/***********************************************************************
 * File Name: users.js
 * Description: Implements the users router.
 * Author: Symon Ramos symonr12@gmail.com
 **********************************************************************/

var express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
var router = express.Router();

const User = require("../models/User");

/**********************************************************************
 * URI: Get All Users
 * Notes: None
 **********************************************************************/
router.get("/", async (req, res) => {
  User.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

/**********************************************************************
 * URI: Get Users by Group
 * Notes: None
 **********************************************************************/
router.get("/group/:groupId", async (req, res) => {
  User.find({
    groups: { $in: [req.params.groupId] }
  })
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});


/**********************************************************************
 * URI: Get User Info by username
 * Notes: None
 **********************************************************************/
router.get("/:username", async (req, res) => {
  User.find({
    username: req.params.username
  })
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});



function addGroup(_id, req, res) {
  const { id } = req.body;

  User.update(
    { _id: _id },
    { $push: { 
        groups: id
    } }
  ).then(() => {
    res.status(201).json({
      message: "User updated successfully!"
    });
  })
  .catch(error => {
    console.log("something went wrong: " + error);
    res.status(400).json({
      error: error
    });
  });
}


function removeGroup(_id, req, res) {
  const { id } = req.body;

  User.update(
    { _id: _id },
    { $pull: { 
        groups: {
          $in: [ id ]
        }
    } }
  ).then(() => {
    console.log("Successfully updated user!");
    res.status(201).json({
      message: "User updated successfully!"
    });
  })
  .catch(error => {
    console.log("something went wrong: " + error);
    res.status(400).json({
      error: error
    });
  });
}

function addPrayer(_id, req, res) {
  const { id } = req.body;
  
  User.update(
    { _id: _id },
    { $push: { 
        prayers: id
    } }
  ).then(() => {
    res.status(201).json({
      message: "User updated successfully!"
    });
  })
  .catch(error => {
    console.log("something went wrong: " + error);
    res.status(400).json({
      error: error
    });
  });
}


function removePrayer( _id, req, res ) {
  const { id } = req.body;

  User.update(
    { _id: _id },
    { $pull: { 
        prayers: {
          $in: [ id ]
        }
    } }
  ).then(() => {
    console.log("Successfully updated user!");
    res.status(201).json({
      message: "User updated successfully!"
    });
  })
  .catch(error => {
    console.log("something went wrong: " + error);
    res.status(400).json({
      error: error
    });
  });
}

async function newPassword(_id, req, res) {
  const { password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const newPass = await bcrypt.hash(password, salt);

  User.updateOne({ _id: req.params.id }, {password: newPass})
  .then(() => {
    res.status(201).json({
      message: "User updated successfully!"
    });
  })
  .catch(error => {
    console.log("ERROR: " + error);
    res.status(400).json({
      error: error
    });
  });

}

function edit(req, res) {
  //Retrieve parameters from body (assumes application/json)
  const { username, firstName, lastName, email, bio, image, type } = req.body;

  const user = new User({
    _id,
    username, 
    firstName,
    lastName,
    email, 
    bio, 
    image,
    type
  });

  User.updateOne({ _id: req.params.id }, user)
    .then(() => {
      res.status(201).json({
        message: "User updated successfully!"
      });
    })
    .catch(error => {
      console.log("ERROR: " + error);
      res.status(400).json({
        error: error
      });
    });
}

/**********************************************************************
 * URI: Edit User
 * Notes: Expects _id, not urlId. Because it is being called on an
 * existing item, _id is used instead of urlId because it is known.
 **********************************************************************/
router.put("/edit/:id", async (req, res, next) => {
  const { command } = req.body;
  const _id = req.params.id;

  try{
    let existingUser = await User.findOne({
      _id
    });
  }
  catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Server Error"
    });
  }

  console.log("command is: " + command);

  switch( command ) {
    case "ADD PRAYER":
      addPrayer(_id, req, res);
      break;
    case "ADD GROUP": 
      addGroup(_id, req, res);
      break;
    case "REMOVE PRAYER":
      removePrayer(_id, req, res);
      break;
    case "REMOVE GROUP":
      removeGroup(_id, req, res);
      break;
    case "NEW PASSWORD":
      newPassword(_id, req, res);
    case "EDIT":
      edit(req, res);
      break;
  }

});


/**********************************************************************
 * URI: Delete User
 * Notes: Expects _id, not urlId. Because it is being called on an
 * existing item, _id is used instead of urlId because it is known.
 **********************************************************************/
router.delete("/delete/:id", (req, res, next) => {
  User.deleteOne({ _id: req.params.id })
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


/**********************************************************************
 * URI: Signup
 * Notes: Creates user.
 **********************************************************************/
router.post("/signup",
  [],
  //Request, reponse
  async (req, res) => {
    //Retrieve parameters from body (assumes application/json)
    const { username, email, password } = req.body;

    try {
      //Look for the user where the email matches
      let user = await User.findOne({
        username
      });
      if (user) {
        return res.status(400).json({
          message: "User Already Exists"
        });
      }

      //Create new user model with passed information
      user = new User({
        username,
        email,
        password
      });

      //Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      //Save user
      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      //Return a token
      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 10000
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
            username
          });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);


/**********************************************************************
 * URI: Login
 * Notes: Logs user in, sets a user token.
 **********************************************************************/
router.post("/login",
  [],
  async (req, res) => {

    const { username, password } = req.body;
    try {
      let user = await User.findOne({
        username
      });

      if (!user){
        return res.status(400).json({
          message: "User Not Exist"
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch){
        return res.status(400).json({
          message: "Incorrect Password !"
        });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        "secret",
        {
          expiresIn: 3600
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
            username
          });
        }
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error"
      });
    }
  }
);

module.exports = router;
