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
    versions: {
      v1: '/api/v1',
    },
    started: 1598438111934,
  });
};
