exports.getInfo = (req, res) => {
  res.status(200).json({
    developedBy: {
      name: 'Mubashir Hassan',
      username: 'mhm13dev',
    },
    project: {
      name: 'express-boilerplate',
      description: 'A Boilerplate For Express JS!',
    },
    version: '1.0.0',
    started: 1598438111934,
  });
};
