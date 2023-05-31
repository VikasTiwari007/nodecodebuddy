const User = require("../schema/user.schema");

module.exports.getUsersWithPostCount = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Extract page number from query parameters
  const pageSize = parseInt(req.query.pageSize) || 10; // Extract page size from query parameters

  try {
    const totalCount = await User.countDocuments();

    const totalPages = Math.ceil(totalCount / pageSize);

    const users = await User.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const pagination = {
      totalDocs: totalCount,
      limit: pageSize,
      page: page,
      totalPages: totalPages,
      pagingCounter: (page - 1) * pageSize + 1,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    };

    const data = {
      users: users,
      pagination: pagination,
    };

    res.json(data);
  } catch (error) {
    res.send({ error: error.message });;
  }
};

