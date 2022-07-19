const { User } = require('../models');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const jwt = require("jsonwebtoken");


module.exports = {

  login (req, res) {
    console.log(`login attempt for ${req.body.email}`)
    User.findOne({email:req.body.email}).then(dbUser=>{
        if(!dbUser){
            return res.status(403).json({err:"invalid email"})
        } 
        if (req.body.studentId === dbUser.studentId) {
            const token = jwt.sign(
              {
                email: dbUser.email,
                id: dbUser.id
              },
              // LOCAL:
              "peteriscute",

              // DELPOYED:
              // process.env.JWT_SECRET,
              {
                expiresIn: "6h"
              }
            );
            res.json({ 
                token: token, 
                user: dbUser
            });
          } else {
            res.status(403).json({err: "invalid studentId"});
          }
    }).catch(err=>{
        console.log(err)
        res.status(500).json({msg:"an error occured",err})
    })
  },
  // Get all users
  getUsers(req, res) {
    User.find()
      .then(async (users) => {
        const userObj = {
          users,
        };
        return res.json(userObj);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single user
  getSingleUser(req, res) {
    User.findOne({ studentId: req.params.studentId })
      // .select('-__v')
      .then(async (user) =>
        !user
          ? res.status(404).json({ message: 'No user with that studentId' })
          : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // Update a single user
  updateUser(req, res) {
    User.findOneAndUpdate(
      { studentId: req.params.studentId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with this id!' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  updateBalance(req,res) {
    User.findOneAndUpdate(
      { studentId: req.params.studentId },
      { $set: req.body.balance },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with this email!' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // create a new user
  async createUser(req, res) {
    try {
      const newUser = await User.create({
        email: req.body.email,
        studentId: req.body.studentId,
        name: req.body.name,
        balance: req.body.balance
      });
      console.log(`newUser: ${newUser}`)
      res.status(200).json(newUser);
    } catch (error) {
      console.log(error)
      res.status(500).json(error)
    }
  },

  // Delete a user and remove them from the course
  deleteUser(req, res) {
    User.findOneAndRemove({ email: req.params.email })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No such user exists' })
          : res.status(200).json({ message: 'Deleted!' })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },


  getTokenData(req, res) {
    const token = req.headers?.authorization?.split(" ").pop();
    jwt.verify(token, "spenceriscute", (err, data) => {
      if (err) {
        console.log(err);
        const data = {
          err: "Token has expired"
        }
        res.status(403).json(data);
      } else {
        User.findOne({_id:data.id}).then(userData=>{
          console.log(userData)  
          res.json(userData);
        })
      }
    });
  },

};
