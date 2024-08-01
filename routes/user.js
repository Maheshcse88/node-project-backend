const express = require('express');
const router = express.Router();

const user = require('../models/usermodel')

// get all the users data
router.get('/', async (req, res)=> {
    try{
        // console.log(req.query)
        const userData = await user.find();
        res.status(200).json({data: userData})
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

// get single user data
router.get('/:id',async (req, res)=> {
    try{
        const singleUser = await user.findById(req.params.id)
        if(singleUser){
            res.json({data: singleUser})
        }else{
            res.status(404).json({message: 'user not found'})
        }
    }catch(error){
        res.status(500).json({message: "Error occured"})
    }
})

//create a user
router.post('/new', async (req, res)=> {
    // console.log(req.body)
    const newUser = new user({userName: req.body.userName});
    await newUser.save();
    // user created in db and tested in postman
    res.status(200).json({message: "a new user created"})
})

//update the user details
// router.put('/update/:id', (req, res)=> {
//     console.log(req.params)
//     console.log(req.body)
//     //user details updated in db
//     res.status(200).json({message: "user details updated"})
// })

router.patch('/update/:id', async (req,res)=>{
    const singleUser = await user.findById(req.params.id);
    singleUser.userName = req.body.userName;
    await singleUser.save();
    res.status(200).json({message: 'user details updated'})
})

// user deleted on id
router.delete('/delete/:id', async (req, res)=> {
    // console.log(req.body)
   await user.findOneAndDelete(req.params.id)
    //user is deleted in db
    res.status(200).json({message: "user deleted"})
})
module.exports = router