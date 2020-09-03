const fileAssets = require('../../GetFiles.json');

exports.getIndex = (req, res) => {
  res.render('pages/index', {
    assets: fileAssets.files.index.assets,
  });
};
