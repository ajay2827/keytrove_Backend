const express = require('express');
const {client , Redis} = require('../db/Redis');
const Key = require('../models/Features');
const router = express.Router();
const authFunction = require('../auth')

router.post('/',async(req,res)=>{
    try {     
        const {key,authtoken}=req.body;
        const email=await authFunction(authtoken);        
        const features = await Key.find({ email: email, key: key });
        if (features.length === 0) {
            console.info('Enter a valid key ');
            res.status(400).json({ msg: 'Enter a valid key' })
            return;
        }
        const val = await client.get(`${features[0]._id}`);
        if(val==1)
        {
            res.status(200).json(features[0]);
        }
        else 
        {
            await Key.deleteOne({email:email ,_id:`${features[0]._id}`});
            res.status(400).json({msg:"key is not present"});
        }
       
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }

})

module.exports=router