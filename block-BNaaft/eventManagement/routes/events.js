var express = require('express');
var router = express.Router();
const Event = require("../models/Event");
const Remark = require('../models/Remark');



// get all events
router.get('/',(req,res,next)=> {
    Event.find({}, (err,events)=> {
        if(err) return next(err);
        let categories = events.map(e => e.event_categories).flat().
        reduce((acc,cv)=>{
            if(!acc.includes(cv)) acc.push(cv);
            return acc;
        },[]);
        let locations = events.map(e => e.location).
        reduce((acc,cv)=> {
            if(!acc.includes(cv)) acc.push(cv);
            return acc;
        },[])
        res.render('listAllEvents',{events,categories,locations});
    })
})

// create new event
router.get('/new',(req,res,next)=> {
    res.render('createEventForm');
})
router.post('/',(req,res,next)=> {
    console.log(req.body ," :req.body")
    req.body.event_categories = req.body.event_categories.split(",")
    console.log(req.body.event_categories);
    Event.create(req.body,(err,event)=> {
        if(err) return next(err);
        
        res.redirect('/events');
    })
})



// edit event
router.get('/:id/edit',(req,res,next)=> {
    const id = req.params.id;
    Event.findById(id,(err,event)=> {
        if(err) return next(err);
        res.render('editEventForm',{event});
    })
})
router.post('/:id',(req,res,next)=> {
    const id = req.params.id;
    req.body.event_categories = req.body.event_categories.split(",");
    Event.findByIdAndUpdate(id,req.body,(err,event)=> {
        if(err) return next(err)
        res.redirect('/events/' + id);
    })
})

// delete event
router.get('/:id/delete',(req,res,next)=> {
    const id= req.params.id;
    Event.findByIdAndDelete(id,(err,event)=> {
        if(err) return next(err);
        Remark.deleteMany({"event" : event.id},(err,deletedRemark)=> {
            if(err) return next(err);
            res.redirect('/events');
        })
    })
})
// increment event likes
router.get('/:id/likes/increment',(req,res,next)=> {
    const id = req.params.id;
    Event.findByIdAndUpdate(id,{$inc : {likes : 1}},(err,event)=> {
        if(err) return next(err);
        res.redirect('/events/'+id);
    })
})
// decrement event likes
router.get('/:id/likes/decrement',(req,res,next)=> {
    const id = req.params.id;
    Event.findByIdAndUpdate(id,{$inc : {likes : -1}},(err,event)=> {
        if(err) return next(err);
        res.redirect('/events/'+id);
    })
})

// get single event
router.get('/:id',(req,res,next)=> {
    const id = req.params.id;
    Event.findById(id).populate('remarks').exec((err,event)=> {
        if(err) return next(err);
        res.render('listSingleEvent',{event});
    })

});

// create remark
router.post('/:id/remark',(req,res,next)=> {
    const id = req.params.id;
    req.body.event = id;
    console.log(req.body ," : inside remarksw")
    Remark.create(req.body,(err, remark)=> {
        if(err) return next(err);
        Event.findByIdAndUpdate(id,{$push : {remarks : remark.id}},(err,remark)=> {
            if(err) return next(err);
            res.redirect('/events/'+ id);
        })
    })
})

router.get('/:cat/sortByCategory',(req,res,next)=> {
    const cat = req.params.cat;
    Event.find({event_categories :cat},(err,events)=> {
        if(err) return next(err);
        Event.find({},(err,allEvents)=> {
            let categories = allEvents.map(e => e.event_categories).flat().
            reduce((acc,cv)=>{
                if(!acc.includes(cv)) acc.push(cv);
                return acc;
            },[]);
            let locations = allEvents.map(e => e.location).
            reduce((acc,cv)=> {
                if(!acc.includes(cv)) acc.push(cv);
                return acc;
            },[])
            res.render('listAllEvents',{events,categories,locations});
        })
        
    })
})

router.get('/:location/sortByLocation',(req,res,next)=> {
    const reqLocation = req.params.location;
    Event.find({location : reqLocation},(err,events)=> {
        if(err) return next(err);
        Event.find({},(err,allEvents)=> {
            let locations = allEvents.map(e => e.location).
            reduce((acc,cv)=>{
                if(!acc.includes(cv)) acc.push(cv);
                return acc;
            },[]);
            let categories = allEvents.map(e => e.event_categories).flat().
            reduce((acc,cv)=>{
                if(!acc.includes(cv)) acc.push(cv);
                return acc;
            },[]);
            console.log(locations, " :locations");
            res.render('listAllEvents',{events,locations,categories});
        });
        
    })
})


module.exports = router;
