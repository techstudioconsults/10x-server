const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Resource = require('../models/Resources');
const uploadImage = require('../utils/uploadImage');



//@desc     Get all resources
// @route   GET /api/v1/resources
// @access  Public
const getResources = asyncHandler(async(req, res, next) => {
    res.status(200).json(res.advancedResults);
 });


 
//@desc     Get single resource
// @route   GET /api/v1/resource/:id
// @access  Public
const getResource = asyncHandler(async(req, res, next) => {
    const resource = await Resource.findById(req.params.id);

    if(!resource){
        return next(new ErrorResponse(`No resource with the id of ${req.params.id}`, 404))
      }
    

    res.status(200).json({ success: true, data: resource });
 });

  //@desc   Create Resource
// @route   POST /api/v1/resource
// @access  Private/Admin
const createResource = asyncHandler(async(req, res, next) => {
 
      // Make sure user is an admin
      if(req.user.role !== 'admin'){
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to add resources`, 401));
    }

    console.log(req.files);

    const photoUrl = await uploadImage(req.files.photo.tempFilePath);
      req.body.photo = photoUrl;
     
    const resource = await Resource.create(req.body);

 
    res.status(201).json({ success: true, data: resource });
 });


  //@desc   Update Resource
// @route   PUT /api/v1/resources/:id
// @access  Private/Admin
const updateResource = asyncHandler(async(req, res, next) => {
  
    let resource = await Resource.findById(req.params.id);

    if(!resource){
      return next(new ErrorResponse(`No resource with the id of ${req.params.id }`, 404))
    }


     // Make sure user is an admin
     if(req.user.role !== 'admin'){
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update resource ${resource._id}`, 401));
    }

    resource = await Resource.findByIdAndUpdate(req.params.id, req.body,{
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: resource });
 });

 
  //@desc   Delete resource
// @route   DELETE /api/v1/resources/:id
// @access  Private/Admin
const deleteResource = asyncHandler(async(req, res, next) => {
    const resource = await Resource.findById(req.params.id)
 
    
  if(!resource){
    return next(new ErrorResponse(`No resource with the id of ${req.params.id }`, 404))
  }

     // Make sure user is an admin
     if(req.user.role !== 'admin'){
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete resource ${resource._id}`, 401));
    }

    await Resource.deleteOne({ _id: req.params.id});
 
    res.status(200).json({ success: true, data: {}});
 });


 module.exports = { getResources, getResource, createResource, updateResource, deleteResource };