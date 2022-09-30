const { User } = require('../models');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const jwt = require("jsonwebtoken");
const stripe = require('../config/stripeConnection')


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
              // "peteriscute",

              // DELPOYED:
              process.env.JWT_SECRET,
              {
                expiresIn: "6h"
              }
            );
            req.session.stundentId = req.body.studentId
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
  getStudents(req, res) {
    User.find()
      .then((users) => {
        return res.json(users.filter(user => !user.isAdmin));
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single user
  getSingleUser(req, res) {
    console.log(req.session)
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

  // update balance only
  updateBalance(req,res) {
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

  // create a new user
  async createUser(req, res) {
    try {
      const newUser = await User.create({
        email: req.body.email,
        studentId: req.body.studentId,
        name: req.body.name,
        balance: req.body.balance,
        isAdmin: req.body.isAdmin
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
    User.findOneAndRemove({ studentId: req.params.studentId })
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


  async getTokenData(req, res) {
    const token = req.headers?.authorization?.split(" ").pop();
    let tokenData;
    jwt.verify(token, "peteriscute", async (err, data) => {
      if (err) {
        console.log(err);
        const data = {
          err: "Token has expired"
        }
        return res.status(403).json(data);
      } else {
        tokenData = data
        const userData = await User.findOne({_id:tokenData.id})
        req.session.stundentId = userData.id
        console.log('userData: ' + userData)  
        res.json(userData);
      }
    });
  },

  async createCheckoutSession (req, res) {
    console.log(req.params)
    const user = await User.findById(req.params.userId)
    console.log(user)
    if (user.balance < 1) {
      return res.status(501).json({msg: "balance too small"})
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price_data: {
            unit_amount: (user.balance*100),
            currency: 'usd',
            product_data: {
              name: 'Outstanding Balance'
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/existing/payment_sucess`,
      cancel_url: `${req.headers.origin}/existing/payment_failed`,
    });
    
    res.redirect(303, session.url);
  }

};
