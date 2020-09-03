const catchAsync = require('../../../utils/catchAsync');
const Users = require('../../../models/user.model');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await Users.find();

  res.status(200).json({
    length: users.length,
    users,
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = new Users({
    name: req.body.name.toString().trim(),
  });

  await newUser.save();

  res.status(201).json({
    status: 'success',
    message: 'New User Created Successfully!',
    user: newUser,
  });
});
