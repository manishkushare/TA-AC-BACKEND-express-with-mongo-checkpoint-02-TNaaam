const express = require('express');
const router = express.Router();
const Remark = require('../models/Remark');
const Event = require('../models/Event');

router.get('/:id/edit',(req,res,next)=> {
    const id = req.params.id;
    Remark.findById(id,(err,remark)=> {
        res.render('editRemarkForm',{remark});
    })
})
router.post('/:id',(req,res,next)=> {
    const id= req.params.id;
    Remark.findByIdAndUpdate(id,req.body,(err,remark)=> {
        if(err) return next(err)
        res.redirect('/events/'+ remark.event);
    })
})

router.get('/:id/likes/increment',(req,res,next)=> {
    const id = req.params.id;
    Remark.findByIdAndUpdate(id,{$inc : {"remark_likes" : 1}},(err,updatedRemark)=> {
        if(err) return next(err);
        res.redirect('/events/' + updatedRemark.event);
    })
})
router.get('/:id/likes/decrement',(req,res,next)=> {
    const id = req.params.id;
    Remark.findByIdAndUpdate(id,{$inc : {"remark_likes" : -1}},(err,updatedRemark)=> {
        if(err) return next(err);
        res.redirect('/events/' + updatedRemark.event);
    })
})

router.get('/:id/delete',(req,res,next)=> {
    const id = req.params.id;
    Remark.findByIdAndDelete(id,(err,deletedRemark)=> {
        if(err) return next(err);
        Event.findByIdAndUpdate(deletedRemark.event,{$pull : {remarks : deletedRemark.id}},(err,event)=> {
            if(err) return next(err);
            res.redirect('/events/'+ deletedRemark.event);
        })
    })
})
module.exports = router;